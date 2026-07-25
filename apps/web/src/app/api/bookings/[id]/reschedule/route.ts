import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import {
  ACTIVE_BOOKING_STATUSES,
  BookingLifecycleEvent,
  nextIcsSequence,
  recordLifecycleEvent,
} from '@/lib/booking-lifecycle'
import {
  notifyStaffOfBooking,
  sendBookingRescheduledEmail,
} from '@/lib/booking-comms'

const schema = z.object({
  bookingDatetime: z.string().min(1),
})

type Ctx = { params: { id: string } }

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = ctx.params
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const when = new Date(parsed.data.bookingDatetime)
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: 'Invalid booking time.' }, { status: 400 })
    }
    if (when.getTime() < Date.now() + 15 * 60_000) {
      return NextResponse.json(
        { error: 'Please choose a time at least 15 minutes from now.' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!ACTIVE_BOOKING_STATUSES.includes(booking.status as 'pending' | 'confirmed')) {
      return NextResponse.json(
        { error: 'This booking can no longer be rescheduled.' },
        { status: 409 }
      )
    }

    // Idempotent: same slot (±90s)
    if (Math.abs(booking.bookingDatetime.getTime() - when.getTime()) < 90_000) {
      return NextResponse.json({
        ok: true,
        bookingId: booking.id,
        status: booking.status,
        bookingDatetime: booking.bookingDatetime.toISOString(),
        duplicate: true,
      })
    }

    const previousDatetime = booking.bookingDatetime
    const sequence = (await nextIcsSequence(booking.id)) + 1

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        bookingDatetime: when,
        status: booking.status === 'pending' ? 'confirmed' : booking.status,
      },
    })

    await recordLifecycleEvent({
      userId: booking.userId,
      eventName: BookingLifecycleEvent.RESCHEDULED,
      bookingId: booking.id,
      payload: {
        previousDatetime: previousDatetime.toISOString(),
        bookingDatetime: when.toISOString(),
        icsSequence: sequence,
      },
    })

    const origin =
      req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://aumveda.com'
    const clientEmail = booking.user.email
    let emailSent = false

    if (clientEmail) {
      try {
        const mail = await sendBookingRescheduledEmail({
          to: clientEmail,
          clientName: booking.user.name?.split(' ')[0] || 'friend',
          bookingId: booking.id,
          practitioner: booking.practitioner,
          serviceType: booking.serviceType,
          previousDatetime,
          bookingDatetime: when,
          durationMinutes: booking.durationMinutes,
          sequence,
          siteUrl: origin,
        })
        emailSent = !mail.simulated
      } catch (err) {
        console.error('RESCHEDULE EMAIL FAILED:', err)
      }
    }

    try {
      const staff = await notifyStaffOfBooking({
        kind: 'rescheduled',
        bookingId: booking.id,
        practitioner: booking.practitioner,
        serviceType: booking.serviceType,
        clientName: booking.user.name || 'Client',
        clientEmail: clientEmail || 'unknown',
        bookingDatetime: when,
        previousDatetime,
      })
      if (staff.practitioner) {
        await recordLifecycleEvent({
          userId: booking.userId,
          eventName: BookingLifecycleEvent.PRACTITIONER_NOTIFIED,
          bookingId: booking.id,
          payload: { kind: 'rescheduled' },
        })
      }
      if (staff.admin) {
        await recordLifecycleEvent({
          userId: booking.userId,
          eventName: BookingLifecycleEvent.ADMIN_NOTIFIED,
          bookingId: booking.id,
          payload: { kind: 'rescheduled' },
        })
      }
    } catch (err) {
      console.error('RESCHEDULE STAFF NOTIFY FAILED:', err)
    }

    return NextResponse.json({
      ok: true,
      bookingId: updated.id,
      status: updated.status,
      bookingDatetime: updated.bookingDatetime.toISOString(),
      emailSent,
      duplicate: false,
    })
  } catch (error: unknown) {
    console.error('BOOKING RESCHEDULE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
