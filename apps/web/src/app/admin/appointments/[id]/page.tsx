'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, AlertTriangle, Calendar, User } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface BookingDetail {
  id: string
  practitioner: string
  serviceType: string
  bookingDatetime: string
  durationMinutes: number
  status: string
  amountPaid: number
  razorpayPaymentId: string | null
  zoomLink: string | null
  createdAt: string
  user?: { id: string; name: string | null; email: string } | null
  therapySession?: {
    keyThemes: string[]
    practicesAssigned: string[]
    distressFlag: boolean
    notesSubmittedAt: string | null
  } | null
}

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminAppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    const id = params.id
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/appointments/${id}`)
      if (!res.ok) throw new Error('Appointment not found')
      const data = await res.json()
      setBooking(data.booking)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load appointment')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => { load() }, [load])

  const updateStatus = async (value: string) => {
    if (!booking) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/appointments/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update')
      }
      showSuccess('Status updated')
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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-600 font-medium">{error ?? 'Appointment not found'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/appointments')}>Back to Appointments</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/appointments"><ArrowLeft className="w-4 h-4 mr-2" /> Appointments</Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Appointment</h1>
          <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLORS[booking.status] ?? 'text-slate-500'}`}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Booking Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Practitioner</span><span className="font-medium text-slate-900">{booking.practitioner}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Service</span><span className="font-medium text-slate-900">{booking.serviceType}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date & Time</span><span className="text-slate-700">{new Date(booking.bookingDatetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Duration</span><span className="text-slate-700">{booking.durationMinutes} minutes</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Amount Paid</span><span className="font-medium text-slate-900">{booking.amountPaid > 0 ? `₹${booking.amountPaid.toLocaleString('en-IN')}` : '—'}</span></div>
              {booking.razorpayPaymentId && (
                <div className="flex justify-between"><span className="text-slate-400">Payment ID</span><span className="font-mono text-xs text-slate-600">{booking.razorpayPaymentId}</span></div>
              )}
              {booking.zoomLink && (
                <div className="flex justify-between"><span className="text-slate-400">Zoom</span><a href={booking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[200px]">{booking.zoomLink}</a></div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Client</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="font-medium text-slate-900">{booking.user?.name || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-slate-700">{booking.user?.email || '—'}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Status</CardTitle></CardHeader>
              <CardContent>
                <Select value={booking.status} onValueChange={updateStatus} disabled={updating}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VALID_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {booking.therapySession && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Session Notes</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {booking.therapySession.keyThemes.length > 0 && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Key Themes</span>
                      <div className="flex flex-wrap gap-1">
                        {booking.therapySession.keyThemes.map(t => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {booking.therapySession.practicesAssigned.length > 0 && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Practices</span>
                      <div className="flex flex-wrap gap-1">
                        {booking.therapySession.practicesAssigned.map(p => (
                          <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {booking.therapySession.distressFlag && (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">Distress Flag</Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
