'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

const fieldClass =
  'w-full h-12 min-h-[44px] font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl px-4 bg-[hsl(var(--av-parchment))] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'

const labelClass = 'block font-body text-sm text-[hsl(var(--av-ink-text))] mb-1.5'

const primaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]'

const secondaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center gap-3 rounded-full border border-[hsl(var(--av-stone))] font-body text-sm font-medium text-[hsl(var(--av-night))] hover:bg-[hsl(var(--av-stone)/0.4)] transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.')
      }

      setRegistered(true)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/onboarding/step-1' })
  }

  if (registered) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance">
          Check your email
        </h1>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[40ch] mx-auto">
          We sent a verification link to{' '}
          <span className="text-[hsl(var(--av-ink-text))]">{email}</span>. Open it to activate your
          account.
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
      <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] mb-8 text-balance">
        Create your account
      </h1>

      {error && (
        <p
          role="alert"
          className="font-body text-sm text-[hsl(var(--av-rose))] border border-[hsl(var(--av-rose)/0.35)] rounded-2xl px-4 py-3 mb-5"
        >
          {error}
        </p>
      )}

      <button type="button" onClick={handleGoogle} disabled={loading} className={`${secondaryBtn} mb-6`}>
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="relative mb-6" role="separator" aria-orientation="horizontal">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-[hsl(var(--av-stone))]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[hsl(40_40%_97%)] px-3 font-body text-xs text-[hsl(var(--av-mute))]">
            or
          </span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
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
        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="Min. 8 characters"
          />
        </div>
        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center font-body text-sm text-[hsl(var(--av-mute))] mt-8">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center font-body text-xs text-[hsl(var(--av-mute))] mt-5 leading-relaxed">
        By creating an account you agree to our{' '}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
