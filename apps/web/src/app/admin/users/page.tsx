'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, AlertTriangle, Users } from 'lucide-react'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  profile?: { progress: number; streakDays: number; onboardingDone: boolean } | null
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
  practitioner: 'bg-blue-50 text-blue-700 border-blue-200',
  client: 'bg-slate-50 text-slate-700 border-slate-200',
  user: 'bg-slate-50 text-slate-700 border-slate-200',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (role) params.set('role', role)
      params.set('page', String(page))
      params.set('limit', '20')

      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      setUsers(data.users ?? [])
      setTotalPages(data.totalPages ?? 1)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [search, role, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage platform users</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or email..." className="pl-10" />
          </div>
          <Select value={role || '__all__'} onValueChange={v => { setRole(v === '__all__' ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Roles</SelectItem>
              {['client', 'practitioner', 'admin', 'super_admin'].map(r => (
                <SelectItem key={r} value={r}>{r.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-slate-400 animate-spin" /></div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load users</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Progress</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Link href={`/admin/users/${user.id}`} className="hover:text-amber-700">
                          <div className="text-sm font-medium text-slate-900">{user.name || 'Unnamed'}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-bold ${ROLE_COLORS[user.role] ?? 'text-slate-500'}`}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{user.profile?.progress ?? 0}%</TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {users.map(user => (
                <Link key={user.id} href={`/admin/users/${user.id}`} className="block p-4 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{user.name || 'Unnamed'}</span>
                    <Badge variant="outline" className={`text-[10px] font-bold ${ROLE_COLORS[user.role] ?? 'text-slate-500'}`}>{user.role.replace('_', ' ')}</Badge>
                  </div>
                  <div className="text-xs text-slate-400">{user.email}</div>
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
