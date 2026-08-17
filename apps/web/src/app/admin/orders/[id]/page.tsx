'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, AlertTriangle, Package, Truck } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface OrderDetail {
  id: number
  status: string
  paymentStatus: string
  totalCents: number
  currency: string
  customerEmail: string | null
  customerName: string | null
  eazebusOrderId: string | null
  eazebusPaymentId: string | null
  shippingAddress: any
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
  user?: { id: string; name: string | null; email: string } | null
  items: Array<{
    id: number; title: string; sku: string; quantity: number; priceCents: number
    product?: { images: string[] } | null
  }>
}

const VALID_FULFILLMENT = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const VALID_PAYMENT = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    const id = params.id
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`)
      if (!res.ok) throw new Error('Order not found')
      const data = await res.json()
      setOrder(data.order)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => { load() }, [load])

  const updateStatus = async (field: string, value: string) => {
    if (!order) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update')
      }
      showSuccess(`${field === 'status' ? 'Status' : 'Payment status'} updated`)
      load()
    } catch (err: any) {
      showError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-600 font-medium">{error ?? 'Order not found'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
      </div>
    )
  }

  const shipping = order.shippingAddress && typeof order.shippingAddress === 'object'
    ? order.shippingAddress as Record<string, string>
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders"><ArrowLeft className="w-4 h-4 mr-2" /> Orders</Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items + Shipping */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Items</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.sku} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">₹{((item.priceCents * item.quantity) / 100).toLocaleString('en-IN')}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-black text-slate-900 text-lg">₹{(order.totalCents / 100).toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>

            {shipping && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Shipping Address</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="font-medium text-slate-900">{shipping.fullName}</p>
                    <p>{shipping.addressLine1}</p>
                    {shipping.addressLine2 && <p>{shipping.addressLine2}</p>}
                    <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
                    <p>{shipping.country}</p>
                    <p className="text-slate-400">{shipping.phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Status + Customer */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Fulfillment</label>
                  <Select value={order.status} onValueChange={v => updateStatus('status', v)} disabled={updating}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VALID_FULFILLMENT.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment</label>
                  <Select value={order.paymentStatus} onValueChange={v => updateStatus('paymentStatus', v)} disabled={updating}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VALID_PAYMENT.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {order.trackingNumber && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tracking</label>
                    <p className="text-sm font-mono text-slate-700">{order.trackingNumber}</p>
                  </div>
                )}
                {order.eazebusOrderId && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">EazeBus Order</label>
                    <p className="text-sm font-mono text-slate-700">{order.eazebusOrderId}</p>
                  </div>
                )}
                {order.eazebusPaymentId && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">EazeBus Payment</label>
                    <p className="text-sm font-mono text-slate-700">{order.eazebusPaymentId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Customer</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-slate-400">Name:</span> <span className="font-medium text-slate-900">{order.customerName || order.user?.name || '—'}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="font-medium text-slate-900">{order.customerEmail || order.user?.email || '—'}</span></div>
                {order.user && (
                  <div><span className="text-slate-400">User ID:</span> <span className="font-mono text-xs text-slate-600">{order.user.id}</span></div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Timestamps</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-slate-400">Created:</span> <span className="text-slate-700">{new Date(order.createdAt).toLocaleString('en-IN')}</span></div>
                <div><span className="text-slate-400">Updated:</span> <span className="text-slate-700">{new Date(order.updatedAt).toLocaleString('en-IN')}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
