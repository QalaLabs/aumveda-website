'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, UserCheck, Stethoscope, ArrowRight } from 'lucide-react'

const fieldClass =
  'w-full h-12 min-h-[44px] font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl px-4 bg-[hsl(var(--av-parchment))] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] disabled:opacity-60 disabled:cursor-not-allowed'

const labelClass = 'block font-body text-sm text-[hsl(var(--av-ink-text))] mb-1.5'

const primaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]'

const secondaryBtn =
  'w-full inline-flex h-12 min-h-[44px] items-center justify-center gap-3 rounded-full border border-[hsl(var(--av-stone))] font-body text-sm font-medium text-[hsl(var(--av-night))] hover:bg-[hsl(var(--av-stone)/0.4)] transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialPortal =
    searchParams.get('portal') === 'coach' ||
    searchParams.get('role') === 'coach' ||
    searchParams.get('role') === 'practitioner'
      ? 'coach'
      : 'client'

  const callbackUrl = searchParams.get('callbackUrl')

  const [portal, setPortal] = useState<'client' | 'coach'>(initialPortal)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')

  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)

  // Sync state if URL query parameter changes
  useEffect(() => {
    const p = searchParams.get('portal') || searchParams.get('role')
    if (p === 'coach' || p === 'practitioner') {
      setPortal('coach')
    } else if (p === 'client' || p === 'user') {
      setPortal('client')
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handlePortalSwitch = (nextPortal: 'client' | 'coach') => {
    setPortal(nextPortal)
    setError('')
    setInfo('')
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('portal', nextPortal)
    window.history.replaceState(null, '', `?${currentParams.toString()}`)
  }

  async function handleSuccessfulAuth() {
    // Fetch latest session to verify role
    const session = await getSession()
    const userRole = session?.user?.role

    if (portal === 'coach') {
      if (userRole === 'practitioner' || userRole === 'admin' || userRole === 'super_admin') {
        router.push('/practitioner')
      } else {
        // Logged in as regular user while in coach portal
        router.push('/dashboard')
      }
    } else {
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (userRole === 'practitioner') {
        router.push('/practitioner')
      } else {
        router.push('/dashboard')
      }
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        action: 'password',
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes('email_not_verified')) {
          setError('Your email is not verified yet. Please check your inbox for a verification link.')
        } else {
          setError('Invalid email or password.')
        }
      } else {
        await handleSuccessfulAuth()
      }
    } catch {
      setError('An unexpected authentication error occurred.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendOTP() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first.')
      return
    }

    setError('')
    setInfo('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setOtpSent(true)
      setTimer(60)
      setInfo('A verification code has been sent to your email.')
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOTPLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        otpCode: otpCode.trim(),
        action: 'otp',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid or expired verification code.')
      } else {
        await handleSuccessfulAuth()
      }
    } catch {
      setError('An unexpected authentication error occurred.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    const targetUrl = portal === 'coach' ? '/practitioner' : callbackUrl || '/dashboard'
    await signIn('google', { callbackUrl: targetUrl })
  }

  return (
    <>
      {/* Interconnected Portal Selector */}
      <div className="mb-6">
        <div
          className="flex p-1.5 rounded-2xl bg-[hsl(var(--av-stone)/0.35)] border border-[hsl(var(--av-stone))]"
          role="tablist"
          aria-label="Select Portal"
        >
          <button
            onClick={() => handlePortalSwitch('client')}
            type="button"
            role="tab"
            aria-selected={portal === 'client'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-body text-xs font-semibold tracking-wide transition-all ${
              portal === 'client'
                ? 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] shadow-sm'
                : 'text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Client Sanctuary
          </button>
          <button
            onClick={() => handlePortalSwitch('coach')}
            type="button"
            role="tab"
            aria-selected={portal === 'coach'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-body text-xs font-semibold tracking-wide transition-all ${
              portal === 'coach'
                ? 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] shadow-sm'
                : 'text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Coach Workspace
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase bg-[hsl(var(--av-gold)/0.15)] text-[hsl(var(--av-night))] border border-[hsl(var(--av-gold)/0.3)]">
            {portal === 'coach' ? (
              <>
                <UserCheck className="w-3 h-3 text-[hsl(var(--av-gold))]" />
                Practitioner & Coach Portal
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-[hsl(var(--av-gold))]" />
                Client Member Sign In
              </>
            )}
          </span>
        </div>
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance">
          {portal === 'coach' ? 'Coach Sign In' : 'Client Sign In'}
        </h1>
        <p className="font-body text-xs text-[hsl(var(--av-mute))] mt-1">
          {portal === 'coach'
            ? 'Access your client rosters, session notes, daily dose prescriptions, and calendar.'
            : 'Access your daily dose, rituals, journal, homework, and private sessions.'}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="font-body text-sm text-[hsl(var(--av-rose))] border border-[hsl(var(--av-rose)/0.35)] rounded-2xl px-4 py-3 mb-5"
        >
          {error}
        </p>
      )}

      {info && (
        <p
          role="status"
          className="font-body text-sm text-[hsl(var(--av-sage))] border border-[hsl(var(--av-sage)/0.35)] rounded-2xl px-4 py-3 mb-5"
        >
          {info}
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

      <div
        className="flex p-1 rounded-full border border-[hsl(var(--av-stone))] mb-6"
        role="tablist"
        aria-label="Sign-in method"
      >
        <button
          onClick={() => {
            setLoginMethod('password')
            setError('')
            setInfo('')
          }}
          type="button"
          role="tab"
          aria-selected={loginMethod === 'password'}
          className={`flex-1 h-10 min-h-[40px] font-body text-sm rounded-full transition-colors duration-[var(--duration-ui)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] ${
            loginMethod === 'password'
              ? 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))]'
              : 'text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => {
            setLoginMethod('otp')
            setError('')
            setInfo('')
          }}
          type="button"
          role="tab"
          aria-selected={loginMethod === 'otp'}
          className={`flex-1 h-10 min-h-[40px] font-body text-sm rounded-full transition-colors duration-[var(--duration-ui)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] ${
            loginMethod === 'otp'
              ? 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))]'
              : 'text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]'
          }`}
        >
          Email code
        </button>
      </div>

      {loginMethod === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div>
            <label className={labelClass} htmlFor="email">
              {portal === 'coach' ? 'Coach / Practitioner Email' : 'Client Email'}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder={portal === 'coach' ? 'coach@aumveda.com' : 'you@example.com'}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-body text-sm text-[hsl(var(--av-ink-text))]" htmlFor="password">
                Password
              </label>
              <Link
                href="/auth/reset-password"
                className="font-body text-sm text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading
              ? 'Signing in…'
              : portal === 'coach'
              ? 'Sign into Coach Workspace'
              : 'Sign into Sanctuary'}
          </button>
        </form>
      )}

      {loginMethod === 'otp' && (
        <form onSubmit={handleOTPLogin} className="space-y-5">
          <div>
            <label className={labelClass} htmlFor="otp-email">
              {portal === 'coach' ? 'Coach / Practitioner Email' : 'Email'}
            </label>
            <div className="relative">
              <input
                id="otp-email"
                type="email"
                required
                autoComplete="email"
                disabled={otpSent}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${fieldClass} pr-28`}
                placeholder={portal === 'coach' ? 'coach@aumveda.com' : 'you@example.com'}
              />
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || timer > 0}
                className="absolute right-1.5 top-1.5 h-9 px-3 rounded-full font-body text-xs font-medium text-[hsl(var(--av-night))] bg-[hsl(var(--av-stone)/0.6)] hover:bg-[hsl(var(--av-stone))] disabled:text-[hsl(var(--av-mute))] disabled:bg-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
              >
                {timer > 0 ? `Resend (${timer}s)` : otpSent ? 'Resend' : 'Send code'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label className={labelClass} htmlFor="otp-code">
                Verification code
              </label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className={`${fieldClass} tracking-[0.35em] text-center font-mono tabular`}
                placeholder="000000"
              />
            </div>
          )}

          {otpSent && (
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading
                ? 'Verifying…'
                : portal === 'coach'
                ? 'Verify & Enter Coach Portal'
                : 'Verify & Sign In'}
            </button>
          )}
        </form>
      )}

      {/* Interconnected Switch Link */}
      <div className="mt-8 pt-6 border-t border-[hsl(var(--av-stone))] text-center space-y-3">
        {portal === 'client' ? (
          <button
            type="button"
            onClick={() => handlePortalSwitch('coach')}
            className="inline-flex items-center gap-1.5 font-body text-xs text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] transition-colors group"
          >
            <span>Are you an Aumveda Coach or Practitioner?</span>
            <span className="font-semibold text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-gold))] group-hover:text-[hsl(var(--av-gold))] flex items-center gap-0.5">
              Coach Login <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handlePortalSwitch('client')}
            className="inline-flex items-center gap-1.5 font-body text-xs text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] transition-colors group"
          >
            <span>Looking for your personal healing sanctuary?</span>
            <span className="font-semibold text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-gold))] group-hover:text-[hsl(var(--av-gold))] flex items-center gap-0.5">
              Client Login <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        )}

        <p className="font-body text-sm text-[hsl(var(--av-mute))]">
          No account?{' '}
          <Link
            href="/auth/register"
            className="text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-[hsl(var(--av-mute))]">Loading login portal…</div>}>
      <LoginForm />
    </Suspense>
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

