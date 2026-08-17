'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, MessageSquare, Calendar, IndianRupee, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardMetrics {
  products: { total: number; active: number; lowStock: number; outOfStock: number }
  orders: { total: number; pending: number; paid: number }
  revenue: number // in INR
  users: { total: number }
  leads: { total: number }
  appointments: { total: number; pending: number }
}

function MetricCard({ title, value, icon: Icon, description, href }: {
  title: string; value: string | number; icon: React.ElementType; description?: string; href?: string
}) {
  const content = (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-black text-slate-900">{value}</p>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
  if (href) return <Link href={href}>{content}</Link>
  return content
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/dashboard')
      if (!res.ok) throw new Error('Failed to load dashboard')
      const data = await res.json()
      setMetrics(data)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-600 font-medium">{error}</p>
        <Button onClick={load}>Retry</Button>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your operations</p>
        </div>

        {/* Commerce */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Commerce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Products" value={metrics.products.total} icon={Package} href="/admin/products" description={`${metrics.products.active} active`} />
            <MetricCard title="Total Orders" value={metrics.orders.total} icon={ShoppingCart} href="/admin/orders" description={`${metrics.orders.pending} pending`} />
            <MetricCard title="Revenue" value={`₹${metrics.revenue.toLocaleString('en-IN')}`} icon={IndianRupee} description="From paid orders" />
            <MetricCard title="Low Stock" value={metrics.products.lowStock} icon={Package} description={`${metrics.products.outOfStock} out of stock`} />
          </div>
        </div>

        {/* Users & Operations */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Users & Operations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard title="Total Users" value={metrics.users.total} icon={Users} href="/admin/users" />
            <MetricCard title="Leads" value={metrics.leads.total} icon={MessageSquare} href="/admin/leads" />
            <MetricCard title="Appointments" value={metrics.appointments.total} icon={Calendar} href="/admin/appointments" description={`${metrics.appointments.pending} pending`} />
          </div>
        </div>
      </div>
    </div>
  )
}
