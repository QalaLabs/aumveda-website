'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, ArrowRight, Loader2, Clock, AlertCircle } from 'lucide-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-lg mx-auto px-6 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Order Received</h1>
          <p className="text-slate-500 leading-relaxed">
            Your order has been placed and is awaiting payment confirmation. Online payment is currently being set up — our team will reach out to complete your purchase.
          </p>
        </div>

        <Card className="text-left border-amber-100 bg-amber-50/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-900">Payment pending</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Online payment is not yet available. Your order has been saved and our team will contact you to complete the payment. No amount has been charged.
                </p>
              </div>
            </div>
            {orderId && (
              <div className="flex items-center gap-3 pt-2 border-t border-amber-100">
                <Package className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Order ID</p>
                  <p className="font-mono text-sm font-bold text-slate-900">#{orderId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="bg-slate-900 hover:bg-black">
            <Link href="/dashboard/orders">
              View Orders <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
