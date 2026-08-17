'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, AlertTriangle, Calendar } from 'lucide-react'

interface AdminBooking {
  id: string
  practitioner: string
  serviceType: string
  bookingDatetime: string
  durationMinutes: number
  status: string
  amountPaid: number
  createdAt: string
  user?: { id: string; name: string | null; email: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminAppointmentsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      params.set('page', String(page))
      params.set('limit', '20')

      const res = await fetch(`/api/admin/appointments?${params}`)
      if (!res.ok) throw new Error('Failed to load appointments')
      const data = await res.json()
      setBookings(data.bookings ?? [])
      setTotalPages(data.totalPages ?? 1)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage client bookings and sessions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by client, practitioner..."
              className="pl-10"
            />
          </div>
          <Select value={status || '__all__'} onValueChange={v => { setStatus(v === '__all__' ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Statuses</SelectItem>
              {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load appointments</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No appointments found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Client</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Practitioner</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Service</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date & Time</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Link href={`/admin/appointments/${booking.id}`} className="hover:text-amber-700">
                          <div className="text-sm font-medium text-slate-900">{booking.user?.name || '—'}</div>
                          <div className="text-xs text-slate-400">{booking.user?.email || '—'}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">{booking.practitioner}</TableCell>
                      <TableCell className="text-xs text-slate-500">{booking.serviceType}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(booking.bookingDatetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        <div className="text-[10px] text-slate-400">{booking.durationMinutes} min</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLORS[booking.status] ?? 'text-slate-500'}`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-slate-900">
                        {booking.amountPaid > 0 ? `₹${booking.amountPaid.toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {bookings.map(booking => (
                <Link key={booking.id} href={`/admin/appointments/${booking.id}`} className="block p-4 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{booking.user?.name || '—'}</span>
                    <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLORS[booking.status] ?? 'text-slate-500'}`}>{booking.status}</Badge>
                  </div>
                  <div className="text-xs text-slate-400">{booking.practitioner} · {booking.serviceType}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(booking.bookingDatetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
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
