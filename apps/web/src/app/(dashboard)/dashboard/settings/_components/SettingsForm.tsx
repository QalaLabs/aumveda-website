'use client'

import { useState } from 'react'
import Link from 'next/link'

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

export default function SettingsForm({ name: initName, email, timezone: initTz, bio: initBio }: Props) {
  const [name, setName] = useState(initName)
  const [timezone, setTimezone] = useState(initTz)
  const [bio, setBio] = useState(initBio)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

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
        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 select-none">
            <input type="checkbox" defaultChecked className="rounded border-stone-300 text-brand-600 focus:ring-brand-300 w-4 h-4 mt-0.5" />
            <div>
              <p className="font-semibold">Email Progress Reports</p>
              <p className="text-stone-400">Receive weekly summaries of completed practices and scores.</p>
            </div>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 select-none">
            <input type="checkbox" defaultChecked className="rounded border-stone-300 text-brand-600 focus:ring-brand-300 w-4 h-4 mt-0.5" />
            <div>
              <p className="font-semibold">WhatsApp Daily Ritual Prompts</p>
              <p className="text-stone-400">Receive reminders for daily breathing and meditation audio.</p>
            </div>
          </label>
        </div>
      </div>

      {/* HIPAA / DPDP Act Consents */}
      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Privacy & Consent Checklists</h2>
        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 select-none">
            <input type="checkbox" defaultChecked disabled className="rounded border-stone-150 text-brand-600 w-4 h-4 mt-0.5 cursor-not-allowed" />
            <div>
              <p className="font-semibold">Therapeutic Data Sharing</p>
              <p className="text-stone-400">Allow Sejal Gala and Archana Jain to read journal entries marked visible.</p>
            </div>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 select-none">
            <input type="checkbox" defaultChecked disabled className="rounded border-stone-150 text-brand-600 w-4 h-4 mt-0.5 cursor-not-allowed" />
            <div>
              <p className="font-semibold">DPDP Act 2023 Digital Consent</p>
              <p className="text-stone-400">Data processed locally within sovereign cloud clusters in Mumbai (ap-south-1).</p>
            </div>
          </label>
        </div>
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
                  // Direct clean logout redirection
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
