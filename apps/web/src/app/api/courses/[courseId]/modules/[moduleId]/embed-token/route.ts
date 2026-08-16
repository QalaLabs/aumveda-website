import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { signCourseToken } from '@/lib/course-token'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } },
) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const courseId = parseInt(params.courseId, 10)
  const moduleId = parseInt(params.moduleId, 10)
  if (isNaN(courseId) || isNaN(moduleId)) {
    return NextResponse.json({ success: false, error: 'Invalid ids' }, { status: 400 })
  }

  const courseModule = await prisma.module.findFirst({
    where: {
      id: moduleId,
      courseId,
      course: { isPublished: true },
    },
    select: { id: true, isPreview: true, course: { select: { isPaid: true } } },
  })

  if (!courseModule) {
    return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
  }

  const isFree = !courseModule.course.isPaid
  const isPreview = courseModule.isPreview

  if (!isFree && !isPreview) {
    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    })
    if (!enrolment) {
      return NextResponse.json(
        { success: false, error: 'Enrolment required for this content' },
        { status: 403 },
      )
    }
  }

  const token = signCourseToken({
    sub: session.user.id,
    courseId,
    moduleId,
  })

  return NextResponse.json({ success: true, token })
}
