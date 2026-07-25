'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const fieldClass =
  'w-full h-12 min-h-[44px] font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl px-4 bg-[hsl(var(--av-parchment))] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] disabled:opacity-50'

const labelClass = 'block font-body text-sm text-[hsl(var(--av-ink-text))] mb-1.5'

const primaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]'

export default function ConfirmResetPage() {
  return (
    <Suspense fallback={<p className="font-body text-sm text-[hsl(var(--av-mute))]">Loading…</p>}>
      <ConfirmResetPageInner />
    </Suspense>
  )
}

function ConfirmResetPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = searchParams.get('token') || ''
    const e = searchParams.get('email') || ''
    setToken(t)
    setEmail(e)
    if (!t || !e) {
      setError('Invalid or missing reset token parameters.')
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !email) return

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance">
          Password updated
        </h1>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
          Your password has been updated. Redirecting you to sign in…
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-11 min-h-[44px] items-center font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
        >
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] mb-2 text-balance">
        Choose new password
      </h1>
      <p className="font-body text-sm text-[hsl(var(--av-mute))] mb-8 leading-relaxed">
        Enter and confirm your new password below.
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
          <label className={labelClass} htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            disabled={!token || !email}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            disabled={!token || !email}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldClass}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading || !token || !email} className={primaryBtn}>
          {loading ? 'Updating password…' : 'Update password'}
        </button>
      </form>
    </>
  )
}
