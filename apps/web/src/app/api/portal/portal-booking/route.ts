import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  practitioner: z.enum(['archana', 'sejal']),
  serviceType: z.string(),
  bookingDatetime: z.string(),
  durationMinutes: z.number().int(),
  amountPaid: z.number().nonnegative(),
  packageType: z.enum(['free', 'single', '3_session', '12_session']),
  razorpayPaymentId: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User lead not found. Please complete step 6.' }, { status: 404 })
    }

    const userId = user.id

    // Use Prisma transaction to ensure database consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the booking
      const booking = await tx.booking.create({
        data: {
          userId,
          practitioner,
          serviceType,
          bookingDatetime: new Date(bookingDatetime),
          durationMinutes,
          amountPaid,
          status: amountPaid > 0 ? 'confirmed' : 'pending',
          razorpayPaymentId: razorpayPaymentId || null,
        },
      })

      // 2. If a package was purchased, create it
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
            sessionsUsed: 1, // first session is booked now
            amountPaid,
            expiresAt,
          },
        })
      }

      // 3. Mark portal completion (upsert — register-lead may create a user
      // without UserPortalData if Step 6 sync failed or was skipped)
      await tx.userPortalData.upsert({
        where: { userId },
        update: { portalCompletedAt: new Date() },
        create: { userId, portalCompletedAt: new Date() },
      })

      // 4. Record a completion event
      await tx.event.create({
        data: {
          userId,
          eventName: 'portal.completed',
          payload: {
            packageType,
            practitioner,
            amountPaid,
          },
          source: 'server',
        },
      })

      return booking
    })

    return NextResponse.json({ ok: true, bookingId: result.id })
  } catch (error: any) {
    console.error('PORTAL BOOKING ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
