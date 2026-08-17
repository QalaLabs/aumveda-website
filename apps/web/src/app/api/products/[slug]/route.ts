import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/product-service'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, product })
  } catch (err: unknown) {
    console.error('[api/products/slug] Error:', err)
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}
