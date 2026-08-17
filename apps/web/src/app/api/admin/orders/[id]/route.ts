import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const VALID_FULFILLMENT: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

const VALID_PAYMENT: Record<string, string[]> = {
  PENDING: ['PAID', 'FAILED'],
  PAID: ['REFUNDED'],
  FAILED: [],
  REFUNDED: [],
}

function isValidTransition(current: string, next: string): boolean {
  return VALID_FULFILLMENT[current]?.includes(next) ?? false
}

function isValidPaymentTransition(current: string, next: string): boolean {
  return VALID_PAYMENT[current]?.includes(next) ?? false
}

const putBodySchema = z.object({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  trackingNumber: z.string().optional(),
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
    const orderId = parseInt(id, 10)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: { select: { images: true, title: true, sku: true } } },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        userId: order.userId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalInr: order.totalCents / 100,
        currency: order.currency,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        eazebusOrderId: order.eazebusOrderId,
        eazebusPaymentId: order.eazebusPaymentId,
        paymentMeta: order.paymentMeta,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items,
        user: order.user,
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/orders/[id]] GET error:', err)
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 })
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
    const orderId = parseInt(id, 10)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

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

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (parsed.data.status && parsed.data.status !== order.status) {
      if (!isValidTransition(order.status, parsed.data.status)) {
        return NextResponse.json(
          { error: `Invalid status transition: ${order.status} → ${parsed.data.status}` },
          { status: 422 }
        )
      }
      updateData.status = parsed.data.status
    }

    if (parsed.data.paymentStatus && parsed.data.paymentStatus !== order.paymentStatus) {
      if (!isValidPaymentTransition(order.paymentStatus, parsed.data.paymentStatus)) {
        return NextResponse.json(
          {
            error: `Invalid payment status transition: ${order.paymentStatus} → ${parsed.data.paymentStatus}`,
          },
          { status: 422 }
        )
      }
      updateData.paymentStatus = parsed.data.paymentStatus
    }

    if (parsed.data.trackingNumber !== undefined) {
      updateData.trackingNumber = parsed.data.trackingNumber
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: { include: { product: { select: { images: true, title: true } } } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: updated.id,
        userId: updated.userId,
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        totalInr: updated.totalCents / 100,
        currency: updated.currency,
        customerEmail: updated.customerEmail,
        customerName: updated.customerName,
        eazebusOrderId: updated.eazebusOrderId,
        eazebusPaymentId: updated.eazebusPaymentId,
        trackingNumber: updated.trackingNumber,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        items: updated.items,
        user: updated.user,
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/orders/[id]] PUT error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
