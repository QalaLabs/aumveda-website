'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import OrderList from '@/components/OrderList'
import OrderDetailModal from '@/components/OrderDetailModal'
import QuickShopCard from '@/components/QuickShopCard'
import { showSuccess, showError } from '@/utils/toast'
import { Loader2, ShoppingBag, History, ArrowLeft } from 'lucide-react'
import Topbar from '../../_components/Topbar'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders) })
      .catch(() => showError('Failed to load order history'))
      .finally(() => setLoading(false))

    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.products?.length > 0) {
          const p = d.products[0]
          setRecommended({
            id: p.id,
            slug: p.slug,
            title: p.title,
            description: p.description,
            priceInr: p.priceInr,
            imageUrl: p.imageUrl,
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleViewDetails = async (order: any) => {
    try {
      const res = await fetch(`/api/orders/${order.id}`)
      const data = await res.json()
      if (data.success) { setSelectedOrder(data.order); setIsDetailModalOpen(true) }
    } catch { showError('Failed to load order details') }
  }

  const handleReorder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/reorder`, { method: 'POST' })
      if (res.ok) { showSuccess('Items added to your cart!'); router.push('/dashboard/shop') }
    } catch { showError('Failed to reorder') }
  }

  const handleDownloadInvoice = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/invoice`)
      const data = await res.json()
      if (data.success) { window.open(data.url, '_blank'); showSuccess('Invoice download started') }
    } catch { showError('Failed to generate invoice') }
  }

  return (
    <>
      <Topbar title="Orders & Purchases" />
      <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">

        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
          </Button>
          <p className="text-slate-500 font-medium ml-auto">Manage your wellness essentials and history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-[32px] border border-slate-100">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-400 animate-pulse">Retrieving your history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No orders yet</h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">Start your Ayurvedic journey with our curated shop.</p>
                <Button asChild className="bg-slate-900 hover:bg-black rounded-xl px-8">
                  <Link href="/dashboard/shop">Visit Shop</Link>
                </Button>
              </div>
            ) : (
              <OrderList orders={orders} onViewDetails={handleViewDetails} onReorder={handleReorder} onDownloadInvoice={handleDownloadInvoice} />
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            {recommended ? (
              <QuickShopCard product={recommended} onAddToCart={() => showSuccess(`${recommended.title} added to cart!`)} />
            ) : (
              <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900">Shop</h4>
                <p className="text-xs text-slate-500 mt-1">Featured products will appear here once the shop is live.</p>
                <Button asChild variant="outline" className="mt-4 rounded-xl text-xs font-semibold">
                  <Link href="/dashboard/shop">Browse Shop</Link>
                </Button>
              </div>
            )}
            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-900">Need Help?</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <History className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Tracking Orders</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Orders are typically processed within 24 hours and shipped via express courier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Returns Policy</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">We offer a 30-day return policy for unopened Ayurvedic supplements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <OrderDetailModal order={selectedOrder} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} onReorder={handleReorder} onDownloadInvoice={handleDownloadInvoice} />
    </>
  )
}
