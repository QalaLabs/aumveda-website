'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import type { StepProps } from '../../engine/types'
import { useBreathTimeline } from './breath-timeline'
import { BreathingOrb } from './BreathingOrb'
import { BreathingText } from './BreathingText'
import { AmbientAudio } from './AmbientAudio'
import { STAR_COUNT, COMPLETION_TEXT, CTA_TEXT } from './constants'
import { STEP1_ENTER, STEP1_EXIT } from './animations'

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
}

function useStars(count: number): Star[] {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 3,
    })),
  )
  return stars
}

export function registerStep1() {
  StepRegistry.register({
    id: 1,
    title: 'Breath',
    component: Step1Breath,
    validationSchema: undefined,
    enterAnimation: STEP1_ENTER,
    exitAnimation: STEP1_EXIT,
  })
}

export function Step1Breath(_props: StepProps) {
  const { onNext } = _props
  const { phase, currentCycle, totalCycles, isComplete } = useBreathTimeline()
  const prefersReducedMotion = useReducedMotion()
  const stars = useStars(STAR_COUNT)
  const [orbVisible, setOrbVisible] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOrbVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => setShowCompletion(true), 300)
      return () => clearTimeout(t)
    }
  }, [isComplete])

  const handleCTA = useCallback(() => {
    if (isComplete) {
      onNext()
    }
  }, [isComplete, onNext])

  return (
    <div className="fixed inset-0 bg-[#0B0720] flex flex-col items-center justify-center overflow-hidden select-none">
      <AmbientAudio />

      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.opacity, 0.1 * star.opacity],
          }}
          transition={{
            delay: star.delay,
            duration: 2.5,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 2,
          }}
        />
      ))}

      {!showCompletion && (
        <div className="flex flex-col items-center gap-8 z-10">
          {orbVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <BreathingOrb phase={phase} prefersReducedMotion={prefersReducedMotion} />
            </motion.div>
          )}

          <BreathingText
            phase={phase}
            currentCycle={currentCycle}
            totalCycles={totalCycles}
          />
        </div>
      )}

      {showCompletion && (
        <motion.div
          className="flex flex-col items-center gap-8 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="text-2xl md:text-3xl font-serif text-[#C9A84C] tracking-wide text-center">
            {COMPLETION_TEXT}
          </p>

          <motion.button
            type="button"
            onClick={handleCTA}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="relative px-10 py-4 rounded-full text-lg font-semibold bg-[#C9A84C] text-[#1A0F3C] hover:bg-[#d4b85a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0720] active:scale-[0.98]"
          >
            {CTA_TEXT}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Step1Breath
