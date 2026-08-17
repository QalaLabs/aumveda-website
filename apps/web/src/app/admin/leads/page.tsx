'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Loader2, AlertTriangle, MessageSquare } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  tool: string
  source: string
  createdAt: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('page', String(page))
      params.set('limit', '30')

      const res = await fetch(`/api/admin/leads?${params}`)
      if (!res.ok) throw new Error('Failed to load leads')
      const data = await res.json()
      setLeads(data.leads ?? [])
      setTotalPages(data.totalPages ?? 1)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-1">Captured from tool interactions and lead magnets</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or email..." className="pl-10" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-slate-400 animate-spin" /></div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load leads</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No leads captured yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Email</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Tool</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Source</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map(lead => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-sm font-medium text-slate-900">{lead.name}</TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.email}</TableCell>
                      <TableCell className="text-xs text-slate-500">{lead.tool || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-500">{lead.source || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {leads.map(lead => (
                <div key={lead.id} className="p-4">
                  <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                  <div className="text-xs text-slate-400">{lead.email}</div>
                  <div className="text-xs text-slate-500 mt-1">{lead.tool} · {lead.source} · {new Date(lead.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
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
