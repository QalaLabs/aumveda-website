'use client'

import { useAnimate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { BreathPhase } from './breath-timeline'
import { BREATH_CONFIG, ORB_COLORS } from './constants'

interface BreathingOrbProps {
  phase: BreathPhase
  prefersReducedMotion: boolean
}

export function BreathingOrb({ phase, prefersReducedMotion }: BreathingOrbProps) {
  const [scope, animate] = useAnimate()
  const prevPhaseRef = useRef<BreathPhase>(phase)

  useEffect(() => {
    if (prefersReducedMotion || phase === 'idle' || phase === prevPhaseRef.current) {
      prevPhaseRef.current = phase
      return
    }

    const isInhaleOrHold = phase === 'inhale' || phase === 'hold'

    const stop = animate(
      scope.current,
      { scale: isInhaleOrHold ? 1.35 : 1 },
      {
        duration: isInhaleOrHold ? BREATH_CONFIG.inhaleMs / 1000 : BREATH_CONFIG.exhaleMs / 1000,
        ease: isInhaleOrHold ? [0.43, 0.13, 0.23, 0.96] : [0.43, 0.13, 0.23, 0.96],
      },
    )

    prevPhaseRef.current = phase
    return () => { stop?.stop() }
  }, [phase, animate, scope, prefersReducedMotion])

  return (
    <div ref={scope} className="relative flex items-center justify-center">
      {!prefersReducedMotion && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${ORB_COLORS.highlight} 0%, ${ORB_COLORS.core} 30%, ${ORB_COLORS.mid} 60%, ${ORB_COLORS.glow} 80%, transparent 100%)`,
              boxShadow: `0 0 80px ${ORB_COLORS.glow}, 0 0 160px ${ORB_COLORS.mid}`,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              background: `radial-gradient(circle, rgba(255,235,180,0.9) 0%, ${ORB_COLORS.highlight} 50%, transparent 100%)`,
            }}
          />
        </>
      )}
      {prefersReducedMotion && (
        <div
          className="rounded-full"
          style={{
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${ORB_COLORS.core} 0%, ${ORB_COLORS.mid} 50%, ${ORB_COLORS.glow} 100%)`,
          }}
        />
      )}
    </div>
  )
}
