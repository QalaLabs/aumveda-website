'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent, PortalCard, PortalContinueButton } from '../../design-system'
import { staggerContainer, staggerItem, fadeUpVariants } from '../../animation/variants'
import type { StepProps, PortalData } from '../../engine/types'
import { PATTERN_QUESTIONS, PROFILE_NAMES } from '@/lib/portal/constants'
import { calculateProfile } from '@/lib/portal/scoring'

export function registerStep7() {
  StepRegistry.register({
    id: 7,
    title: 'Mind & Pattern Test',
    component: Step7Wrapper,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

const QUESTION_KEYS = ['q1Answer', 'q2Answer', 'q3Answer', 'q4Answer', 'q5Answer', 'q6Answer', 'q7Answer'] as const

function Step7Pattern({ data, onNext, onDataChange, onPrevious }: StepProps<PortalData>) {
  const initialAnswers: Record<string, string> = {}
  QUESTION_KEYS.forEach((key, i) => {
    const v = (data as Record<string, string | null | undefined>)[key]
    if (v) initialAnswers[`q${i + 1}`] = v
  })

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers)
  const [qIdx, setQIdx] = useState(Math.min(Object.keys(initialAnswers).length, 6))
  const [result, setResult] = useState<ReturnType<typeof calculateProfile> | null>(null)
  // Guards against double-answering the same question: without it, a double-click (or two
  // rapid taps) fires handleAnswer twice against the same stale `qIdx` before the 300ms
  // transition re-renders, scheduling two increments and overshooting past the last question.
  const transitioningRef = useRef(false)

  const handleAnswer = useCallback(
    (answer: string) => {
      if (transitioningRef.current) return
      if (qIdx < 0 || qIdx >= PATTERN_QUESTIONS.length) return

      const qId = PATTERN_QUESTIONS[qIdx].id
      const updated = { ...answers, [qId]: answer }
      setAnswers(updated)
      onDataChange({ [QUESTION_KEYS[qIdx]]: answer } as Partial<PortalData>)

      if (qIdx < PATTERN_QUESTIONS.length - 1) {
        transitioningRef.current = true
        setTimeout(() => {
          setQIdx((i) => Math.min(i + 1, PATTERN_QUESTIONS.length - 1))
          transitioningRef.current = false
        }, 300)
      } else {
        const profile = calculateProfile(updated)
        setResult(profile)
        onDataChange({
          nervousSystemScore: profile.nervousSystem,
          relationshipScore: profile.relationship,
          childhoodScore: profile.childhood,
          financialScore: profile.financial,
          profileResult: profile.profile,
        })
      }
    },
    [answers, qIdx, onDataChange],
  )

  const handleBack = useCallback(() => {
    if (result) {
      setResult(null)
      return
    }
    if (qIdx > 0) {
      setQIdx((i) => i - 1)
    } else {
      onPrevious()
    }
  }, [result, qIdx, onPrevious])

  if (result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <PortalContent maxWidth="max-w-lg">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 text-center">
            <motion.div variants={staggerItem} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F43F5E]/20">
              <span className="text-3xl">🔮</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-display text-2xl text-[#FDA4AF]">Your Healing Profile</motion.h2>
            <motion.p variants={staggerItem} className="text-3xl font-bold text-white">{PROFILE_NAMES[result.profile] || result.profile}</motion.p>
            <motion.div variants={staggerItem}>
              <PortalCard variant="glass" padding="md" className="space-y-3 text-left">
                <div className="flex justify-between text-sm"><span className="text-white/40">Nervous System</span><span className="text-white/80">{result.nervousSystem}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/40">Relationship Pattern</span><span className="text-white/80">{result.relationship}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/40">Childhood</span><span className="text-white/80">{result.childhood}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/40">Financial</span><span className="text-white/80">{result.financial}</span></div>
              </PortalCard>
            </motion.div>
            <motion.p variants={staggerItem} className="text-sm italic text-white/40">
              The portal has read you. Now it&apos;s time to meet the person who can guide you through it.
            </motion.p>
            <motion.div variants={staggerItem}>
              <PortalContinueButton onClick={onNext} label="Book Your Discovery Call →" />
            </motion.div>
          </motion.div>
        </PortalContent>
      </div>
    )
  }

  const safeIdx = Math.min(Math.max(qIdx, 0), PATTERN_QUESTIONS.length - 1)
  const q = PATTERN_QUESTIONS[safeIdx]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <PortalContent maxWidth="max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div key={safeIdx} variants={fadeUpVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-widest text-white/40">Question {safeIdx + 1} of {PATTERN_QUESTIONS.length}</p>
            <div className="flex justify-center gap-1.5" role="progressbar" aria-valuenow={safeIdx + 1} aria-valuemin={1} aria-valuemax={PATTERN_QUESTIONS.length}>
              {PATTERN_QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all ${i <= safeIdx ? 'bg-[#F43F5E]' : 'bg-white/10'}`} />
              ))}
            </div>
            <h2 className="font-display text-xl text-white">{q.question}</h2>
            <p className="text-sm text-white/30">Choose the answer that resonates most.</p>
            <div className="space-y-3 text-left">
              {(Object.entries(q.options) as [string, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  className="group w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-[#F43F5E]/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#F43F5E]/40"
                >
                  <span className="mr-3 text-xs font-bold text-[#F43F5E]">{key}</span>
                  <span className="text-sm text-white/70 group-hover:text-white">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleBack} className="text-xs uppercase tracking-widest text-white/30 hover:text-white/60">← Back</button>
          </motion.div>
        </AnimatePresence>
      </PortalContent>
    </div>
  )
}

function Step7Wrapper(props: StepProps<PortalData>) {
  return (
    <AudioProvider>
      <BackgroundEngine theme={getTheme('pattern')}>
        <Step7Pattern {...props} />
      </BackgroundEngine>
    </AudioProvider>
  )
}

export default Step7Wrapper
