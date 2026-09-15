import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { getLessonById } from '@/lib/lms-data'
import {
  signPlaybackToken,
  generateForensicHash,
  maskEmail,
  getSanitizedYouTubeParams,
} from '@/lib/lms-security'

export const dynamic = 'force-dynamic'

/**
 * POST /api/lms/lessons/[lessonId]/playback-session
 * Authenticates student session, checks course entitlement in packages/db,
 * and returns a 15-minute expiring signed JWT along with unlisted YouTube ID,
 * sanitized iframe flags, and forensic dynamic watermark credentials.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } },
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Authentication required to access lesson playback' },
        { status: 401 },
      )
    }

    const userId = session?.user?.id || 'demo-client-user'
    const userEmail = session?.user?.email || 'dev@aumveda.com'
    const userName = session?.user?.name || 'Sacred Seeker'
    const userRole = (session?.user as any)?.role || 'user'

    const lessonId = params.lessonId
    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: 'Missing lesson ID' },
        { status: 400 },
      )
    }

    // 1. Check database first via Prisma
    let lessonData: {
      id: string
      title: string
      youtubeVideoId: string
      durationSeconds: number
      isFreePreview: boolean
      courseId: string
      courseTitle: string
      isPaid: boolean
      isEnrolled: boolean
    } | null = null

    try {
      const dbLesson = await prisma.courseLesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: {
              course: {
                include: {
                  enrollments: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      })

      if (dbLesson && dbLesson.module?.course) {
        const course = dbLesson.module.course
        const isEnrolled = course.enrollments.some(
          (e) => e.status === 'ACTIVE' || e.status === 'COMPLETED',
        )

        lessonData = {
          id: dbLesson.id,
          title: dbLesson.title,
          youtubeVideoId: dbLesson.youtubeVideoId,
          durationSeconds: dbLesson.durationSeconds,
          isFreePreview: dbLesson.isFreePreview || dbLesson.module.isPreview,
          courseId: course.id,
          courseTitle: course.title,
          isPaid: course.isPaid || Number(course.priceINR) > 0,
          isEnrolled,
        }
      }
    } catch (dbErr) {
      console.warn('[LMS DB Query Warning] Falling back to curriculum data:', (dbErr as any)?.message)
    }

    // 2. Fallback to cached/seeded curriculum data if not found in DB
    if (!lessonData) {
      const fallbackInfo = await getLessonById(lessonId, userId)
      if (fallbackInfo) {
        lessonData = {
          id: fallbackInfo.lesson.id,
          title: fallbackInfo.lesson.title,
          youtubeVideoId: fallbackInfo.lesson.youtubeVideoId,
          durationSeconds: fallbackInfo.lesson.durationSeconds,
          isFreePreview: fallbackInfo.lesson.isFreePreview || Boolean(fallbackInfo.module.isPreview),
          courseId: fallbackInfo.course.id,
          courseTitle: fallbackInfo.course.title,
          isPaid: fallbackInfo.course.isPaid || fallbackInfo.course.priceINR > 0,
          isEnrolled: fallbackInfo.course.enrolled,
        }
      }
    }

    if (!lessonData) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 },
      )
    }

    // 3. Entitlement verification
    const isAdminOrPractitioner =
      userRole === 'admin' ||
      userRole === 'super_admin' ||
      userRole === 'practitioner' ||
      userRole === 'archana' ||
      userRole === 'sejal'

    const hasAccess =
      isAdminOrPractitioner ||
      !lessonData.isPaid ||
      lessonData.isEnrolled ||
      lessonData.isFreePreview

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course enrollment required to view this lesson.',
          requiresEnrollment: true,
          courseId: lessonData.courseId,
        },
        { status: 403 },
      )
    }

    // 4. Generate 15-minute expiring JWT (900 seconds TTL)
    const token = signPlaybackToken(
      {
        sub: userId,
        userEmail,
        lessonId: lessonData.id,
        courseId: lessonData.courseId,
        videoId: lessonData.youtubeVideoId,
      },
      900,
    )

    // 5. Generate forensic anti-piracy dynamic watermark metadata
    const studentHash = generateForensicHash(userId, userEmail)
    const masked = maskEmail(userEmail)
    const timestampUtc = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

    // 6. Sanitized YouTube iframe parameters
    const origin = req.nextUrl.origin || 'https://aumveda.com'
    const sanitizedParams = {
      ...getSanitizedYouTubeParams(),
      origin,
    }

    return NextResponse.json({
      success: true,
      token,
      expiresInSeconds: 900,
      videoId: lessonData.youtubeVideoId,
      lessonTitle: lessonData.title,
      courseTitle: lessonData.courseTitle,
      durationSeconds: lessonData.durationSeconds,
      sanitizedParams,
      forensicWatermark: {
        studentHash,
        maskedEmail: masked,
        studentName: userName,
        timestamp: timestampUtc,
      },
    })
  } catch (err: any) {
    console.error('[Playback Session Route Error]:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
