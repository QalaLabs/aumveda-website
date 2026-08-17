'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, AlertTriangle, ShoppingCart } from 'lucide-react'

interface AdminOrder {
  id: number
  status: string
  paymentStatus: string
  totalCents: number
  currency: string
  customerEmail: string | null
  customerName: string | null
  createdAt: string
  user?: { id: string; name: string | null; email: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
}

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
  REFUNDED: 'bg-slate-50 text-slate-700 border-slate-200',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (paymentStatus) params.set('paymentStatus', paymentStatus)
      params.set('page', String(page))
      params.set('limit', '20')

      const res = await fetch(`/api/admin/orders?${params}`)
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      setOrders(data.orders ?? [])
      setTotalPages(data.totalPages ?? 1)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [search, status, paymentStatus, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by email, name, or order ID..."
              className="pl-10"
            />
          </div>
          <Select value={status || '__all__'} onValueChange={v => { setStatus(v === '__all__' ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Statuses</SelectItem>
              {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentStatus || '__all__'} onValueChange={v => { setPaymentStatus(v === '__all__' ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Payments</SelectItem>
              {['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load orders</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Order</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Customer</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Payment</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-slate-900 hover:text-amber-700">
                          #{order.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-900">{order.customerName || order.user?.name || '—'}</div>
                        <div className="text-xs text-slate-400">{order.customerEmail || order.user?.email || '—'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-bold text-slate-900">₹{(order.totalCents / 100).toLocaleString('en-IN')}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-bold ${PAYMENT_COLORS[order.paymentStatus] ?? 'text-slate-500'}`}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLORS[order.status] ?? 'text-slate-500'}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {orders.map(order => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-4 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-slate-900">#{order.id}</span>
                    <span className="text-sm font-bold text-slate-900">₹{(order.totalCents / 100).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{order.customerName || order.user?.name || '—'}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-[10px] font-bold ${PAYMENT_COLORS[order.paymentStatus] ?? 'text-slate-500'}`}>{order.paymentStatus}</Badge>
                    <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLORS[order.status] ?? 'text-slate-500'}`}>{order.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  )
}
