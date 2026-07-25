'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent } from '../../design-system'
import { fadeUpVariants } from '../../animation/variants'
import { usePortal } from '../../engine/PortalContext'
import type { StepProps, PortalData } from '../../engine/types'
import { CalendarSelector } from './CalendarSelector'
import { PaymentForm } from './PaymentForm'
import { TrustInvite } from './TrustInvite'

export function registerStep8() {
  StepRegistry.register({
    id: 8,
    title: 'Your Healing Blueprint',
    component: Step8Wrapper,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

type SubState =
  | 'decoding'
  | 'report'
  | 'invite'
  | 'path'
  | 'booking'
  | 'payment'
  | 'register'
  | 'success'

interface PackageOption {
  id: 'free' | 'single' | '3_session' | '12_session'
  name: string
  price: number
  duration: number
  description: string
}

const PACKAGES: PackageOption[] = [
  {
    id: 'free',
    name: 'Free Discovery Call',
    price: 0,
    duration: 15,
    description: '15 minutes to review your blueprint and align on what comes next.',
  },
  {
    id: 'single',
    name: 'Deep Dive Session',
    price: 1500,
    duration: 60,
    description: '60-minute somatic or Vedic deep dive with your matched practitioner.',
  },
  {
    id: '3_session',
    name: '3-Session Reset',
    price: 3999,
    duration: 180,
    description: 'Three guided sessions for nervous-system regulation and integration.',
  },
  {
    id: '12_session',
    name: '12-Session Transformation',
    price: 12999,
    duration: 720,
    description: 'Full pathway with personalised Daily Dose and ongoing support.',
  },
]

function Step8Booking({ data }: StepProps<PortalData>) {
  const router = useRouter()
  const { completePortal } = usePortal()

  const [subState, setSubState] = useState<SubState>('decoding')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(PACKAGES[0])
  const [bookingTime, setBookingTime] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [showDeeper, setShowDeeper] = useState(false)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [regError, setRegError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (subState !== 'decoding') return
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setSubState('report'), 350)
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [subState])

  const getChakraAnalysis = () => {
    switch (data.chakraSelected) {
      case 'root':
        return 'Your Root centre asks for grounding — safety, steadiness, and a body that can rest.'
      case 'sacral':
        return 'Your Sacral centre asks for creative flow and emotional honesty in relationship.'
      case 'solar_plexus':
        return 'Your Solar Plexus asks for clearer boundaries and kinder power.'
      case 'heart':
        return 'Your Heart centre asks for trust, thawing, and room to feel without armour.'
      case 'throat':
        return 'Your Throat centre asks for truth spoken at a pace your nervous system can hold.'
      case 'third_eye':
        return 'Your Third Eye asks for quiet mind and intuition without overthinking.'
      case 'crown':
        return 'Your Crown asks for meaning, belonging, and reconnection to purpose.'
      default:
        return 'Your primary centre is asking for gentle, consistent attention.'
    }
  }

  const getProfileDescription = () => {
    switch (data.profileResult) {
      case 'anxious_achiever':
        return 'You often convert unease into productivity. Healing here begins with slowing safely.'
      case 'wounded_warrior':
        return 'Your body still braces. Somatic release and paced care are the right door.'
      case 'frozen_heart':
        return 'Feeling stays guarded. Warmth and trust rebuild capacity over time.'
      case 'lost_soul':
        return 'Direction feels foggy. Grounding and cosmic context help you reorient.'
      case 'silent_sufferer':
        return 'You carry much inwardly. Voice, boundaries, and being heard matter here.'
      case 'awakening_one':
        return 'You are in transition. Integration and steady companionship serve you best.'
      default:
        return 'You are ready for targeted, human-guided healing.'
    }
  }

  const getRecommendedTherapist = () => {
    const isSomatic =
      data.profileResult === 'wounded_warrior' ||
      data.profileResult === 'anxious_achiever' ||
      data.profileResult === 'frozen_heart'

    if (isSomatic) {
      return {
        id: 'sejal' as const,
        name: 'Sejal Jain',
        role: 'Healing Facilitator · Somatic & nervous-system work · Mumbai',
        bio: 'Sejal holds CBT-informed coaching, breathwork, and somatic practices — evidence meeting presence, never clinical coldness.',
      }
    }
    return {
      id: 'archana' as const,
      name: 'Archana Jain',
      role: 'Vedic Practitioner · Astrology, Vastu, ritual · Jaipur',
      bio: 'Archana brings 25+ years of Vedic lineage — chart, space, and ritual as a map for how you heal in daily life.',
    }
  }

  const therapist = getRecommendedTherapist()

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')

    if (password.length < 8) {
      setRegError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setRegError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      const regRes = await fetch('/api/auth/register-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name, password }),
      })
      const regData = await regRes.json()
      if (!regRes.ok) throw new Error(regData.error || 'Failed to create account')

      const bookRes = await fetch('/api/portal/portal-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          practitioner: therapist.id,
          serviceType: selectedPackage.id === 'free' ? 'discovery_call' : selectedPackage.name,
          bookingDatetime: bookingTime,
          durationMinutes: selectedPackage.duration,
          amountPaid: selectedPackage.price,
          packageType: selectedPackage.id,
          razorpayPaymentId: paymentId,
        }),
      })
      const bookData = await bookRes.json()
      if (!bookRes.ok) throw new Error(bookData.error || 'Failed to save booking')

      await completePortal()

      const signInResult = await signIn('credentials', {
        email: data.email,
        password,
        action: 'password',
        redirect: false,
      })

      if (signInResult?.error) {
        setRegError('Account created. Please sign in to continue.')
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        setSubState('success')
        setTimeout(() => router.push('/dashboard'), 2800)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setRegError(message)
      setSubmitting(false)
    }
  }

  const formatBooking = () => {
    if (!bookingTime) return ''
    return new Date(bookingTime).toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-8">
      <AnimatePresence mode="wait">
        {subState === 'decoding' && (
          <motion.div
            key="decoding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 text-center space-y-6"
            role="status"
            aria-live="polite"
          >
            <PortalContent maxWidth="max-w-sm">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Preparing
              </p>
              <h2 className="font-serif text-2xl text-[hsl(var(--av-parchment))] mt-3">
                Gathering your blueprint
              </h2>
              <div className="w-full h-px bg-[hsl(var(--av-parchment)/0.15)] mt-8 overflow-hidden">
                <motion.div
                  className="h-full bg-[hsl(var(--av-gold))]"
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </PortalContent>
          </motion.div>
        )}

        {subState === 'report' && (
          <motion.div
            key="report"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-xl">
              <div className="space-y-10 text-center">
                <div className="space-y-3">
                  <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                    Your blueprint
                  </p>
                  <h1 className="font-serif text-3xl text-[hsl(var(--av-parchment))] text-balance">
                    We see where you are
                  </h1>
                </div>

                <div className="text-left space-y-6 border-y border-[hsl(var(--av-parchment)/0.1)] py-8">
                  <div className="space-y-2">
                    <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))]">
                      Energy
                    </p>
                    <p className="font-body text-base text-[hsl(var(--av-parchment)/0.75)] leading-relaxed capitalize">
                      {data.chakraSelected?.replace(/_/g, ' ')} — {getChakraAnalysis()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))]">
                      Pattern
                    </p>
                    <p className="font-body text-base text-[hsl(var(--av-parchment)/0.75)] leading-relaxed">
                      {getProfileDescription()}
                    </p>
                  </div>
                  {(data.sunSign || data.tarotCard) && (
                    <div className="space-y-2">
                      <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))]">
                        Context
                      </p>
                      <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)]">
                        {[
                          data.sunSign && `Sun ${data.sunSign}`,
                          data.moonSign && `Moon ${data.moonSign}`,
                          data.tarotCard && data.tarotCard.replace(/_/g, ' '),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSubState('invite')}
                  className="min-h-[52px] px-10 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium active:scale-[0.97] transition-transform"
                >
                  Meet your practitioner
                </button>
              </div>
            </PortalContent>
          </motion.div>
        )}

        {subState === 'invite' && (
          <motion.div
            key="invite"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-xl">
              <TrustInvite
                therapistName={therapist.name}
                therapistRole={therapist.role}
                therapistBio={therapist.bio}
                onContinue={() => {
                  setSelectedPackage(PACKAGES[0])
                  setSubState('path')
                }}
                onBack={() => setSubState('report')}
              />
            </PortalContent>
          </motion.div>
        )}

        {subState === 'path' && (
          <motion.div
            key="path"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-lg">
              <div className="space-y-10 text-center">
                <div className="space-y-3">
                  <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                    How would you like to begin?
                  </p>
                  <h2 className="font-serif text-3xl text-[hsl(var(--av-parchment))] text-balance">
                    Start with a Discovery Call
                  </h2>
                  <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)] leading-relaxed max-w-[42ch] mx-auto">
                    Free · 15 minutes · with {therapist.name}. No obligation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(PACKAGES[0])
                    setSubState('booking')
                  }}
                  className="w-full min-h-[52px] rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium active:scale-[0.97] transition-transform"
                >
                  Book free Discovery Call
                </button>

                <div className="border-t border-[hsl(var(--av-parchment)/0.1)] pt-8">
                  <button
                    type="button"
                    onClick={() => setShowDeeper(!showDeeper)}
                    className="font-body text-sm text-[hsl(var(--av-parchment)/0.5)] underline underline-offset-4"
                    aria-expanded={showDeeper}
                  >
                    {showDeeper ? 'Hide programmes' : 'Prefer a structured programme?'}
                  </button>

                  {showDeeper && (
                    <ul className="mt-6 space-y-3 text-left">
                      {PACKAGES.filter((p) => p.id !== 'free').map((pkg) => (
                        <li key={pkg.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPackage(pkg)
                              setSubState('booking')
                            }}
                            className="w-full rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] p-5 text-left hover:border-[hsl(var(--av-gold)/0.4)] transition-colors"
                          >
                            <div className="flex justify-between gap-3">
                              <span className="font-serif text-lg text-[hsl(var(--av-parchment))]">
                                {pkg.name}
                              </span>
                              <span className="font-mono text-sm tabular text-[hsl(var(--av-gold-soft))]">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="mt-2 font-body text-sm text-[hsl(var(--av-parchment)/0.5)]">
                              {pkg.description}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSubState('invite')}
                  className="font-body text-sm text-[hsl(var(--av-parchment)/0.35)]"
                >
                  Back
                </button>
              </div>
            </PortalContent>
          </motion.div>
        )}

        {subState === 'booking' && (
          <motion.div
            key="booking"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-xl">
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                    {selectedPackage.name}
                  </p>
                  <h2 className="font-serif text-2xl text-[hsl(var(--av-parchment))]">
                    Pick a moment that feels calm
                  </h2>
                </div>

                <div className="rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] p-6">
                  <CalendarSelector
                    practitionerName={therapist.name}
                    onChange={(datetime) => setBookingTime(datetime)}
                  />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    disabled={!bookingTime}
                    onClick={() => {
                      if (selectedPackage.id === 'free') setSubState('register')
                      else setSubState('payment')
                    }}
                    className="w-full max-w-sm min-h-[52px] rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium disabled:opacity-40 active:scale-[0.97] transition-transform"
                  >
                    {selectedPackage.id === 'free' ? 'Continue' : 'Continue to payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubState('path')}
                    className="font-body text-sm text-[hsl(var(--av-parchment)/0.4)]"
                  >
                    Back
                  </button>
                </div>
              </div>
            </PortalContent>
          </motion.div>
        )}

        {subState === 'payment' && (
          <motion.div
            key="payment"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-md">
              <PaymentForm
                basePrice={selectedPackage.price}
                packageName={selectedPackage.name}
                onPaymentSuccess={(payId) => {
                  setPaymentId(payId)
                  setTimeout(() => setSubState('register'), 800)
                }}
                onCancel={() => setSubState('booking')}
              />
            </PortalContent>
          </motion.div>
        )}

        {subState === 'register' && (
          <motion.div
            key="register"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 py-12"
          >
            <PortalContent maxWidth="max-w-md">
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                    Almost there
                  </p>
                  <h2 className="font-serif text-2xl text-[hsl(var(--av-parchment))]">
                    Secure your place
                  </h2>
                  {bookingTime && (
                    <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)] pt-2">
                      {selectedPackage.name} · {formatBooking()} · {therapist.name}
                    </p>
                  )}
                </div>

                {regError && (
                  <p
                    className="font-body text-sm text-[hsl(var(--av-rose))] border border-[hsl(var(--av-rose)/0.3)] rounded-xl px-4 py-3"
                    role="alert"
                  >
                    {regError}
                  </p>
                )}

                <form onSubmit={handleRegisterClient} className="space-y-5">
                  <div>
                    <label htmlFor="reg-name" className="font-body text-xs text-[hsl(var(--av-parchment)/0.5)]">
                      Full name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full min-h-[48px] rounded-xl border border-[hsl(var(--av-parchment)/0.15)] bg-transparent px-4 font-body text-[hsl(var(--av-parchment))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="font-body text-xs text-[hsl(var(--av-parchment)/0.5)]">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      disabled
                      value={data.email || ''}
                      className="mt-1.5 w-full min-h-[48px] rounded-xl border border-[hsl(var(--av-parchment)/0.08)] bg-transparent px-4 font-body text-[hsl(var(--av-parchment)/0.4)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-pwd" className="font-body text-xs text-[hsl(var(--av-parchment)/0.5)]">
                      Password (min 8 characters)
                    </label>
                    <input
                      id="reg-pwd"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5 w-full min-h-[48px] rounded-xl border border-[hsl(var(--av-parchment)/0.15)] bg-transparent px-4 font-body text-[hsl(var(--av-parchment))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-repwd" className="font-body text-xs text-[hsl(var(--av-parchment)/0.5)]">
                      Confirm password
                    </label>
                    <input
                      id="reg-repwd"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1.5 w-full min-h-[48px] rounded-xl border border-[hsl(var(--av-parchment)/0.15)] bg-transparent px-4 font-body text-[hsl(var(--av-parchment))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                    />
                  </div>

                  <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.4)] leading-relaxed">
                    By continuing you create a private account for your practices and sessions.
                    You can cancel or reschedule up to 24 hours before.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[52px] rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium disabled:opacity-50 active:scale-[0.97] transition-transform"
                  >
                    {submitting ? 'Confirming…' : 'Confirm booking'}
                  </button>
                </form>
              </div>
            </PortalContent>
          </motion.div>
        )}

        {subState === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-20 text-center space-y-6"
            role="status"
            aria-live="polite"
          >
            <PortalContent maxWidth="max-w-md">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Confirmed
              </p>
              <h2 className="font-serif text-3xl text-[hsl(var(--av-parchment))] mt-3 text-balance">
                You made the right decision
              </h2>
              <p className="font-body text-base text-[hsl(var(--av-parchment)/0.6)] leading-relaxed mt-4">
                A confirmation email is on its way. Your practice home is ready — we will meet you
                {bookingTime ? ` on ${formatBooking()}` : ' soon'}.
              </p>
              <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.4)] mt-6">
                Opening your dashboard…
              </p>
            </PortalContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Step8Wrapper(props: StepProps<PortalData>) {
  return (
    <AudioProvider>
      <BackgroundEngine theme={getTheme('booking')} />
      <Step8Booking {...props} />
    </AudioProvider>
  )
}

export default Step8Wrapper
