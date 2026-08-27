'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent, PortalCard, PortalContinueButton } from '../../design-system'
import { staggerContainer, staggerItem } from '../../animation/variants'
import type { StepProps } from '../../engine/types'
import type { PortalData } from '../../engine/types'
import { usePlacesAutocomplete } from './usePlacesAutocomplete'

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

type Phase = 'form' | 'loading' | 'error' | 'email_gate' | 'revealing' | 'revealed'

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
  const placeInputRef = useRef<HTMLInputElement>(null)

  const { available: placesAvailable } = usePlacesAutocomplete(placeInputRef, (result) => {
    setPlace(result.description)
    setCoords({ lat: result.lat, lng: result.lng })
  })

  const canSubmit = Boolean(dob && place && (tobUnknown || tob))

  const requestChart = useCallback(async () => {
    setPhase('loading')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/astrology/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dob,
          timeOfBirth: tobUnknown ? null : tob,
          lat: coords?.lat ?? 0,
          lng: coords?.lng ?? 0,
        }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'Chart calculation failed')

      onDataChange({
        dob,
        timeOfBirth: tobUnknown ? null : tob,
        placeOfBirth: place,
        birthLat: coords?.lat ?? null,
        birthLng: coords?.lng ?? null,
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <PortalContent maxWidth="max-w-xl">
        <AnimatePresence mode="wait">
          {(phase === 'form' || phase === 'loading' || phase === 'error') && (
            <motion.div key="form" variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
              <motion.p variants={staggerItem} className="text-xs text-white/40 uppercase tracking-[0.3em] font-mono">Step 6 of 8</motion.p>
              <motion.h1 variants={staggerItem} className="text-2xl font-display text-white">
                Your birth chart already knows everything about you.
              </motion.h1>
              <motion.p variants={staggerItem} className="text-sm text-white/40">
                Every pattern. Every wound. Every piece of unlived potential.
              </motion.p>

              <PortalCard variant="glass" padding="lg">
                <motion.div variants={staggerContainer} className="space-y-4 text-left">
                  <motion.div variants={staggerItem}>
                    <label className="text-xs uppercase tracking-widest text-white/40" htmlFor="dob-input">Date of Birth</label>
                    <input id="dob-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20" />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label className="text-xs uppercase tracking-widest text-white/40" htmlFor="place-input">
                      Place of Birth {placesAvailable && <span className="text-white/20 normal-case">(autocomplete on)</span>}
                    </label>
                    <input ref={placeInputRef} id="place-input" type="text" value={place} onChange={(e) => setPlace(e.target.value)}
                      placeholder="City, Country"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white placeholder:text-white/20 focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20" />
                  </motion.div>

                  <motion.div variants={staggerItem} className="flex items-start gap-3">
                    <div className="flex-1">
                      <label className="text-xs uppercase tracking-widest text-white/40" htmlFor="tob-input">Time of Birth</label>
                      <input id="tob-input" type="time" value={tob} onChange={(e) => setTob(e.target.value)} disabled={tobUnknown}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20 disabled:opacity-30" />
                    </div>
                    <label className="mt-6 flex cursor-pointer items-center gap-2 text-xs text-white/40">
                      <input type="checkbox" checked={tobUnknown} onChange={(e) => setTobUnknown(e.target.checked)} className="accent-teal-400" />
                      I don&apos;t know
                    </label>
                  </motion.div>
                </motion.div>
              </PortalCard>

              {phase === 'error' && (
                <motion.div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                  {errorMsg}
                </motion.div>
              )}

              <motion.div variants={staggerItem} className="flex flex-col items-center gap-3 pt-2">
                <PortalContinueButton
                  onClick={requestChart}
                  disabled={!canSubmit || phase === 'loading'}
                  label={phase === 'loading' ? 'Calculating...' : phase === 'error' ? 'Retry' : 'Reveal My Birth Chart'}
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
            <motion.div key="email-gate" variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
              <motion.h2 variants={staggerItem} className="text-2xl font-display text-teal-300">Your constellation is ready</motion.h2>
              <motion.p variants={staggerItem} className="text-sm text-white/50">Enter your email to reveal it.</motion.p>
              <PortalCard variant="glass" padding="lg">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-white placeholder:text-white/20 focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-400/20" />
              </PortalCard>
              <div className="flex flex-col items-center gap-3">
                <PortalContinueButton onClick={handleEmailSubmit} disabled={!email.includes('@')} label="Reveal My Chart" />
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
            <motion.div key="reveal" variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#050510] via-[#0A0A20] to-[#050510]">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 80px 40px, white, transparent), radial-gradient(1px 120px 80px, white, transparent)' }} />
                <p className="relative flex h-full items-center justify-center text-sm text-white/30">✦ Your birth sky ✦</p>
              </div>
              <p className="text-sm italic text-white/40">This was your sky — the moment you took your first breath.</p>
              {phase === 'revealed' && (
                <>
                  <div className="space-y-3 text-left">
                    <PortalCard variant="glass" padding="sm"><span className="font-semibold text-[#C9A84C]">☀ Sun — {data.sunSign}</span> <span className="text-white/50">Your core self</span></PortalCard>
                    <PortalCard variant="glass" padding="sm"><span className="font-semibold text-white/80">☽ Moon — {data.moonSign}</span> <span className="text-white/50">Your emotional world</span></PortalCard>
                    {data.risingSign && <PortalCard variant="glass" padding="sm"><span className="font-semibold text-purple-300">↑ Rising — {data.risingSign}</span> <span className="text-white/50">Your mask to the world</span></PortalCard>}
                  </div>
                  <PortalContinueButton onClick={onNext} label="Continue →" />
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
