'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, AlertTriangle, Film, Check, X } from 'lucide-react'

interface AdminReel {
  id: string
  title: string
  creatorName: string
  creatorHandle: string | null
  muxAssetId: string
  healingModality: string
  chakraTag: string | null
  profileTags: string[]
  durationSeconds: number
  isPublished: boolean
  approvedBy: string | null
  createdAt: string
}

type StatusFilter = 'pending' | 'approved' | 'rejected'

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminReelsPage() {
  const [reels, setReels] = useState<AdminReel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusFilter>('pending')
  const [actingId, setActingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reels?status=${status}`)
      if (!res.ok) throw new Error('Failed to load reels')
      const data = await res.json()
      setReels(data.data?.reels ?? [])
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load reels')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActingId(id)
    try {
      const res = await fetch(`/api/admin/reels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error('Failed to update reel')
      // Optimistically remove from the current filtered list.
      setReels((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      setError(err.message ?? 'Failed to update reel')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reels</h1>
          <p className="text-sm text-slate-500 mt-1">Review creator-submitted reels before they go live</p>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={status === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
            <h2 className="font-bold text-slate-900 mb-2">Could not load reels</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        ) : reels.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Film className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No {status} reels.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Title</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Creator</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Modality</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Chakra</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Duration</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Submitted</TableHead>
                    {status === 'pending' && (
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reels.map((reel) => (
                    <TableRow key={reel.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-sm font-medium text-slate-900 max-w-xs truncate">{reel.title}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {reel.creatorHandle ? `@${reel.creatorHandle}` : reel.creatorName}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{reel.healingModality}</TableCell>
                      <TableCell className="text-xs text-slate-500">{reel.chakraTag || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-500">{reel.durationSeconds}s</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(reel.createdAt).toLocaleDateString('en-IN')}
                      </TableCell>
                      {status === 'pending' && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actingId === reel.id}
                              onClick={() => handleAction(reel.id, 'approve')}
                            >
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actingId === reel.id}
                              onClick={() => handleAction(reel.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {reels.map((reel) => (
                <div key={reel.id} className="p-4 space-y-2">
                  <div className="text-sm font-medium text-slate-900">{reel.title}</div>
                  <div className="text-xs text-slate-400">
                    {reel.creatorHandle ? `@${reel.creatorHandle}` : reel.creatorName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {reel.healingModality} · {reel.chakraTag || 'No chakra tag'} · {reel.durationSeconds}s
                  </div>
                  {status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actingId === reel.id}
                        onClick={() => handleAction(reel.id, 'approve')}
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actingId === reel.id}
                        onClick={() => handleAction(reel.id, 'reject')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
