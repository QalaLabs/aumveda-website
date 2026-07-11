'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { BreathPhase } from './breath-timeline'
import { PHASE_LABELS, PHASE_INSTRUCTIONS } from './constants'

interface BreathingTextProps {
  phase: BreathPhase
  currentCycle: number
  totalCycles: number
}

function ScreenReaderAnnouncement({ phase }: { phase: BreathPhase }) {
  if (phase === 'idle' || phase === 'complete') return null
  return (
    <div aria-live="polite" className="sr-only">
      {PHASE_LABELS[phase]}. {PHASE_INSTRUCTIONS[phase]}
    </div>
  )
}

function CycleIndicator({ currentCycle, totalCycles }: { currentCycle: number; totalCycles: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalCycles }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
            i < currentCycle ? 'bg-[#C9A84C] shadow-[0_0_4px_#C9A84C]' : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

export function BreathingText({ phase, currentCycle, totalCycles }: BreathingTextProps) {
  if (phase === 'idle') return null

  return (
    <div className="text-center">
      <ScreenReaderAnnouncement phase={phase} />
      <AnimatePresence mode="wait">
        {phase !== 'complete' && (
          <motion.div
            key={phase + currentCycle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            className="mb-2"
          >
            <p className="text-white/60 text-sm font-mono uppercase tracking-[0.2em]">
              {PHASE_LABELS[phase]}
            </p>
            <p className="text-white/40 text-xs mt-1 tracking-wide">
              {PHASE_INSTRUCTIONS[phase]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6">
        <CycleIndicator currentCycle={currentCycle} totalCycles={totalCycles} />
      </div>
    </div>
  )
}
