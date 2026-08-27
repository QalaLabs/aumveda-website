'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Settings, ShieldCheck, Lock, Sparkles, ShoppingBag } from 'lucide-react'
import ConsentManager from '@/components/ConsentManager'
import ProfileHeader from '@/components/ProfileHeader'
import BadgeShelf from '@/components/BadgeShelf'
import Topbar from '../../_components/Topbar'
import { useEffect, useState } from 'react'
import type { ProductView } from '@/lib/product-types'

export default function ProfilePage() {
  const [recommendedProducts, setRecommendedProducts] = useState<ProductView[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(async res => {
        if (!res.ok) return
        const data = await res.json()
        setRecommendedProducts((data.products ?? []).slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Topbar title="Profile" />
      <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <ProfileHeader />

        {recommendedProducts.length > 0 && (
          <Card className="border-none shadow-lg rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Your Energetic Tools & Crystal Recommendations
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-amber-700 hover:text-amber-800">
                  <Link href="/shop">
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Visit Apothecary &rarr;
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recommendedProducts.map(p => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    className="flex flex-col rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-amber-200 transition-all group"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-amber-50 flex items-center justify-center text-amber-300">ॐ</div>
                      )}
                    </div>
                    <p className="font-serif text-sm font-bold text-slate-900 truncate group-hover:text-amber-700">{p.title}</p>
                    <p className="text-xs font-black text-amber-700 mt-1">₹{p.priceInr.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-lg rounded-[32px] bg-white">
          <CardContent className="p-8">
            <BadgeShelf />
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy & Data Control
              </CardTitle>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">GDPR Compliant</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <ConsentManager />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-primary text-white rounded-[32px]">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold">Forensic Security Active</h3>
              <p className="text-sm text-white/70 max-w-md">
                Your account is protected with unique forensic watermarking. All video streams and health data are encrypted and hashed to your identity.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
