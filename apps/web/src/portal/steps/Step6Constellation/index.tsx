'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent, PortalCard, PortalContinueButton } from '../../design-system'
import { staggerContainer, staggerItem } from '../../animation/variants'
import type { StepProps, PortalData } from '../../engine/types'
import { usePlacesAutocomplete, resolveCityCoordinates } from './usePlacesAutocomplete'

export function registerStep6() {
  StepRegistry.register({
    id: 6,
    title: 'Constellation Mirror',
    component: Step6Wrapper,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

type Phase = 'form' | 'loading' | 'error' | 'email_gate' | 'otp_modal' | 'revealing' | 'revealed'

interface ChartPlanet {
  name: string
  sign: string
  signDegree: number
  nakshatra: string
  pada: number
  house: number
}

interface DashaPeriod {
  mahadasha: string
  antardasha: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

function Step6Constellation({ data, onNext, onDataChange }: StepProps<PortalData>) {
  const [dob, setDob] = useState(data.dob ?? '')
  const [tob, setTob] = useState(data.timeOfBirth ?? '')
  const [tobUnknown, setTobUnknown] = useState(!data.timeOfBirth)
  const [place, setPlace] = useState(data.placeOfBirth ?? '')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    data.birthLat && data.birthLng ? { lat: data.birthLat, lng: data.birthLng } : null,
  )
  const [email, setEmail] = useState(data.email ?? '')
  const [phase, setPhase] = useState<Phase>(data.sunSign ? 'email_gate' : 'form')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [chartPlanets, setChartPlanets] = useState<ChartPlanet[]>([])
  const [dashaTimeline, setDashaTimeline] = useState<DashaPeriod[]>([])
  const [nakshatraInfo, setNakshatraInfo] = useState<{ nakshatra: string; lord: string; pada: number } | null>(null)

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [otpSubmitting, setOtpSubmitting] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const placeInputRef = useRef<HTMLInputElement>(null)

  const { available: placesAvailable } = usePlacesAutocomplete(placeInputRef, (result) => {
    setPlace(result.description)
    setCoords({ lat: result.lat, lng: result.lng })
  })

  const canSubmit = Boolean(dob && place && (tobUnknown || tob))

  const isLocked = otpAttempts >= 3

  useEffect(() => {
    if (phase !== 'otp_modal' || resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, resendTimer])

  const requestChart = useCallback(async () => {
    setPhase('loading')
    setErrorMsg(null)

    const resolvedCoords = coords ?? resolveCityCoordinates(place)

    try {
      const res = await fetch('/api/astrology/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dob,
          timeOfBirth: tobUnknown ? null : tob,
          lat: resolvedCoords.lat,
          lng: resolvedCoords.lng,
        }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'Chart calculation failed')

      if (json.data.planets) setChartPlanets(json.data.planets)
      if (json.data.dashaTimeline) setDashaTimeline(json.data.dashaTimeline)
      if (json.data.nakshatra) {
        setNakshatraInfo({
          nakshatra: json.data.nakshatra,
          lord: json.data.nakshatraLord ?? '',
          pada: json.data.nakshatraPada ?? 1,
        })
      }

      onDataChange({
        dob,
        timeOfBirth: tobUnknown ? null : tob,
        placeOfBirth: place,
        birthLat: resolvedCoords.lat,
        birthLng: resolvedCoords.lng,
        sunSign: json.data.sunSign,
        moonSign: json.data.moonSign,
        risingSign: json.data.risingSign,
      })
      setPhase('email_gate')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('error')
    }
  }, [dob, tob, tobUnknown, place, coords, onDataChange])

  const handleEmailSubmit = useCallback(() => {
    if (!email || !email.includes('@')) return
    onDataChange({ email })
    setPhase('revealing')
    setTimeout(() => setPhase('revealed'), 1200)
  }, [email, onDataChange])

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (isLocked) return
      const cleanVal = value.replace(/\D/g, '')
      if (!cleanVal) {
        setOtpDigits((prev) => {
          const next = [...prev]
          next[index] = ''
          return next
        })
        return
      }

      if (cleanVal.length > 1) {
        const chars = cleanVal.slice(0, 6).split('')
        setOtpDigits((prev) => {
          const next = [...prev]
          chars.forEach((c, i) => {
            if (index + i < 6) next[index + i] = c
          })
          return next
        })
        const nextFocus = Math.min(index + chars.length, 5)
        otpInputRefs.current[nextFocus]?.focus()
        return
      }

      setOtpDigits((prev) => {
        const next = [...prev]
        next[index] = cleanVal
        return next
      })

      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus()
      }
    },
    [isLocked],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus()
      }
    },
    [otpDigits],
  )

  const handleSendOtp = useCallback(async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address')
      return
    }
    setOtpSending(true)
    setOtpError(null)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to send verification code')

      setOtpDigits(['', '', '', '', '', ''])
      setOtpAttempts(0)
      setResendTimer(60)
      setPhase('otp_modal')
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send verification email')
    } finally {
      setOtpSending(false)
    }
  }, [email])

  const handleVerifyOtp = useCallback(async () => {
    if (isLocked) return
    const code = otpDigits.join('')
    if (code.length !== 6) {
      setOtpError('Please enter the full 6-digit code')
      return
    }

    setOtpSubmitting(true)
    setOtpError(null)

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otpCode: code,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        const nextAttempts = otpAttempts + 1
        setOtpAttempts(nextAttempts)
        if (nextAttempts >= 3) {
          throw new Error('Maximum attempts reached (3/3). This code has been locked. Please request a new code.')
        } else {
          throw new Error(`${json.error || 'Invalid code'} (${3 - nextAttempts} attempts remaining)`)
        }
      }

      onDataChange({ email: email.trim().toLowerCase() })
      setPhase('revealing')
      setTimeout(() => setPhase('revealed'), 1200)
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed')
    } finally {
      setOtpSubmitting(false)
    }
  }, [email, otpDigits, otpAttempts, isLocked, onDataChange])

  const currentDasha = dashaTimeline.find((d) => d.isCurrent) ?? dashaTimeline[0]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <PortalContent maxWidth="max-w-2xl">
        <AnimatePresence mode="wait">
          {(phase === 'form' || phase === 'loading' || phase === 'error') && (
            <motion.div
              key="form"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 text-center"
            >
              <motion.p
                variants={staggerItem}
                className="text-xs text-white/40 uppercase tracking-[0.3em] font-mono"
              >
                Step 6 of 8
              </motion.p>
              <motion.h1 variants={staggerItem} className="text-2xl md:text-3xl font-display text-white">
                Your birth chart holds your karmic blueprint.
              </motion.h1>
              <motion.p variants={staggerItem} className="text-sm text-white/40 max-w-md mx-auto">
                Planetary placements, Moon sign, and Dasha timeline reveal your energetic constitution.
              </motion.p>

              <PortalCard variant="glass" padding="lg">
                <motion.div variants={staggerContainer} className="space-y-4 text-left">
                  <motion.div variants={staggerItem}>
                    <label
                      className="text-xs uppercase tracking-widest text-white/40"
                      htmlFor="dob-input"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob-input"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white focus:border-[#C9A84C]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label
                      className="text-xs uppercase tracking-widest text-white/40"
                      htmlFor="place-input"
                    >
                      Place of Birth{' '}
                      {placesAvailable ? (
                        <span className="text-[#C9A84C]/60 normal-case">(Google Places live)</span>
                      ) : (
                        <span className="text-white/20 normal-case">(auto-coordinates)</span>
                      )}
                    </label>
                    <input
                      ref={placeInputRef}
                      id="place-input"
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="e.g. Mumbai, India or London, UK"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white placeholder:text-white/20 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem} className="flex items-start gap-3">
                    <div className="flex-1">
                      <label
                        className="text-xs uppercase tracking-widest text-white/40"
                        htmlFor="tob-input"
                      >
                        Time of Birth
                      </label>
                      <input
                        id="tob-input"
                        type="time"
                        value={tob}
                        onChange={(e) => setTob(e.target.value)}
                        disabled={tobUnknown}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white focus:border-[#C9A84C]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 disabled:opacity-30"
                      />
                    </div>
                    <label className="mt-6 flex cursor-pointer items-center gap-2 text-xs text-white/40">
                      <input
                        type="checkbox"
                        checked={tobUnknown}
                        onChange={(e) => setTobUnknown(e.target.checked)}
                        className="accent-[#C9A84C]"
                      />
                      I don&apos;t know exact time
                    </label>
                  </motion.div>
                </motion.div>
              </PortalCard>

              {phase === 'error' && (
                <motion.div
                  role="alert"
                  className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                >
                  {errorMsg}
                </motion.div>
              )}

              <motion.div variants={staggerItem} className="flex flex-col items-center gap-3 pt-2">
                <PortalContinueButton
                  onClick={requestChart}
                  disabled={!canSubmit || phase === 'loading'}
                  label={
                    phase === 'loading'
                      ? 'Computing Ephemeris & Dasha...'
                      : phase === 'error'
                        ? 'Retry Calculation'
                        : 'Calculate Birth Chart'
                  }
                />
                <button
                  type="button"
                  onClick={onNext}
                  className="mt-1 text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] underline underline-offset-4 transition-colors"
                >
                  Skip this step &amp; continue →
                </button>
              </motion.div>
            </motion.div>
          )}

          {phase === 'email_gate' && (
            <motion.div
              key="email-gate"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 text-center"
            >
              <motion.div
                variants={staggerItem}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/20 text-2xl"
              >
                ✨
              </motion.div>
              <motion.h2 variants={staggerItem} className="text-2xl font-display text-[#F0D58C]">
                Your Vedic Chart &amp; Dasha Timeline Are Ready
              </motion.h2>
              <motion.p variants={staggerItem} className="text-sm text-white/50 max-w-sm mx-auto">
                Enter your email to receive a secure 6-digit verification code and unlock your planetary placements.
              </motion.p>
              <PortalCard variant="glass" padding="lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-white placeholder:text-white/20 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                />
              </PortalCard>

              {otpError && (
                <motion.div
                  role="alert"
                  className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                >
                  {otpError}
                </motion.div>
              )}

              <div className="flex flex-col items-center gap-3">
                <PortalContinueButton
                  onClick={handleSendOtp}
                  disabled={!email.includes('@') || otpSending}
                  label={otpSending ? 'Sending Verification Code...' : 'Send Verification Code'}
                />
                <button
                  type="button"
                  onClick={onNext}
                  className="mt-1 text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] underline underline-offset-4 transition-colors"
                >
                  Skip for now →
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'otp_modal' && (
            <motion.div
              key="otp-modal"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 text-center"
            >
              <motion.div
                variants={staggerItem}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/20 text-2xl"
              >
                🔐
              </motion.div>
              <motion.h2 variants={staggerItem} className="text-2xl font-display text-[#F0D58C]">
                Verify Your Email
              </motion.h2>
              <motion.div variants={staggerItem} className="text-sm text-white/60 max-w-sm mx-auto space-y-1">
                <p>We sent a 6-digit verification code to</p>
                <div className="flex items-center justify-center gap-2 font-mono text-[#F0D58C]">
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => setPhase('email_gate')}
                    className="text-xs text-white/40 underline hover:text-white transition-colors"
                  >
                    (change)
                  </button>
                </div>
              </motion.div>

              <PortalCard variant="glass" padding="lg">
                <div className="space-y-4">
                  {/* 6-Digit OTP Box Grid */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={isLocked || otpSubmitting}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border text-center text-xl font-mono font-bold transition-all focus:outline-none ${
                          digit
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#F0D58C]'
                            : 'border-white/15 bg-white/[0.03] text-white focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/20'
                        } ${isLocked ? 'opacity-40 cursor-not-allowed border-red-500/30' : ''}`}
                      />
                    ))}
                  </div>

                  {/* Resend & Lock Status */}
                  <div className="flex flex-col items-center gap-1 text-xs font-mono pt-2">
                    {isLocked ? (
                      <p className="text-red-400 font-sans">
                        Maximum attempts reached (3/3). Please request a new code to unlock.
                      </p>
                    ) : (
                      <p className="text-white/40">
                        {3 - otpAttempts} {3 - otpAttempts === 1 ? 'attempt' : 'attempts'} remaining
                      </p>
                    )}

                    <div className="mt-1">
                      {resendTimer > 0 ? (
                        <span className="text-white/40">Resend code in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSending}
                          className="text-[#C9A84C] hover:underline font-medium"
                        >
                          {otpSending ? 'Resending...' : 'Resend Code'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </PortalCard>

              {otpError && (
                <motion.div
                  role="alert"
                  className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                >
                  {otpError}
                </motion.div>
              )}

              <div className="flex flex-col items-center gap-3">
                <PortalContinueButton
                  onClick={handleVerifyOtp}
                  disabled={otpDigits.join('').length !== 6 || isLocked || otpSubmitting}
                  label={otpSubmitting ? 'Verifying Code...' : 'Unlock My Birth Sky'}
                />
                <button
                  type="button"
                  onClick={onNext}
                  className="mt-1 text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] underline underline-offset-4 transition-colors"
                >
                  Skip for now →
                </button>
              </div>
            </motion.div>
          )}

          {(phase === 'revealing' || phase === 'revealed') && (
            <motion.div
              key="reveal"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 text-center"
            >
              <div className="relative mb-2 h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#050510] via-[#0D0B24] to-[#050510] border border-white/10 p-6 flex flex-col justify-center items-center">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(1px 1px at 25px 35px, #C9A84C, transparent), radial-gradient(1px 1px at 80px 60px, white, transparent), radial-gradient(1.5px 1.5px at 150px 40px, #F0D58C, transparent), radial-gradient(1px 1px at 220px 90px, white, transparent)',
                  }}
                />
                <p className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-mono mb-1">
                  Vedic Ephemeris Mirror
                </p>
                <p className="text-xl font-serif text-white">Your Cosmic Architecture</p>
                <p className="text-xs italic text-white/40 mt-1">
                  Computed at {place || 'Birth Coordinates'}
                </p>
              </div>

              {phase === 'revealed' && (
                <>
                  {/* Primary Triad */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                    <PortalCard variant="glass" padding="sm" className="border-amber-500/30">
                      <p className="text-xs font-mono uppercase tracking-wider text-amber-400">☀ Sun (Surya)</p>
                      <p className="text-lg font-bold text-white mt-1">{data.sunSign}</p>
                      <p className="text-[11px] text-white/40">Core vital life force</p>
                    </PortalCard>

                    <PortalCard variant="glass" padding="sm" className="border-sky-400/30">
                      <p className="text-xs font-mono uppercase tracking-wider text-sky-300">☽ Moon (Chandra)</p>
                      <p className="text-lg font-bold text-white mt-1">{data.moonSign}</p>
                      <p className="text-[11px] text-white/40">
                        {nakshatraInfo ? `${nakshatraInfo.nakshatra} (Pada ${nakshatraInfo.pada})` : 'Emotional nervous system'}
                      </p>
                    </PortalCard>

                    <PortalCard variant="glass" padding="sm" className="border-purple-400/30">
                      <p className="text-xs font-mono uppercase tracking-wider text-purple-300">↑ Ascendant (Lagna)</p>
                      <p className="text-lg font-bold text-white mt-1">{data.risingSign || 'Determined in 1:1'}</p>
                      <p className="text-[11px] text-white/40">Physical body &amp; somatic path</p>
                    </PortalCard>
                  </div>

                  {/* Active Dasha Highlight */}
                  {currentDasha && (
                    <PortalCard variant="glass" padding="md" className="text-left border-[#C9A84C]/30 bg-[#C9A84C]/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wider text-[#C9A84C]">
                            Active Vimshottari Dasha
                          </p>
                          <p className="text-base font-serif font-bold text-white mt-0.5">
                            {currentDasha.mahadasha} Mahadasha — {currentDasha.antardasha} Antardasha
                          </p>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#C9A84C]/20 text-[#F0D58C]">
                          Current Cycle
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        Window: {currentDasha.startDate} to {currentDasha.endDate}
                      </p>
                    </PortalCard>
                  )}

                  {/* Planetary Placements Summary */}
                  {chartPlanets.length > 0 && (
                    <div className="space-y-2 text-left">
                      <p className="text-xs font-mono uppercase tracking-wider text-white/40">
                        Planetary Placements (Grahas)
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-xs">
                        {chartPlanets.slice(0, 6).map((p) => (
                          <div key={p.name} className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
                            <span className="font-semibold text-white/90">{p.name}</span> in{' '}
                            <span className="text-[#F0D58C]">{p.sign}</span>
                            <div className="text-[10px] text-white/40">House {p.house} · {p.nakshatra}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <PortalContinueButton onClick={onNext} label="Proceed to Mind &amp; Pattern Test →" />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PortalContent>
    </div>
  )
}

function Step6Wrapper(props: StepProps<PortalData>) {
  return (
    <AudioProvider>
      <BackgroundEngine theme={getTheme('constellation')}>
        <Step6Constellation {...props} />
      </BackgroundEngine>
    </AudioProvider>
  )
}

export default Step6Wrapper
