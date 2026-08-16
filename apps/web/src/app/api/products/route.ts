import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { r2PublicUrl } from '@/lib/r2'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      priceCents: true,
      images: true,
      inventoryCount: true,
      productType: true,
    },
  })

  return NextResponse.json({
    success: true,
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      priceInr: p.priceCents / 100,
      imageUrl: p.images[0] ? r2PublicUrl(p.images[0]) : null,
      inventoryCount: p.inventoryCount,
      productType: p.productType,
    })),
  })
}
