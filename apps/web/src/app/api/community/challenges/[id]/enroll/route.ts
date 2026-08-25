import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

/** POST /api/community/challenges/[id]/enroll — enroll current user in a challenge */
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

    const participation = await prisma.challengeParticipation.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      create: { userId, challengeId },
      update: {},
    })

    return NextResponse.json({ ok: true, data: { participation } })
  } catch (err) {
    console.error('[POST /api/community/challenges/[id]/enroll]', err)
    return NextResponse.json({ ok: false, error: 'Failed to enroll' }, { status: 500 })
  }
}
