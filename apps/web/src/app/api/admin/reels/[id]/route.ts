import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const patchSchema = z.object({
  action: z.enum(['approve', 'reject']),
})

/**
 * Approve/reject a pending reel. See src/app/api/admin/reels/route.ts for how
 * approval state maps onto the existing isPublished/approvedBy fields.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const existing = await prisma.reel.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Reel not found' }, { status: 404 })
    }

    const reel = await prisma.reel.update({
      where: { id },
      data:
        parsed.data.action === 'approve'
          ? { isPublished: true, publishedAt: new Date(), approvedBy: session.user.id }
          : { isPublished: false, publishedAt: null, approvedBy: session.user.id },
    })

    return NextResponse.json({ ok: true, data: { reel } })
  } catch (err) {
    console.error('[api/admin/reels/[id]] PATCH error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update reel' }, { status: 500 })
  }
}
