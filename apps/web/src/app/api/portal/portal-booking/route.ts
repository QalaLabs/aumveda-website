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
    const status = packageType === 'free' || amountPaid === 0 ? 'confirmed' : 'pending'

    // Idempotent window: same user + same start (±90s) + active booking
    const windowStart = new Date(when.getTime() - 90_000)
    const windowEnd = new Date(when.getTime() + 90_000)
    const existing = await prisma.booking.findFirst({
      where: {
        userId,
        serviceType,
        bookingDatetime: { gte: windowStart, lte: windowEnd },
        status: { in: ['pending', 'confirmed'] },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      return NextResponse.json({
        ok: true,
        bookingId: existing.id,
        status: existing.status,
        bookingDatetime: existing.bookingDatetime.toISOString(),
        emailSent: false,
        duplicate: true,
      })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Re-check inside transaction against races
      const raced = await tx.booking.findFirst({
        where: {
          userId,
          serviceType,
          bookingDatetime: { gte: windowStart, lte: windowEnd },
          status: { in: ['pending', 'confirmed'] },
        },
      })
      if (raced) return { booking: raced, created: false as const }

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

      return { booking, created: true as const }
    })

    let emailSent = false
    if (result.created) {
      try {
        const origin =
          req.headers.get('origin') ||
          process.env.NEXTAUTH_URL ||
          'https://aumveda.com'
        const mail = await sendBookingConfirmationEmail({
          to: user.email,
          clientName: user.name?.split(' ')[0] || 'friend',
          bookingId: result.booking.id,
          practitioner,
          serviceType,
          bookingDatetime: when,
          durationMinutes,
          siteUrl: origin,
        })
        // Simulated (no SMTP) still "ok" for booking; flag pending so UI offers ICS download
        emailSent = !mail.simulated
      } catch (emailErr) {
        console.error('BOOKING CONFIRM EMAIL FAILED:', emailErr)
        emailSent = false
      }
    }

    return NextResponse.json({
      ok: true,
      bookingId: result.booking.id,
      status: result.booking.status,
      bookingDatetime: result.booking.bookingDatetime.toISOString(),
      emailSent,
      duplicate: !result.created,
    })
  } catch (error: unknown) {
    console.error('PORTAL BOOKING ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
