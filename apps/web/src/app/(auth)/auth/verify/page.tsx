'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function VerifyPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!email || !token) return

    async function verify() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } catch (err: any) {
        setError(err.message || 'An error occurred during verification.')
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [email, token, router])

  if (loading) {
    return (
      <div className="text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" />
        <h2 className="text-xl font-semibold text-stone-800 font-serif">Verifying your email...</h2>
        <p className="text-sm text-stone-500">Please wait while we activate your account.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-semibold text-stone-800 font-serif">Email Verified!</h2>
        <p className="text-sm text-stone-500">
          Your account is now active. Redirecting you to sign in...
        </p>
        <Link href="/auth/login" className="block text-sm text-brand-600 hover:underline mt-4">
          Go to Sign In
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl">❌</div>
        <h2 className="text-xl font-semibold text-stone-800 font-serif">Verification Failed</h2>
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
        <p className="text-sm text-stone-500 mt-2">
          Please check the link in your email or try registering again.
        </p>
        <Link href="/auth/login" className="block text-sm text-brand-600 hover:underline mt-4">
          Back to sign in
        </Link>
      </div>
    )
  }

  // Fallback view when no token is present (original static email sent screen)
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">✉️</div>
      <h2 className="text-xl font-semibold text-stone-800 font-serif">Verify your email</h2>
      <p className="text-sm text-stone-500">
        We have sent a verification link to your inbox. Please check your email and click the link to activate your account.
      </p>
      <Link href="/auth/login" className="block text-sm text-brand-600 hover:underline mt-4">
        Back to sign in
      </Link>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-stone-500">Loading…</p>
        </div>
      }
    >
      <VerifyPageInner />
    </Suspense>
  )
}
