import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

/** GET /api/community/membership — current user's tier + usage stats */
export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const [member, subscription] = await Promise.all([
      prisma.communityMember.findUnique({ where: { userId } }),
      prisma.subscription.findUnique({ where: { userId } }),
    ])

    // Tier precedence: an active paid subscription always implies a paid
    // community tier, even if CommunityMember.tier hasn't been synced yet.
    const tier =
      subscription?.status === 'active' ? subscription.plan || 'paid' : member?.tier ?? 'free'
    const isFree = tier === 'free'

    return NextResponse.json({
      ok: true,
      data: {
        tier,
        isFree,
        member: member ?? null,
        subscription: subscription ?? null,
      },
    })
  } catch (err) {
    console.error('[GET /api/community/membership]', err)
    return NextResponse.json({ ok: false, error: 'Failed to load membership' }, { status: 500 })
  }
}
