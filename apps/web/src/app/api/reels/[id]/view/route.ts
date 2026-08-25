import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { REEL_CONTENT_TYPE } from '@/lib/reels'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  completionPercent: z.number().min(0).max(100),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reel = await prisma.reel.findUnique({ where: { id }, select: { id: true } })
    if (!reel) {
      return NextResponse.json({ ok: false, error: 'Reel not found' }, { status: 404 })
    }

    // sendBeacon() sends a Blob with no Content-Type header guarantee across
    // browsers, so fall back to parsing text as JSON if req.json() fails.
    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      try {
        rawBody = JSON.parse(await req.text())
      } catch {
        rawBody = {}
      }
    }

    const parsed = bodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    // Anonymous viewers are allowed — attribute the view when a session exists.
    const session = await getApiSession()

    await prisma.contentView.create({
      data: {
        userId: session?.user?.id ?? null,
        contentType: REEL_CONTENT_TYPE,
        contentId: id,
        completionPercent: parsed.data.completionPercent,
      },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[api/reels/[id]/view] POST error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
