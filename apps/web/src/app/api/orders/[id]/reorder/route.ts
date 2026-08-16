import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orderId = parseInt(params.id, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ success: false, error: 'Invalid order id' }, { status: 400 })
  }

  const source = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: { select: { productId: true, quantity: true, sku: true, title: true, priceCents: true } } },
  })

  if (!source) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  if (source.items.length === 0) {
    return NextResponse.json({ success: false, error: 'No items to reorder' }, { status: 400 })
  }

  await prisma.order.create({
    data: {
      userId: session.user.id,
      status: 'PENDING',
      totalCents: source.totalCents,
      currency: source.currency,
      items: {
        create: source.items.map((i) => ({
          productId: i.productId,
          sku: i.sku,
          title: i.title,
          quantity: i.quantity,
          priceCents: i.priceCents,
        })),
      },
    },
  })

  return NextResponse.json({ success: true })
}
