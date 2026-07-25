'use client'

import { useState } from 'react'
import Link from 'next/link'

const fieldClass =
  'w-full h-12 min-h-[44px] font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl px-4 bg-[hsl(var(--av-parchment))] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'

const labelClass = 'block font-body text-sm text-[hsl(var(--av-ink-text))] mb-1.5'

const primaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]'

export default function RequestResetPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link')
      }

      setSent(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance">
          Check your email
        </h1>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[40ch] mx-auto">
          If an account exists for{' '}
          <span className="text-[hsl(var(--av-ink-text))]">{email}</span>, we sent a password reset
          link.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-11 min-h-[44px] items-center font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] mb-2 text-balance">
        Reset password
      </h1>
      <p className="font-body text-sm text-[hsl(var(--av-mute))] mb-8 leading-relaxed max-w-[45ch]">
        Enter your email and we will send a link to choose a new password.
      </p>

      {error && (
        <p
          role="alert"
          className="font-body text-sm text-[hsl(var(--av-rose))] border border-[hsl(var(--av-rose)/0.35)] rounded-2xl px-4 py-3 mb-5"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? 'Sending link…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center mt-8">
        <Link
          href="/auth/login"
          className="inline-flex h-11 min-h-[44px] items-center font-body text-sm text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
        >
          Back to sign in
        </Link>
      </p>
    </>
  )
}
