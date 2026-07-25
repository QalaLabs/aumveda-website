import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import {
  ACTIVE_BOOKING_STATUSES,
  BookingLifecycleEvent,
  hasLifecycleEvent,
  nextIcsSequence,
  recordLifecycleEvent,
} from '@/lib/booking-lifecycle'
import {
  notifyStaffOfBooking,
  sendBookingCancelledEmail,
} from '@/lib/booking-comms'

type Ctx = { params: { id: string } }

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = ctx.params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Idempotent: already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json({
        ok: true,
        bookingId: booking.id,
        status: 'cancelled',
        duplicate: true,
      })
    }

    if (!ACTIVE_BOOKING_STATUSES.includes(booking.status as 'pending' | 'confirmed')) {
      return NextResponse.json(
        { error: 'This booking can no longer be cancelled.' },
        { status: 409 }
      )
    }

    if (await hasLifecycleEvent(booking.id, BookingLifecycleEvent.CANCELLED)) {
      // Event exists but status drifted — heal status
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'cancelled' },
      })
      return NextResponse.json({
        ok: true,
        bookingId: booking.id,
        status: 'cancelled',
        duplicate: true,
      })
    }

    const sequence = (await nextIcsSequence(booking.id)) + 1

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'cancelled' },
      })
    })

    await recordLifecycleEvent({
      userId: booking.userId,
      eventName: BookingLifecycleEvent.CANCELLED,
      bookingId: booking.id,
      payload: {
        previousStatus: booking.status,
        bookingDatetime: booking.bookingDatetime.toISOString(),
        icsSequence: sequence,
      },
    })

    const origin =
      req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://aumveda.com'
    const clientEmail = booking.user.email
    let emailSent = false

    if (clientEmail) {
      try {
        const mail = await sendBookingCancelledEmail({
          to: clientEmail,
          clientName: booking.user.name?.split(' ')[0] || 'friend',
          bookingId: booking.id,
          practitioner: booking.practitioner,
          serviceType: booking.serviceType,
          bookingDatetime: booking.bookingDatetime,
          durationMinutes: booking.durationMinutes,
          sequence,
          siteUrl: origin,
        })
        emailSent = !mail.simulated
      } catch (err) {
        console.error('CANCEL EMAIL FAILED:', err)
      }
    }

    try {
      const staff = await notifyStaffOfBooking({
        kind: 'cancelled',
        bookingId: booking.id,
        practitioner: booking.practitioner,
        serviceType: booking.serviceType,
        clientName: booking.user.name || 'Client',
        clientEmail: clientEmail || 'unknown',
        bookingDatetime: booking.bookingDatetime,
      })
      if (staff.practitioner) {
        await recordLifecycleEvent({
          userId: booking.userId,
          eventName: BookingLifecycleEvent.PRACTITIONER_NOTIFIED,
          bookingId: booking.id,
          payload: { kind: 'cancelled' },
        })
      }
      if (staff.admin) {
        await recordLifecycleEvent({
          userId: booking.userId,
          eventName: BookingLifecycleEvent.ADMIN_NOTIFIED,
          bookingId: booking.id,
          payload: { kind: 'cancelled' },
        })
      }
    } catch (err) {
      console.error('CANCEL STAFF NOTIFY FAILED:', err)
    }

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      status: 'cancelled',
      emailSent,
      duplicate: false,
    })
  } catch (error: unknown) {
    console.error('BOOKING CANCEL ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
