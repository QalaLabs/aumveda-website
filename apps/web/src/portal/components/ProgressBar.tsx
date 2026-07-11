'use client'

import { StepRegistry } from '../engine/StepRegistry'
import type { PortalStep } from '../engine/types'
import { TOTAL_PORTAL_STEPS } from '../engine/types'

interface ProgressBarProps {
  currentStep: PortalStep
  completedSteps: number[]
  labels?: boolean
  className?: string
}

const STEP_LABELS = ['Breathe', 'Chakra', 'Archetype', 'Tarot', 'Intention', 'Constellation', 'Pattern', 'Book']

export function ProgressBar({ currentStep, completedSteps, labels = true, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-1.5 max-w-xl mx-auto">
        {Array.from({ length: TOTAL_PORTAL_STEPS }, (_, i) => {
          const stepNum = (i + 1) as PortalStep
          const isCompleted = completedSteps.includes(stepNum) || stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div
              key={stepNum}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                isCompleted || isCurrent
                  ? 'bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]'
                  : 'bg-white/10'
              }`}
            />
          )
        })}
      </div>
      {labels && (
        <div className="flex justify-between max-w-xl mx-auto mt-1 px-0.5">
          {STEP_LABELS.map((label, i) => {
            const stepNum = (i + 1) as PortalStep
            const isActive = completedSteps.includes(stepNum) || stepNum <= currentStep
            return (
              <span
                key={label}
                className={`text-[9px] uppercase tracking-widest ${
                  isActive ? 'text-[#C9A84C]' : 'text-white/20'
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
