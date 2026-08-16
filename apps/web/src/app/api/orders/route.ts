import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { mapOrder } from '@/lib/order-mapper'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { images: true, productType: true } } } },
    },
  })

  return NextResponse.json({ success: true, orders: orders.map(mapOrder) })
}
