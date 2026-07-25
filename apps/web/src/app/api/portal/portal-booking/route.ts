import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'
import { sendBookingConfirmationEmail } from '@/lib/booking-confirm'

const schema = z.object({
  email: z.string().email(),
  practitioner: z.enum(['archana', 'sejal']),
  serviceType: z.string(),
  bookingDatetime: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  amountPaid: z.number().nonnegative(),
  packageType: z.enum(['free', 'single', '3_session', '12_session']),
  razorpayPaymentId: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const {
      email,
      practitioner,
      serviceType,
      bookingDatetime,
      durationMinutes,
      amountPaid,
      packageType,
      razorpayPaymentId,
    } = parsed.data

    const normalizedEmail = email.toLowerCase().trim()
    const when = new Date(bookingDatetime)
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: 'Invalid booking time.' }, { status: 400 })
    }
    if (when.getTime() < Date.now() + 15 * 60_000) {
      return NextResponse.json(
        { error: 'Please choose a time at least 15 minutes from now.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true },
    })

    if (!user?.email) {
      return NextResponse.json(
        { error: 'User lead not found. Please complete step 6.' },
        { status: 404 }
      )
    }

    const userId = user.id
    // Free Discovery Call is confirmed without payment
    const status = packageType === 'free' || amountPaid === 0 ? 'confirmed' : 'pending'

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          practitioner,
          serviceType,
          bookingDatetime: when,
          durationMinutes,
          amountPaid,
          status,
          razorpayPaymentId: razorpayPaymentId || null,
        },
      })

      if (packageType !== 'free') {
        let sessionsTotal = 1
        let expiryMonths = 3

        if (packageType === '3_session') {
          sessionsTotal = 3
          expiryMonths = 6
        } else if (packageType === '12_session') {
          sessionsTotal = 12
          expiryMonths = 12
        }

        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

        await tx.package.create({
          data: {
            userId,
            packageType,
            sessionsTotal,
            sessionsUsed: 1,
            amountPaid,
            expiresAt,
          },
        })
      }

      await tx.userPortalData.upsert({
        where: { userId },
        update: { portalCompletedAt: new Date() },
        create: { userId, portalCompletedAt: new Date() },
      })

      await tx.event.create({
        data: {
          userId,
          eventName: 'portal.completed',
          payload: {
            packageType,
            practitioner,
            amountPaid,
            bookingId: booking.id,
          },
          source: 'server',
        },
      })

      await tx.event.create({
        data: {
          userId,
          eventName: 'booking.confirmed',
          payload: {
            bookingId: booking.id,
            practitioner,
            serviceType,
            bookingDatetime: when.toISOString(),
          },
          source: 'server',
        },
      })

      return booking
    })

    // Email must not fail the booking — log and continue
    try {
      const origin =
        req.headers.get('origin') ||
        process.env.NEXTAUTH_URL ||
        'https://aumveda.com'
      await sendBookingConfirmationEmail({
        to: user.email,
        clientName: user.name?.split(' ')[0] || 'friend',
        bookingId: result.id,
        practitioner,
        serviceType,
        bookingDatetime: when,
        durationMinutes,
        siteUrl: origin,
      })
    } catch (emailErr) {
      console.error('BOOKING CONFIRM EMAIL FAILED:', emailErr)
    }

    return NextResponse.json({
      ok: true,
      bookingId: result.id,
      status: result.status,
      bookingDatetime: result.bookingDatetime.toISOString(),
    })
  } catch (error: unknown) {
    console.error('PORTAL BOOKING ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
