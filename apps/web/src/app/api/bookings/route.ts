import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const { userId, practitioner, serviceType, bookingDatetime, durationMinutes, amountPaid, razorpayPaymentId, zoomLink } = body

    const booking = await prisma.booking.create({
      data: {
        userId,
        practitioner,
        serviceType,
        bookingDatetime: new Date(bookingDatetime),
        durationMinutes: durationMinutes || 60,
        amountPaid,
        razorpayPaymentId: razorpayPaymentId || null,
        zoomLink: zoomLink || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ ok: true, data: booking })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const { bookingId, status, razorpayPaymentId, zoomLink } = body

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
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
