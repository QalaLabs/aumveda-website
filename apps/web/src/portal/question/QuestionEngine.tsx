'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, slideRightVariants } from '../animation/variants'
import { PortalCard } from '../design-system/PortalCard'
import { PortalSelectionCard } from '../design-system/PortalSelectionCard'
import { PortalProgressDots } from '../design-system/PortalProgressDots'
import { PortalContinueButton } from '../design-system/PortalContinueButton'
import { useQuestion } from './QuestionProvider'

interface QuestionEngineProps {
  renderOption?: (option: any, selected: boolean) => ReactNode
  accentColor?: string
  continueLabel?: string
  onNext?: () => void
}

export function QuestionEngine({
  renderOption,
  accentColor = '#C9A84C',
  continueLabel = 'Continue',
  onNext,
}: QuestionEngineProps) {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    phase,
    results,
    selectAnswer,
    next,
    canProceed,
  } = useQuestion()

  if (!currentQuestion) return null

  const currentResult = results[currentQuestion.id]

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <PortalProgressDots
        total={totalQuestions}
        current={currentIndex}
        accentColor={accentColor}
      />

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          variants={slideRightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex w-full flex-col items-center gap-8"
        >
          <PortalCard variant="glass" padding="lg">
            <div className="flex flex-col items-center gap-2 text-center">
              {currentQuestion.category && (
                <span className="text-xs uppercase tracking-widest text-white/30">{currentQuestion.category}</span>
              )}
              <h2 className="font-serif text-2xl font-bold leading-tight text-white">
                {currentQuestion.text}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-sm text-white/50">{currentQuestion.subtitle}</p>
              )}
            </div>
          </PortalCard>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex w-full flex-col gap-3"
          >
            {currentQuestion.options.map((option) => {
              const selected = currentResult?.optionId === option.id
              return (
                <motion.div key={option.id} variants={staggerItem}>
                  <PortalSelectionCard
                    selected={selected}
                    locked={phase === 'locked'}
                    onClick={() => selectAnswer(option.id)}
                    accentColor={accentColor}
                  >
                    {renderOption ? renderOption(option, selected) : (
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            selected ? 'text-[#0B0720]' : 'text-white/30'
                          }`}
                          style={{ background: selected ? accentColor : 'rgba(255,255,255,0.05)' }}
                        >
                          {option.id}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-medium text-white">{option.label}</span>
                          {option.description && (
                            <span className="text-sm text-white/40">{option.description}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </PortalSelectionCard>
                </motion.div>
              )
            })}
          </motion.div>

          {canProceed && (
            <PortalContinueButton
              onClick={() => { next(); onNext?.() }}
              label={continueLabel}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
