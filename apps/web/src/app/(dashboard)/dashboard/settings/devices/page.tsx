'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Laptop, Smartphone, Globe, Trash2, ArrowLeft } from 'lucide-react'
import Topbar from '../../../_components/Topbar'

interface ActiveSession {
  id: string
  os: string
  browser: string
  ipAddress: string
  createdAt: string
  expires: string
}

export default function DevicesPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    try {
      const res = await fetch('/api/auth/sessions')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch sessions')
      setSessions(data.sessions || [])
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading sessions.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRevoke(sessionId: string) {
    if (confirm('Are you sure you want to revoke this session? The device will be logged out immediately.')) {
      setRevokingId(sessionId)
      setError('')
      try {
        const res = await fetch('/api/auth/sessions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to revoke session')
        
        // Remove from list
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      } catch (err: any) {
        setError(err.message || 'Failed to revoke session.')
      } finally {
        setRevokingId(null)
      }
    }
  }

  return (
    <>
      <Topbar title="Device Management" />
      <div className="px-4 lg:px-8 py-6 max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Settings
          </Link>
        </div>

        <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 font-serif">Active Sessions</h2>
            <p className="text-xs text-stone-400 mt-1">
              These are the devices that have authenticated to your account. You can revoke any session to log out that device.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No active sessions found.</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {sessions.map((s) => {
                const isMobile = s.os === 'iOS' || s.os === 'Android'
                return (
                  <div key={s.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500">
                        {isMobile ? (
                          <Smartphone className="w-5 h-5 text-stone-500" />
                        ) : s.os === 'Unknown Device' ? (
                          <Globe className="w-5 h-5 text-stone-500" />
                        ) : (
                          <Laptop className="w-5 h-5 text-stone-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {s.browser} on {s.os}
                        </p>
                        <p className="text-xs text-stone-400">
                          IP: {s.ipAddress} • Logged in {new Date(s.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevoke(s.id)}
                      disabled={revokingId === s.id}
                      className="text-stone-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      title="Revoke session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
