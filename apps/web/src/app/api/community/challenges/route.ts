import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

/**
 * GET /api/community/challenges — active challenges (started, still within
 * their duration window) plus the current user's participation status for
 * each one.
 */
export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        participations: {
          where: { userId },
        },
      },
    })

    const now = Date.now()
    const withStatus = challenges.map((c) => {
      const endsAt = new Date(c.startDate.getTime() + c.durationDays * 86_400_000)
      const isActive = c.startDate.getTime() <= now && endsAt.getTime() >= now
      const participation = c.participations[0] ?? null
      return {
        id: c.id,
        title: c.title,
        durationDays: c.durationDays,
        profileTargets: c.profileTargets,
        chakraTargets: c.chakraTargets,
        startDate: c.startDate,
        endsAt,
        isActive,
        participation,
      }
    })

    return NextResponse.json({ ok: true, data: { challenges: withStatus } })
  } catch (err) {
    console.error('[GET /api/community/challenges]', err)
    return NextResponse.json({ ok: false, error: 'Failed to load challenges' }, { status: 500 })
  }
}
