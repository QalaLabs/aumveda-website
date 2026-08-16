import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { z } from 'zod'

const createSchema = z.object({
  practitioner: z.string().min(1),
  serviceType: z.string().min(1),
  bookingDatetime: z.string().min(1),
  durationMinutes: z.number().int().positive().optional(),
  amountPaid: z.number().nonnegative().optional(),
  razorpayPaymentId: z.string().optional().nullable(),
  zoomLink: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { practitioner, serviceType, bookingDatetime, durationMinutes, amountPaid, razorpayPaymentId, zoomLink } = parsed.data

    const when = new Date(bookingDatetime)
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: 'Invalid booking time.' }, { status: 400 })
    }

    // The session's user id is authoritative — never trust a client-supplied userId.
    const userId = session.user.id

    const booking = await prisma.booking.create({
      data: {
        userId,
        practitioner,
        serviceType,
        bookingDatetime: when,
        durationMinutes: durationMinutes || 60,
        amountPaid: amountPaid ?? 0,
        razorpayPaymentId: razorpayPaymentId || null,
        zoomLink: zoomLink || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ ok: true, data: booking })
  } catch (e) {
    console.error('BOOKINGS POST ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

const patchSchema = z.object({
  bookingId: z.string().min(1),
  status: z.string().optional(),
  razorpayPaymentId: z.string().optional().nullable(),
  zoomLink: z.string().optional().nullable(),
})

export async function PATCH(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { bookingId, status, razorpayPaymentId, zoomLink } = parsed.data

    // Ownership check — only the owner of the booking may update it.
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { userId: true },
    })
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(status && { status }),
        ...(razorpayPaymentId && { razorpayPaymentId }),
        ...(zoomLink && { zoomLink }),
      },
    })

    return NextResponse.json({ ok: true, data: booking })
  } catch (e) {
    console.error('BOOKINGS PATCH ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
