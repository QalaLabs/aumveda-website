import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { getActiveProducts, listProducts } from '@/lib/product-service'
import { productListQuerySchema } from '@/lib/product-schemas'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession()
    const { searchParams } = new URL(request.url)

    if (session?.user?.id) {
      const query = productListQuerySchema.parse({
        search: searchParams.get('search') ?? undefined,
        category: searchParams.get('category') ?? undefined,
        page: searchParams.get('page') ?? '1',
        limit: searchParams.get('limit') ?? '50',
      })
      const result = await listProducts(query)
      return NextResponse.json({ success: true, products: result.products, total: result.total })
    }

    const products = await getActiveProducts()
    return NextResponse.json({ success: true, products })
  } catch (err: unknown) {
    console.error('[api/products] Error:', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
