'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, AlertTriangle, User } from 'lucide-react'

interface UserDetail {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  dob: string | null
  placeOfBirth: string | null
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
  profile?: {
    timezone: string; avatarUrl: string | null; bio: string | null
    progress: number; streakDays: number; onboardingDone: boolean
  } | null
  _count: { orders: number; bookings: number }
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const id = params.id
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`)
      if (!res.ok) throw new Error('User not found')
      const data = await res.json()
      setUser(data.user)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-slate-600 font-medium">{error ?? 'User not found'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>Back to Users</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users"><ArrowLeft className="w-4 h-4 mr-2" /> Users</Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">{user.name || 'Unnamed User'}</h1>
          <Badge variant="outline" className="text-[10px] font-bold">{user.role.replace('_', ' ')}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Account</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-medium text-slate-900">{user.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Role</span><span className="font-medium text-slate-900">{user.role}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Joined</span><span className="text-slate-700">{new Date(user.createdAt).toLocaleDateString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Orders</span><span className="font-medium text-slate-900">{user._count.orders}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Bookings</span><span className="font-medium text-slate-900">{user._count.bookings}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Timezone</span><span className="text-slate-700">{user.profile?.timezone ?? '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Progress</span><span className="font-medium text-slate-900">{user.profile?.progress ?? 0}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Streak</span><span className="text-slate-700">{user.profile?.streakDays ?? 0} days</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Onboarding</span><span className="text-slate-700">{user.profile?.onboardingDone ? 'Complete' : 'Incomplete'}</span></div>
              {user.profile?.bio && (
                <div><span className="text-slate-400 block mb-1">Bio</span><p className="text-slate-600">{user.profile.bio}</p></div>
              )}
            </CardContent>
          </Card>

          {(user.sunSign || user.moonSign || user.risingSign || user.placeOfBirth) && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Astrology</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.sunSign && <div className="flex justify-between"><span className="text-slate-400">Sun Sign</span><span className="text-slate-700">{user.sunSign}</span></div>}
                {user.moonSign && <div className="flex justify-between"><span className="text-slate-400">Moon Sign</span><span className="text-slate-700">{user.moonSign}</span></div>}
                {user.risingSign && <div className="flex justify-between"><span className="text-slate-400">Rising Sign</span><span className="text-slate-700">{user.risingSign}</span></div>}
                {user.placeOfBirth && <div className="flex justify-between"><span className="text-slate-400">Birth Place</span><span className="text-slate-700">{user.placeOfBirth}</span></div>}
                {user.dob && <div className="flex justify-between"><span className="text-slate-400">DOB</span><span className="text-slate-700">{new Date(user.dob).toLocaleDateString('en-IN')}</span></div>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
