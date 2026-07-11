'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BREATH_CONFIG } from './constants'

export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete'

export interface BreathTimelineState {
  phase: BreathPhase
  currentCycle: number
  totalCycles: number
  isComplete: boolean
  isActive: boolean
}

export interface BreathTimelineActions {
  start: () => void
  reset: () => void
}

export function useBreathTimeline(
  config?: Partial<typeof BREATH_CONFIG>,
): BreathTimelineState & BreathTimelineActions {
  const { cycles, inhaleMs, holdMs, exhaleMs, entranceDelayMs } = {
    ...BREATH_CONFIG,
    ...config,
  }

  const [phase, setPhase] = useState<BreathPhase>('idle')
  const [currentCycle, setCurrentCycle] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setPhase('inhale')
    setCurrentCycle(1)
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setPhase('idle')
    setCurrentCycle(0)
  }, [clearTimer])

  useEffect(() => {
    mountedRef.current = true
    const delay = setTimeout(() => {
      if (mountedRef.current) {
        setPhase('inhale')
        setCurrentCycle(1)
      }
    }, entranceDelayMs)

    return () => {
      mountedRef.current = false
      clearTimeout(delay)
      clearTimer()
    }
  }, [entranceDelayMs, clearTimer])

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    const duration =
      phase === 'inhale' ? inhaleMs : phase === 'hold' ? holdMs : exhaleMs

    const nextPhase: BreathPhase =
      phase === 'inhale' ? 'hold'
      : phase === 'hold' ? 'exhale'
      : currentCycle >= cycles ? 'complete'
      : 'inhale'

    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      setPhase(nextPhase)
      if (nextPhase === 'inhale') {
        setCurrentCycle(c => c + 1)
      }
    }, duration)

    return clearTimer
  }, [phase, currentCycle, cycles, inhaleMs, holdMs, exhaleMs, clearTimer])

  return {
    phase,
    currentCycle,
    totalCycles: cycles,
    isComplete: phase === 'complete',
    isActive: phase !== 'idle' && phase !== 'complete',
    start,
    reset,
  }
}
