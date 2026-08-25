import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

/** GET /api/community/circles — upcoming live circles first, then past */
export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const [upcoming, past] = await Promise.all([
      prisma.liveCircle.findMany({
        where: { scheduledAt: { gte: now } },
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.liveCircle.findMany({
        where: { scheduledAt: { lt: now } },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
      }),
    ])

    return NextResponse.json({ ok: true, data: { upcoming, past } })
  } catch (err) {
    console.error('[GET /api/community/circles]', err)
    return NextResponse.json({ ok: false, error: 'Failed to load circles' }, { status: 500 })
  }
}

const rsvpSchema = z.object({
  circleId: z.string().min(1),
})

/** POST /api/community/circles — RSVP to a live circle (idempotent per user+circle via LiveCircleRSVP). */
export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json().catch(() => null)
  const parsed = rsvpSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const circle = await prisma.liveCircle.findUnique({
      where: { id: parsed.data.circleId },
    })
    if (!circle) {
      return NextResponse.json({ ok: false, error: 'Circle not found' }, { status: 404 })
    }

    // Idempotent: only the first RSVP for this user+circle increments the counters.
    const existing = await prisma.liveCircleRSVP.findUnique({
      where: { userId_circleId: { userId, circleId: circle.id } },
    })
    if (existing) {
      return NextResponse.json({ ok: true, data: { circle, alreadyRsvped: true } })
    }

    const [, updatedCircle] = await Promise.all([
      prisma.liveCircleRSVP.create({ data: { userId, circleId: circle.id } }),
      prisma.liveCircle.update({
        where: { id: circle.id },
        data: { attendeeCount: { increment: 1 } },
      }),
      prisma.communityMember.upsert({
        where: { userId },
        create: { userId, circlesAttended: 1, lastActiveAt: new Date() },
        update: { circlesAttended: { increment: 1 }, lastActiveAt: new Date() },
      }),
    ])

    return NextResponse.json({ ok: true, data: { circle: updatedCircle } })
  } catch (err) {
    console.error('[POST /api/community/circles]', err)
    return NextResponse.json({ ok: false, error: 'Failed to RSVP' }, { status: 500 })
  }
}
