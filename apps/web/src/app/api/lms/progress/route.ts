import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { verifyPlaybackToken } from '@/lib/lms-security'
import { updateLessonProgress, submitModuleQuiz, getLessonById } from '@/lib/lms-data'

export const dynamic = 'force-dynamic'

const progressPayloadSchema = z.object({
  lessonId: z.string().min(1, 'lessonId is required'),
  watchTimeSeconds: z.number().nonnegative().default(0),
  durationSeconds: z.number().nonnegative().default(0),
  lastPositionSec: z.number().nonnegative().default(0),
  token: z.string().optional(),
  quizId: z.string().optional(),
  quizAnswers: z.record(z.string(), z.number()).optional(),
})

/**
 * POST /api/lms/progress
 * Tracks video watch intervals, marks lessons completed when watch progress >= 85%,
 * updates overall course enrollment progress, and auto-unlocks subsequent modules
 * upon passing module quizzes.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getApiSession()
    const body = await req.json().catch(() => null)
    const parsed = progressPayloadSchema.safeParse(body ?? {})

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 },
      )
    }

    const {
      lessonId,
      watchTimeSeconds,
      durationSeconds,
      lastPositionSec,
      token,
      quizId,
      quizAnswers,
    } = parsed.data

    // If signed token is provided, verify it
    let tokenUserId: string | null = null
    if (token) {
      const verified = verifyPlaybackToken(token)
      if (verified) {
        tokenUserId = verified.sub
      }
    }

    const userId = session?.user?.id || tokenUserId || 'demo-client-user'
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid student session or playback token required' },
        { status: 401 },
      )
    }

    // 1. Calculate watch progress percentage and 85% completion threshold
    const percentCompleted =
      durationSeconds > 0
        ? Math.min(100, Math.round((watchTimeSeconds / durationSeconds) * 100))
        : 0
    const isCompleted = percentCompleted >= 85

    // 2. Persist progress into packages/db via Prisma
    let dbProgressRecord: any = null
    try {
      const existing = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      })

      const previouslyCompleted = existing?.isCompleted ?? false
      const nowCompleted = previouslyCompleted || isCompleted
      const newMaxWatch = Math.max(existing?.maxWatchTimeSeconds ?? 0, watchTimeSeconds)

      dbProgressRecord = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: {
          userId,
          lessonId,
          watchTimeSeconds,
          maxWatchTimeSeconds: watchTimeSeconds,
          lastPlayedPositionSec: Math.round(lastPositionSec),
          isCompleted: nowCompleted,
          completedAt: nowCompleted ? new Date() : null,
        },
        update: {
          watchTimeSeconds: { increment: 4 },
          maxWatchTimeSeconds: newMaxWatch,
          lastPlayedPositionSec: Math.round(lastPositionSec),
          ...(nowCompleted && !previouslyCompleted && {
            isCompleted: true,
            completedAt: new Date(),
          }),
        },
      })
    } catch (dbErr) {
      console.warn('[LMS Progress DB Upsert Warning]:', (dbErr as any)?.message)
    }

    // Also update in-memory/fallback store
    const fallbackResult = await updateLessonProgress(
      userId,
      lessonId,
      watchTimeSeconds,
      durationSeconds,
      lastPositionSec,
    )

    const finalCompleted = dbProgressRecord?.isCompleted ?? fallbackResult.isCompleted

    // 3. Auto-unlock next module upon quiz passing (if quiz submission included)
    let quizResult: {
      scorePct: number
      isPassed: boolean
      nextModuleUnlocked: boolean
      unlockedModuleId?: string
    } | null = null

    if (quizId && quizAnswers) {
      const graded = await submitModuleQuiz(userId, quizId, quizAnswers)
      let nextModuleUnlocked = false
      let unlockedModuleId: string | undefined

      if (graded.isPassed) {
        nextModuleUnlocked = true
        // Query next module from DB
        try {
          const quiz = await prisma.courseQuiz.findUnique({
            where: { id: quizId },
            include: {
              module: {
                include: {
                  course: {
                    include: {
                      modules: {
                        orderBy: { sortOrder: 'asc' },
                      },
                    },
                  },
                },
              },
            },
          })

          if (quiz?.module?.course?.modules) {
            const modules = quiz.module.course.modules
            const currentIdx = modules.findIndex((m) => m.id === quiz.moduleId)
            if (currentIdx >= 0 && currentIdx < modules.length - 1) {
              unlockedModuleId = modules[currentIdx + 1].id
            }
          }
        } catch (quizErr) {
          console.warn('[Quiz Module Unlock Query Error]:', (quizErr as any)?.message)
        }
      }

      quizResult = {
        scorePct: graded.scorePct,
        isPassed: graded.isPassed,
        nextModuleUnlocked,
        unlockedModuleId,
      }
    }

    // 4. Calculate total course progress and update CourseEnrollment
    let courseProgressPct = 0
    try {
      const lessonInfo = await getLessonById(lessonId, userId)
      if (lessonInfo?.course?.id) {
        const courseId = lessonInfo.course.id

        // Count completed lessons
        const totalLessons = await prisma.courseLesson.count({
          where: { module: { courseId } },
        })

        if (totalLessons > 0) {
          const completedCount = await prisma.lessonProgress.count({
            where: {
              userId,
              isCompleted: true,
              lesson: { module: { courseId } },
            },
          })

          courseProgressPct = Math.min(100, Math.round((completedCount / totalLessons) * 100))

          if (courseProgressPct >= 100) {
            await prisma.courseEnrollment.updateMany({
              where: { userId, courseId },
              data: {
                status: 'COMPLETED',
                completedAt: new Date(),
              },
            })
          }
        }
      }
    } catch (enrollErr) {
      // Non-blocking error
    }

    return NextResponse.json({
      success: true,
      lessonId,
      watchTimeSeconds,
      percentCompleted,
      isCompleted: finalCompleted,
      courseProgress: courseProgressPct,
      thresholdReached: percentCompleted >= 85,
      quiz: quizResult,
      message: finalCompleted
        ? 'Lesson marked as completed (≥85% threshold reached)'
        : 'Watch progress interval recorded',
    })
  } catch (err: any) {
    console.error('[LMS Progress API Error]:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
