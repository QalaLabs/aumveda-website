import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { getPaymentProvider } from '@/lib/payment/eazebus-adapter'

export const dynamic = 'force-dynamic'

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })).min(1, 'Cart is empty'),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default('India'),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getApiSession()

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { items, customerEmail, customerName, customerPhone, shippingAddress } = parsed.data

    const productIds = items.map(i => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'One or more products are unavailable or do not exist' },
        { status: 400 }
      )
    }

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) continue
      if (product.inventoryCount < item.quantity) {
        return NextResponse.json(
          { error: `"${product.title}" only has ${product.inventoryCount} in stock` },
          { status: 400 }
        )
      }
    }

    let totalCents = 0
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId)!
      const lineTotal = product.priceCents * item.quantity
      totalCents += lineTotal
      return {
        productId: product.id,
        sku: product.sku,
        title: product.title,
        quantity: item.quantity,
        priceCents: product.priceCents,
      }
    })

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId: session?.user?.id ?? null,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          totalCents,
          currency: 'INR',
          customerEmail,
          customerName: customerName ?? null,
          shippingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : undefined,
          items: { create: orderItems },
        },
        include: { items: true },
      })

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventoryCount: { decrement: item.quantity } },
        })
      }

      return o
    })

    const paymentProvider = getPaymentProvider()
    if (paymentProvider.isConfigured()) {
      try {
        const checkoutSession = await paymentProvider.createCheckout({
          amountPaise: totalCents,
          currency: 'INR',
          orderId: String(order.id),
          customerEmail,
          customerName,
          customerPhone,
          metadata: { order_id: String(order.id) },
          returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/checkout/confirmation?orderId=${order.id}`,
        })

        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentUrl: checkoutSession.paymentUrl,
          totalInr: totalCents / 100,
        })
      } catch (paymentErr: unknown) {
        console.error('[checkout] Payment provider error:', paymentErr)
        // Order remains PENDING — customer can retry payment later
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: null,
      totalInr: totalCents / 100,
      note: 'Payment gateway not configured. Order saved as PENDING.',
    })
  } catch (err: unknown) {
    console.error('[checkout] Unexpected error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
