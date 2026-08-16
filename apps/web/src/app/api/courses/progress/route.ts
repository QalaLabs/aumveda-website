import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

const schema = z.object({
  courseId: z.union([z.number(), z.string()]),
  moduleId: z.union([z.number(), z.string()]),
  progress: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body ?? {})
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const { courseId, moduleId, progress, status } = parsed.data

  const courseModule = await prisma.module.findUnique({
    where: { id: Number(moduleId) },
    select: { id: true, courseId: true, durationSec: true },
  })
  if (!courseModule || courseModule.courseId !== Number(courseId)) {
    return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 })
  }

  const enrolment = await prisma.enrolment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: courseModule.courseId },
    },
    select: { id: true },
  })
  if (!enrolment) {
    return NextResponse.json({ success: false, error: 'Enrolment required' }, { status: 403 })
  }

  const watchedSec =
    progress != null && courseModule.durationSec
      ? Math.round((progress / 100) * courseModule.durationSec)
      : undefined

  await prisma.courseProgress.upsert({
    where: {
      userId_moduleId: { userId: session.user.id, moduleId: courseModule.id },
    },
    create: {
      userId: session.user.id,
      moduleId: courseModule.id,
      completedAt: status === 'completed' ? new Date() : null,
      watchedSec: watchedSec ?? 0,
    },
    update: {
      ...(watchedSec != null && { watchedSec }),
      ...(status === 'completed' && { completedAt: new Date() }),
    },
  })

  return NextResponse.json({ success: true })
}
