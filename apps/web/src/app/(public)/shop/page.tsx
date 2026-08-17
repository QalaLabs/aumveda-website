'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ShoppingBag, Search, ArrowRight, Sparkles, ShieldCheck, Package, Loader2 } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useCart } from '@/lib/cart'
import type { ProductView } from '@/lib/product-service'
import { PRODUCT_CATEGORIES } from '@/lib/product-schemas'

export default function ShopPage() {
  const [products, setProducts] = useState<ProductView[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addItem, isInCart, totalItems } = useCart()

  useEffect(() => {
    fetch('/api/products')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setProducts(data.products ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  )

  const categories = ['All', ...PRODUCT_CATEGORIES.filter(c => products.some(p => p.category === c))]

  const handleAddToCart = (product: ProductView) => {
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
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-[0.3em]">
              <ShoppingBag className="w-3 h-3" /> Sacred Commerce
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
              The Aumveda <br />
              <span className="text-amber-600 italic">Apothecary</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Crystal bracelets, Vastu items, healing combos and sacred frames —
              every product chosen to amplify your energy and attract abundance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 h-12 rounded-xl border-slate-200" />
            </div>
            {totalItems > 0 && (
              <Button className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-black font-bold shrink-0" asChild>
                <Link href="/checkout">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Cart ({totalItems})
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                category === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 opacity-50">
                  ({products.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
          <span className="px-5 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest">
            {filtered.length} items
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-slate-100">
                <Link href={`/shop/${p.slug}`} className="aspect-square relative overflow-hidden bg-slate-50 block">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-stone-300" />
                    </div>
                  )}
                  {p.tags?.[0] && (
                    <Badge className={`absolute top-3 left-3 border-none text-[10px] font-black uppercase tracking-widest ${
                      p.tags[0] === 'Bestseller' ? 'bg-amber-500 text-white' :
                      p.tags[0] === 'Sale' ? 'bg-rose-500 text-white' :
                      p.tags[0] === 'Bundle' ? 'bg-indigo-600 text-white' :
                      p.tags[0] === 'Certified' ? 'bg-emerald-600 text-white' :
                      'bg-slate-900 text-white'
                    }`}>
                      {p.tags[0]}
                    </Badge>
                  )}
                  {p.discountPercent && p.discountPercent >= 50 && (
                    <Badge className="absolute top-3 right-3 bg-rose-500 text-white border-none text-[10px] font-black">
                      {p.discountPercent}% OFF
                    </Badge>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{p.category}</p>
                    <Link href={`/shop/${p.slug}`}>
                      <h3 className="font-bold text-slate-900 leading-tight text-sm hover:text-amber-700 transition-colors">{p.title}</h3>
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3">{p.shortDescription || p.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div>
                      <span className="text-lg font-black text-slate-900">₹{p.priceInr.toLocaleString('en-IN')}</span>
                      {p.compareAtPriceInr && (
                        <span className="text-xs text-slate-400 line-through ml-2">₹{p.compareAtPriceInr.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(p)}
                      disabled={p.inventoryCount === 0}
                      className={`rounded-xl h-9 font-bold text-xs ${isInCart(p.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}`}
                    >
                      {p.inventoryCount === 0 ? 'Sold Out' : isInCart(p.id) ? '✓ Added' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && products.length > 0 && (
          <div className="text-center py-20 text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No products found for &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Products coming soon.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "100% Natural & Authentic", desc: "Every crystal is ethically sourced, lab-certified where mentioned, and energetically cleansed before dispatch." },
            { icon: Sparkles, title: "Practitioner Curated", desc: "Each product personally selected by Archana Jain for its vibrational alignment and healing potency." },
            { icon: ShoppingBag, title: "Secure Checkout", desc: "Encrypted payment processing. 7-day return & exchange on all physical items." },
          ].map(item => (
            <div key={item.title} className="flex gap-4 items-start p-6 bg-slate-50 rounded-3xl">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 bg-slate-900 rounded-[48px] text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Client Benefit</p>
          <h2 className="text-3xl font-serif font-bold text-white">Members get 20% off every order</h2>
          <p className="text-slate-400 max-w-md mx-auto">Create your free Aumveda account to unlock member pricing, track orders and earn healing credits.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="h-12 px-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold">
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 px-8 rounded-xl text-slate-400 hover:text-white border border-white/10 font-bold">
              <Link href="/auth/login">Sign In <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
