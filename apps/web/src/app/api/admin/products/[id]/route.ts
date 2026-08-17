import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { getProductById, updateProduct, deleteProduct } from '@/lib/product-service'
import { updateProductSchema } from '@/lib/product-schemas'

export const dynamic = 'force-dynamic'

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
    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (err: unknown) {
    console.error('[api/admin/products/id] GET error:', err)
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
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
    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = updateProductSchema.safeParse({ ...(body as Record<string, unknown>), id: productId })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    try {
      const product = await updateProduct(parsed.data)
      return NextResponse.json({ success: true, product })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message.includes('Record to update not found')) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      if (message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A product with this SKU or slug already exists' },
          { status: 409 }
        )
      }
      console.error('[api/admin/products/id] PUT update error:', err)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
  } catch (err: unknown) {
    console.error('[api/admin/products/id] PUT error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    try {
      await deleteProduct(productId)
      return NextResponse.json({ success: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message.includes('Record to delete does not exist')) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      console.error('[api/admin/products/id] DELETE error:', err)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
  } catch (err: unknown) {
    console.error('[api/admin/products/id] DELETE outer error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
