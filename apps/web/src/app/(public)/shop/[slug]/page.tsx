'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, ArrowLeft, Package, Loader2, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useCart } from '@/lib/cart'
import type { ProductView } from '@/lib/product-types'
import { getBundleInfo } from '@/lib/product-types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductView | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [userChakra, setUserChakra] = useState<string | null>(null)
  const { addItem, isInCart, totalItems } = useCart()

  useEffect(() => {
    const slug = params.slug
    if (!slug) return
    fetch(`/api/products/${slug}`)
      .then(async res => {
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setProduct(data.product)
      })
      .catch(() => router.push('/shop'))
      .finally(() => setLoading(false))
  }, [params.slug, router])

  useEffect(() => {
    fetch('/api/user/chakra')
      .then(res => (res.ok ? res.json() : null))
      .then(data => setUserChakra(data?.chakra ?? null))
      .catch(() => {})
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const bundle = getBundleInfo(product.metadata)
  const matchesChakra =
    !!userChakra && !!product.chakraAssociation && userChakra === product.chakraAssociation

  const handleAddToCart = () => {
    if (product.inventoryCount === 0) {
      showError('This product is out of stock')
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
      bundle,
    })
    showSuccess(`${product.title} added to cart!`)
  }

  const allImages = product.images.length > 0 ? product.images : []

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-500">
            <Link href="/shop"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop</Link>
          </Button>
          {totalItems > 0 && (
            <Button variant="ghost" size="sm" asChild className="ml-auto text-slate-500">
              <Link href="/checkout"><ShoppingBag className="w-4 h-4 mr-2" /> Cart ({totalItems})</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-stone-200" />
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === i ? 'border-slate-900' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{product.category}</Badge>
                {product.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{tag}</Badge>
                ))}
              </div>
              {matchesChakra && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold uppercase tracking-widest gap-1.5 w-fit">
                  <Sparkles className="w-3 h-3" /> Perfect for your <span className="capitalize">{product.chakraAssociation?.replace(/_/g, ' ')}</span> profile
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{product.title}</h1>
              {product.shortDescription && (
                <p className="text-lg text-slate-500">{product.shortDescription}</p>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-slate-900">₹{product.priceInr.toLocaleString('en-IN')}</span>
              {product.compareAtPriceInr && (
                <>
                  <span className="text-lg text-slate-400 line-through">₹{product.compareAtPriceInr.toLocaleString('en-IN')}</span>
                  <Badge className="bg-rose-500 text-white border-none text-xs font-black">{product.discountPercent}% OFF</Badge>
                </>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            {bundle && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
                <Badge className="bg-slate-900 text-amber-400 border-none text-[10px] font-black uppercase tracking-widest w-fit">
                  Crystal + Session Bundle
                </Badge>
                <p className="text-sm text-slate-700">
                  Pair this piece with a <span className="font-semibold">{bundle.sessionLabel}</span> ({bundle.serviceType}).
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-black text-slate-900">
                    ₹{(bundle.bundlePriceCents / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Bundle price</span>
                </div>
                <p className="text-[11px] text-slate-500">Book the session separately to redeem this price; it isn&apos;t applied automatically at checkout.</p>
              </div>
            )}

            <div className="space-y-3">
              {product.inventoryCount > 0 ? (
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-base font-bold"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  {isInCart(product.id) ? 'Add Another' : 'Add to Cart'}
                </Button>
              ) : (
                <Button disabled className="w-full h-14 rounded-2xl text-base font-bold" size="lg">
                  Out of Stock
                </Button>
              )}
              <p className="text-xs text-slate-400 text-center">
                {product.inventoryCount > 0
                  ? `${product.inventoryCount} in stock · Ships within 2-3 business days`
                  : 'Currently unavailable'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">7-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
