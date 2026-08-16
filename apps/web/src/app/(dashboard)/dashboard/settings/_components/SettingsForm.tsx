'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { showSuccess, showError } from '@/utils/toast'

const TIMEZONES = [
  'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore',
  'Europe/London', 'Europe/Paris',
  'America/New_York', 'America/Los_Angeles',
  'Australia/Sydney',
]

interface Props {
  name: string
  email: string
  timezone: string
  bio: string
}

const NOTIFICATION_KEYS: { key: string; title: string; description: string }[] = [
  {
    key: 'notifications.email_progress',
    title: 'Email Progress Reports',
    description: 'Receive weekly summaries of completed practices and scores.',
  },
  {
    key: 'notifications.whatsapp_daily',
    title: 'WhatsApp Daily Ritual Prompts',
    description: 'Receive reminders for daily breathing and meditation audio.',
  },
]

const CONSENT_KEYS: { key: string; title: string; description: string }[] = [
  {
    key: 'therapeutic_sharing',
    title: 'Therapeutic Data Sharing',
    description: 'Allow Sejal Gala and Archana Jain to read journal entries marked visible.',
  },
  {
    key: 'dpdp_2023_digital_consent',
    title: 'DPDP Act 2023 Digital Consent',
    description: 'Data processed locally within sovereign cloud clusters in Mumbai (ap-south-1).',
  },
]

const DEFAULT_VALUES = Object.fromEntries(
  [...NOTIFICATION_KEYS, ...CONSENT_KEYS].map(c => [c.key, false])
)

export default function SettingsForm({ name: initName, email, timezone: initTz, bio: initBio }: Props) {
  const [name, setName] = useState(initName)
  const [timezone, setTimezone] = useState(initTz)
  const [bio, setBio] = useState(initBio)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prefs, setPrefs] = useState<Record<string, boolean>>(DEFAULT_VALUES)
  const [prefsLoaded, setPrefsLoaded] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/consent')
      .then(r => r.json())
      .then(d => {
        if (cancelled) return
        if (d.consents) {
          const mapped = d.consents.reduce((acc: Record<string, boolean>, c: any) => {
            if (c.key in DEFAULT_VALUES) acc[c.key] = !!c.value
            return acc
          }, {} as Record<string, boolean>)
          setPrefs(prev => ({ ...prev, ...mapped }))
        }
        setPrefsLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setPrefsLoaded(true)
      })
    return () => { cancelled = true }
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, timezone, bio }),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function togglePref(key: string, value: boolean) {
    setPrefs(prev => ({ ...prev, [key]: value }))
    setSavingKey(key)
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, version: 'v1' }),
      })
      if (!res.ok) throw new Error()
      showSuccess('Preference saved')
    } catch {
      showError('Failed to update preference')
      setPrefs(prev => ({ ...prev, [key]: !value }))
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Profile</h2>

        <div>
          <label className="block text-sm text-stone-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-stone-100 rounded-xl px-3 py-2.5 text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-600 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            placeholder="A little about you..."
          />
        </div>

        <div>
          <label className="block text-sm text-stone-600 mb-1">Timezone</label>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Security</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-stone-700">Active Sessions & Devices</p>
            <p className="text-xs text-stone-400">View and revoke active sessions on your account.</p>
          </div>
          <Link
            href="/dashboard/settings/devices"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg px-3.5 py-2 transition"
          >
            Manage Sessions
          </Link>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Notification Preferences</h2>
        {!prefsLoaded ? (
          <div className="h-16 animate-pulse bg-stone-50 rounded-xl" />
        ) : (
          <div className="space-y-3">
            {NOTIFICATION_KEYS.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-semibold text-stone-700">{c.title}</p>
                  <p className="text-xs text-stone-400">{c.description}</p>
                </div>
                <Switch
                  checked={prefs[c.key]}
                  disabled={savingKey === c.key}
                  onCheckedChange={(val) => togglePref(c.key, val)}
                  className="data-[state=checked]:bg-brand-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HIPAA / DPDP Act Consents */}
      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Privacy & Consent Checklists</h2>
        {!prefsLoaded ? (
          <div className="h-16 animate-pulse bg-stone-50 rounded-xl" />
        ) : (
          <div className="space-y-3">
            {CONSENT_KEYS.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-semibold text-stone-700">{c.title}</p>
                  <p className="text-xs text-stone-400">{c.description}</p>
                </div>
                <Switch
                  checked={prefs[c.key]}
                  disabled={savingKey === c.key}
                  onCheckedChange={(val) => togglePref(c.key, val)}
                  className="data-[state=checked]:bg-brand-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Account Danger Zone */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-700">Delete Account Permanent Action</p>
            <p className="text-[10px] text-stone-400">Instantly wipe your profile, assessment results, and logs.</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (confirm('Are you absolutely sure you want to delete your account? This action is permanent.')) {
                const res = await fetch('/api/users/me', { method: 'DELETE' })
                if (res.ok) {
                  window.location.href = '/'
                }
              }
            }}
            className="text-xs font-bold text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl px-4 py-2.5 transition text-center"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <p className="text-xs font-semibold text-emerald-600">Saved!</p>}
      </div>
    </form>
  )
}
