import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/community/challenges/[id]/check-in — record a day's progress on
 * a challenge. Increments `ChallengeParticipation.daysCompleted` (the field
 * available on the schema for streak/progress tracking) up to
 * `Challenge.durationDays`, and sets `completedAt` once the target is
 * reached.
 */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const challengeId = params.id

  try {
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } })
    if (!challenge) {
      return NextResponse.json({ ok: false, error: 'Challenge not found' }, { status: 404 })
    }

    const existing = await prisma.challengeParticipation.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    })
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: 'Not enrolled in this challenge' },
        { status: 400 }
      )
    }

    if (existing.completedAt) {
      return NextResponse.json({ ok: true, data: { participation: existing, alreadyComplete: true } })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (existing.lastCheckInAt && existing.lastCheckInAt.getTime() === today.getTime()) {
      return NextResponse.json({ ok: true, data: { participation: existing, alreadyCheckedInToday: true } })
    }

    const daysCompleted = Math.min(existing.daysCompleted + 1, challenge.durationDays)
    const nowComplete = daysCompleted >= challenge.durationDays

    const participation = await prisma.challengeParticipation.update({
      where: { userId_challengeId: { userId, challengeId } },
      data: {
        daysCompleted,
        lastCheckInAt: today,
        completedAt: nowComplete ? new Date() : null,
      },
    })

    if (nowComplete) {
      await prisma.communityMember.upsert({
        where: { userId },
        create: { userId, challengesCompleted: 1, lastActiveAt: new Date() },
        update: { challengesCompleted: { increment: 1 }, lastActiveAt: new Date() },
      })
    }

    return NextResponse.json({ ok: true, data: { participation } })
  } catch (err) {
    console.error('[POST /api/community/challenges/[id]/check-in]', err)
    return NextResponse.json({ ok: false, error: 'Failed to check in' }, { status: 500 })
  }
}
