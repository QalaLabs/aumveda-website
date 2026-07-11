'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent, PortalCard, PortalButton } from '../../design-system'
import { staggerContainer, staggerItem } from '../../animation/variants'
import { usePortal } from '../../engine/PortalContext'
import type { StepProps, PortalData } from '../../engine/types'
import { PROFILE_NAMES } from '@/lib/portal/constants'

export function registerStep8() {
  StepRegistry.register({
    id: 8,
    title: 'Book Discovery Call',
    component: Step8Wrapper,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

async function notifyN8n(state: ReturnType<typeof usePortal>['state'], bookingEvent: string | null) {
  try {
    await fetch('/api/n8n/portal-completed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        email: state.portalData.email,
        chakraSelected: state.portalData.chakraSelected,
        archetypeSelected: state.portalData.archetypeSelected,
        tarotCard: state.portalData.tarotCard,
        tarotTheme: state.portalData.tarotTheme,
        intention: state.portalData.intention,
        dob: state.portalData.dob,
        timeOfBirth: state.portalData.timeOfBirth,
        placeOfBirth: state.portalData.placeOfBirth,
        sunSign: state.portalData.sunSign,
        moonSign: state.portalData.moonSign,
        risingSign: state.portalData.risingSign,
        profileResult: state.portalData.profileResult,
        nervousSystemScore: state.portalData.nervousSystemScore,
        relationshipScore: state.portalData.relationshipScore,
        childhoodScore: state.portalData.childhoodScore,
        financialScore: state.portalData.financialScore,
        bookingScheduledEvent: bookingEvent,
      }),
    })
  } catch (err) {
    // Never block the completed-portal experience on a notification failure.
    console.error('[Step8Booking] n8n dispatch failed:', err)
  }
}

function Step8Booking({ data }: StepProps<PortalData>) {
  const { state, completePortal } = usePortal()
  const [booked, setBooked] = useState(Boolean(data.portalCompletedAt))
  const [dispatching, setDispatching] = useState(false)
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL

  const finish = useCallback(
    async (bookingEvent: string | null) => {
      if (dispatching) return
      setDispatching(true)
      await completePortal()
      await notifyN8n(state, bookingEvent)
      setBooked(true)
      setDispatching(false)
    },
    [completePortal, state, dispatching],
  )

  // Calendly posts window messages when the embedded widget schedules an event.
  useEffect(() => {
    if (!calendlyUrl || booked) return
    function handleMessage(e: MessageEvent) {
      if (typeof e.data !== 'object' || !e.data?.event) return
      if (e.data.event === 'calendly.event_scheduled') {
        finish(e.data.event)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [calendlyUrl, booked, finish])

  if (booked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <PortalContent maxWidth="max-w-lg">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 text-center">
            <motion.div variants={staggerItem} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A84C]/20">
              <span className="text-3xl">✨</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-display text-2xl text-[#C9A84C]">Your portal is complete</motion.h2>
            <motion.p variants={staggerItem} className="text-white/60">Sejal will reach out to you shortly to confirm your Discovery Call.</motion.p>
            <motion.p variants={staggerItem} className="text-sm text-white/30">Keep an eye on your email and WhatsApp for the calendar invite.</motion.p>
            <motion.div variants={staggerItem}>
              <PortalCard variant="glass" padding="md" className="space-y-2 text-left text-sm">
                <p className="text-xs uppercase tracking-widest text-[#C9A84C]">Your Portal Summary</p>
                <p className="text-white/60">Profile: <span className="text-white">{PROFILE_NAMES[data.profileResult || ''] || data.profileResult}</span></p>
                <p className="text-white/60">Chakra: <span className="text-white">{data.chakraSelected}</span></p>
                <p className="text-white/60">Archetype: <span className="text-white">{data.archetypeSelected}</span></p>
                {data.sunSign && <p className="text-white/60">Sun Sign: <span className="text-white">{data.sunSign}</span></p>}
                {data.intention && <p className="text-white/60">Intention: <span className="italic text-white">&ldquo;{data.intention}&rdquo;</span></p>}
              </PortalCard>
            </motion.div>
            <motion.p variants={staggerItem} className="text-sm text-white/40">AUMVEDA &mdash; Decode. Dissolve. Return.</motion.p>
          </motion.div>
        </PortalContent>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <PortalContent maxWidth="max-w-lg">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 text-center">
          <motion.div variants={staggerItem} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A84C]/20">
            <span className="text-3xl">🕊️</span>
          </motion.div>
          <motion.h2 variants={staggerItem} className="font-display text-2xl text-[#C9A84C]">You&apos;ve completed the portal</motion.h2>
          <motion.p variants={staggerItem} className="text-white/70">Your healing profile has been read.</motion.p>
          <motion.p variants={staggerItem} className="text-sm text-white/40">
            Now take the next step — book a free Discovery Call with Sejal. She&apos;ll walk through your results and guide you to the right path.
          </motion.p>

          <motion.div variants={staggerItem}>
            <PortalCard variant="glass" padding="md" className="space-y-2 text-left text-sm">
              <p className="mb-1 font-semibold text-[#C9A84C]">On your Discovery Call, Sejal will:</p>
              <ul className="space-y-1.5 text-white/60">
                <li>✦ Review your portal results with you</li>
                <li>✦ Identify the primary area of healing</li>
                <li>✦ Recommend the right session or package</li>
                <li>✦ Answer any questions you have</li>
              </ul>
            </PortalCard>
          </motion.div>

          {calendlyUrl ? (
            <motion.div variants={staggerItem}>
              <iframe
                src={`${calendlyUrl}?embed_domain=aumveda.com&embed_type=Inline&hide_gdpr_banner=1&email=${encodeURIComponent(data.email ?? '')}`}
                title="Book your Discovery Call"
                className="h-[640px] w-full rounded-2xl border border-white/10"
              />
              <p className="mt-3 text-xs text-white/20">30 min · Free · Zoom</p>
            </motion.div>
          ) : (
            <motion.div variants={staggerItem} className="space-y-3">
              <PortalButton onClick={() => finish(null)} disabled={dispatching} size="lg">
                {dispatching ? 'Booking...' : 'Book My Free Discovery Call'}
              </PortalButton>
              <p className="text-xs text-white/20">30 min · Free · Zoom</p>
            </motion.div>
          )}
        </motion.div>
      </PortalContent>
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
