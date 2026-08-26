'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/product'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { ProductView } from '@/lib/product-types'

export default function AdminProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = params.id
    if (!id) return

    fetch(`/api/admin/products/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data.product)
      })
      .catch((err: any) => setError(err.message ?? 'Failed to load product'))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-600 font-medium">{error ?? 'Product not found'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/products')}>
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          <p className="text-sm text-slate-500 mt-1">Editing &ldquo;{product.title}&rdquo;</p>
        </div>
        <ProductForm mode="edit" product={product} />
      </div>
    </div>
  )
}
