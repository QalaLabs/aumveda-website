import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'all']).default('pending'),
})

/**
 * Reel has no dedicated status enum — the approval state is derived from
 * `isPublished` / `approvedBy`:
 *   pending  -> isPublished = false, approvedBy = null   (untouched submission)
 *   approved -> isPublished = true,  approvedBy = adminId
 *   rejected -> isPublished = false, approvedBy = adminId (reviewed, declined)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const { status } = querySchema.parse({ status: searchParams.get('status') ?? undefined })

    const where =
      status === 'pending'
        ? { isPublished: false, approvedBy: null }
        : status === 'approved'
        ? { isPublished: true }
        : status === 'rejected'
        ? { isPublished: false, approvedBy: { not: null } }
        : {}

    const reels = await prisma.reel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, data: { reels } })
  } catch (err) {
    console.error('[api/admin/reels] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load reels' }, { status: 500 })
  }
}
