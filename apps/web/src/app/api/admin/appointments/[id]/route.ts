import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const

const putBodySchema = z.object({
  status: z.enum(VALID_STATUSES).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        therapySession: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        practitioner: booking.practitioner,
        serviceType: booking.serviceType,
        bookingDatetime: booking.bookingDatetime,
        durationMinutes: booking.durationMinutes,
        status: booking.status,
        amountPaid: Number(booking.amountPaid),
        zoomLink: booking.zoomLink,
        razorpayPaymentId: booking.razorpayPaymentId,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        user: booking.user,
        therapySession: booking.therapySession,
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/appointments/[id]] GET error:', err)
    return NextResponse.json({ error: 'Failed to load booking' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = putBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const existing = await prisma.booking.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (parsed.data.status) {
      updateData.status = parsed.data.status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: updated.id,
        practitioner: updated.practitioner,
        serviceType: updated.serviceType,
        bookingDatetime: updated.bookingDatetime,
        durationMinutes: updated.durationMinutes,
        status: updated.status,
        amountPaid: Number(updated.amountPaid),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        user: updated.user,
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/appointments/[id]] PUT error:', err)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
