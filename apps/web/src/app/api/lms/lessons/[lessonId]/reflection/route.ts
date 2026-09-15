import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { saveLessonReflection, getLessonById } from '@/lib/lms-data'

export const dynamic = 'force-dynamic'

const reflectionSchema = z.object({
  reflectionText: z.string().min(1, 'Reflection text cannot be empty'),
  mood: z.number().min(1).max(5).optional(),
})

/**
 * POST /api/lms/lessons/[lessonId]/reflection
 * Saves in-lesson micro-journal reflection note directly into the student's personal
 * Journal table and links it to LessonReflection for AHI context and course tracking.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { lessonId: string } },
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Authentication required to save journal reflection' },
        { status: 401 },
      )
    }

    const userId = session?.user?.id || 'demo-client-user'
    const body = await req.json().catch(() => null)
    const parsed = reflectionSchema.safeParse(body ?? {})

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid reflection input' },
        { status: 400 },
      )
    }

    const { reflectionText, mood } = parsed.data
    const lessonId = params.lessonId

    // Fetch lesson metadata for rich journal categorization
    const lessonInfo = await getLessonById(lessonId, userId)
    const lessonTitle = lessonInfo?.lesson?.title || 'Course Lesson Reflection'
    const courseTitle = lessonInfo?.course?.title || 'Aumveda Academy'

    // 1. Direct write to user's Journal table in packages/db
    let journalId: number | null = null
    try {
      const journalEntry = await prisma.journal.create({
        data: {
          userId,
          title: `LMS Reflection: ${lessonTitle}`,
          body: reflectionText,
          mood: mood ?? 3,
          tags: ['lms', 'reflection', courseTitle],
          practitionerVisible: true,
          isDeleted: false,
        },
      })
      journalId = journalEntry.id
    } catch (journalErr) {
      console.warn('[Journal Direct Create Warning]:', (journalErr as any)?.message)
    }

    // 2. Persist in LessonReflection and cache
    await saveLessonReflection(
      userId,
      lessonId,
      reflectionText,
      mood,
      lessonTitle,
      courseTitle,
    )

    return NextResponse.json({
      success: true,
      journalId,
      lessonId,
      message: 'In-lesson micro-journal reflection saved directly to your Sacred Journal.',
      savedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[LMS Reflection Route Error]:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
