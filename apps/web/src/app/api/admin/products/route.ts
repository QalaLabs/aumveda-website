import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { listProducts, createProduct } from '@/lib/product-service'
import { productListQuerySchema, createProductSchema } from '@/lib/product-schemas'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = productListQuerySchema.parse({
      search: searchParams.get('search') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      productType: searchParams.get('productType') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? undefined,
      sortOrder: searchParams.get('sortOrder') ?? undefined,
    })

    const result = await listProducts(query)
    return NextResponse.json({ success: true, ...result })
  } catch (err: unknown) {
    console.error('[api/admin/products] GET error:', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    try {
      const product = await createProduct(parsed.data)
      return NextResponse.json({ success: true, product }, { status: 201 })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A product with this SKU or slug already exists' },
          { status: 409 }
        )
      }
      console.error('[api/admin/products] POST create error:', err)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
  } catch (err: unknown) {
    console.error('[api/admin/products] POST error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
