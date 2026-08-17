'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, ShoppingCart, Loader2, PackageSearch, AlertTriangle } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useCart } from '@/lib/cart'
import Topbar from '../../_components/Topbar'
import type { ProductView } from '@/lib/product-service'

export default function ShopPage() {
  const [products, setProducts] = useState<ProductView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { addItem, isInCart, totalItems } = useCart()

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Failed to load products')
      }
      const data = await res.json()
      setProducts(data.products ?? [])
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product: ProductView) => {
    if (product.inventoryCount === 0) {
      showError(`${product.title} is out of stock`)
      return
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents,
      imageUrl: product.imageUrl,
      inventoryCount: product.inventoryCount,
      productType: product.productType,
    })
    showSuccess(`${product.title} added to cart!`)
  }

  return (
    <>
      <Topbar title="Aumveda Shop" />
      <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 font-medium">Curated Ayurvedic essentials for your Prakriti.</p>
          {totalItems > 0 && (
            <Button asChild className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold">
              <Link href="/checkout">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {totalItems} item{totalItems > 1 ? 's' : ''}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 max-w-md mx-auto text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load products</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load} className="rounded-xl">Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <PackageSearch className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Products will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <Card key={product.id} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                <Link href={`/shop/${product.slug}`} className="aspect-square relative overflow-hidden bg-slate-100 block">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                      <PackageSearch className="w-12 h-12 text-stone-300" />
                    </div>
                  )}
                  {product.inventoryCount === 0 && (
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white border-none text-[10px] font-bold uppercase tracking-widest">
                      Out of Stock
                    </Badge>
                  )}
                </Link>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {product.category || product.productType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-bold text-slate-900 mb-1 hover:text-amber-700 transition-colors">{product.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">₹{product.priceInr.toLocaleString('en-IN')}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.inventoryCount === 0}
                      className={`rounded-lg h-9 px-4 ${isInCart(product.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}`}
                    >
                      {product.inventoryCount === 0 ? 'Sold Out' : isInCart(product.id) ? '✓ Added' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && products.length > 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No products found. Try a different search.</p>
          </div>
        )}
      </div>
    </>
  )
}
