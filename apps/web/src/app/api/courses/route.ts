import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { r2PublicUrl } from '@/lib/r2'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [published, enrolments, progressRows] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        thumbnailKey: true,
        isPaid: true,
        priceCents: true,
        modules: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            durationSec: true,
            isPreview: true,
            orderIndex: true,
          },
        },
      },
    }),
    prisma.enrolment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    }),
    prisma.courseProgress.findMany({
      where: { userId: session.user.id },
      select: { moduleId: true, completedAt: true, watchedSec: true },
    }),
  ])

  const enrolledSet = new Set(enrolments.map((e) => e.courseId))
  const progressByModule = new Map(progressRows.map((p) => [p.moduleId, p]))

  const courses = published.map((course) => {
    const enrolled = enrolledSet.has(course.id)
    const modules = course.modules.map((m) => {
      const prog = progressByModule.get(m.id)
      return {
        id: m.id,
        title: m.title,
        durationSec: m.durationSec,
        isPreview: m.isPreview,
        orderIndex: m.orderIndex,
        completed: Boolean(prog?.completedAt),
        watchedSec: prog?.watchedSec ?? 0,
      }
    })

    const completedModules = modules.filter((m) => m.completed).length
    const totalModules = modules.length
    const progress = totalModules ? Math.round((completedModules / totalModules) * 100) : 0
    const continueModule = enrolled
      ? modules.find((m) => !m.completed) ?? modules[modules.length - 1] ?? null
      : null

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailKey ? r2PublicUrl(course.thumbnailKey) : null,
      isPaid: course.isPaid,
      priceCents: course.priceCents,
      enrolled,
      progress,
      completedModules,
      totalModules,
      continueModuleId: continueModule?.id ?? null,
      continueModuleTitle: continueModule?.title ?? null,
      modules: enrolled ? modules : modules.filter((m) => m.isPreview),
    }
  })

  return NextResponse.json({
    success: true,
    user: { id: session.user.id, email: session.user.email ?? '' },
    courses,
  })
}
