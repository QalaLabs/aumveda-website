'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import type { StepProps } from '../../engine/types'
import { AudioProvider } from '../../audio/AudioProvider'
import { SelectionProvider, useSelection } from '../../selection/SelectionProvider'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { PortalContent } from '../../design-system/PortalContent'
import { PortalContinueButton } from '../../design-system/PortalContinueButton'
import { PortalAudioToggle } from '../../design-system/PortalAudioToggle'
import { staggerContainer, staggerItem, fadeUpVariants, pageTransitionVariants } from '../../animation/variants'
import { getTheme } from '../../theme/themes'
import { ARCHETYPE_ITEMS } from './archetype-data'
import { ArchetypeCard } from './ArchetypeCard'
import { ArchetypeReveal } from './ArchetypeReveal'

export function registerStep3() {
  StepRegistry.register({
    id: 3,
    title: 'Archetype Discovery',
    component: Step3Archetype,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

function Step3Content({
  onNext,
  onDataChange,
}: {
  onNext: () => void
  onDataChange: (data: Record<string, unknown>) => void
}) {
  const router = useRouter()
  const { selectedId, phase: selectionPhase, select, lock, isSelected } = useSelection()
  const [revealPhase, setRevealPhase] = useState<'hidden' | 'revealing' | 'revealed'>('hidden')
  const [showSaveModal, setShowSaveModal] = useState(false)

  const selectedArchetype = selectedId
    ? ARCHETYPE_ITEMS.find((a) => a.id === selectedId) ?? null
    : null

  const handleSelect = useCallback(
    (id: string) => {
      select(id)
      lock(id)
    },
    [select, lock],
  )

  const handleReveal = useCallback(() => {
    setRevealPhase('revealing')
    setTimeout(() => setRevealPhase('revealed'), 1500)
  }, [])

  const handleContinue = useCallback(() => {
    if (!selectedArchetype) return
    onDataChange({
      archetypeSelected: selectedArchetype.id,
      archetypeGift: selectedArchetype.gift,
      archetypeShadow: selectedArchetype.shadow,
      archetypeElement: selectedArchetype.element,
    })
    onNext()
  }, [selectedArchetype, onDataChange, onNext])

  const handleSaveAndExit = useCallback(() => {
    if (selectedArchetype) {
      onDataChange({
        archetypeSelected: selectedArchetype.id,
        archetypeGift: selectedArchetype.gift,
        archetypeShadow: selectedArchetype.shadow,
        archetypeElement: selectedArchetype.element,
      })
    }
    setShowSaveModal(true)
  }, [selectedArchetype, onDataChange])

  const showGrid = selectionPhase === 'selecting'
  const showLocked = selectionPhase === 'locked' && revealPhase === 'hidden'
  const showReveal = revealPhase === 'revealing' || revealPhase === 'revealed'

  return (
    <BackgroundEngine theme={getTheme('archetype')}>
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-16">
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-[#F0D58C] border border-white/10 hover:border-[#C9A84C]/40 bg-white/[0.03] px-3.5 py-1.5 rounded-full transition-all"
          >
            Save &amp; Continue Later
          </button>
          <PortalAudioToggle />
        </div>

        <PortalContent maxWidth="max-w-4xl">
          <AnimatePresence mode="wait">
            {showGrid && (
              <motion.div
                key="selection-grid"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center gap-8"
              >
                <motion.div variants={staggerItem} className="flex flex-col items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1 text-xs font-mono text-[#F0D58C] tracking-wide">
                    ✦ Unlocking your archetype reveals your blind spot
                  </span>
                  <h1 className="max-w-xl text-center font-serif text-2xl leading-snug text-white md:text-3xl mt-1">
                    Six archetypes. One is you. Choose the one that feels most true &mdash; without thinking.
                  </h1>
                </motion.div>

                <motion.div
                  variants={staggerItem}
                  className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {ARCHETYPE_ITEMS.map((archetype) => (
                    <motion.div key={archetype.id} variants={staggerItem}>
                      <ArchetypeCard
                        archetype={archetype}
                        selected={isSelected(archetype.id)}
                        locked={false}
                        onClick={() => handleSelect(archetype.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={staggerItem} className="flex flex-col items-center gap-3">
                  <p className="text-center text-xs uppercase tracking-widest text-white/20">
                    Your first instinct is the right one
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveAndExit}
                    className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C9A84C] underline underline-offset-4 transition-colors"
                  >
                    Save &amp; Continue Later →
                  </button>
                </motion.div>
              </motion.div>
            )}

            {showLocked && selectedArchetype && (
              <motion.div
                key="selection-locked"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center gap-8"
              >
                <p className="text-sm uppercase tracking-widest text-white/40">
                  Your Selection
                </p>
                <div className="w-full max-w-sm">
                  <ArchetypeCard
                    archetype={selectedArchetype}
                    selected
                    locked
                    onClick={() => {}}
                    large
                  />
                </div>
                <PortalContinueButton
                  onClick={handleReveal}
                  label="Reveal My Archetype"
                />
              </motion.div>
            )}

            {showReveal && selectedArchetype && (
              <motion.div
                key="archetype-reveal"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center gap-8"
              >
                <ArchetypeReveal archetype={selectedArchetype} />
                {revealPhase === 'revealed' && (
                  <PortalContinueButton onClick={handleContinue} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </PortalContent>

        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0D0B24] p-6 text-center space-y-5 shadow-2xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A84C]/20 text-xl">
                🛡️
              </div>
              <div>
                <h3 className="text-xl font-serif text-[#F0D58C]">Progress Preserved</h3>
                <p className="text-sm text-white/60 mt-1">
                  Your archetype selection and diagnostic answers are securely buffered on this device. You can return anytime.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="w-full py-3 rounded-full bg-[#C9A84C] text-[#1A0F3C] font-semibold hover:bg-[#d4b85a] transition-colors"
                >
                  Resume Archetype Discovery
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full py-2.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </BackgroundEngine>
  )
}

export function Step3Archetype(props: StepProps) {
  const { onNext, onDataChange } = props

  return (
    <AudioProvider>
      <SelectionProvider
        items={ARCHETYPE_ITEMS}
        onConfirm={() => {}}
      >
        <Step3Content onNext={onNext} onDataChange={onDataChange} />
      </SelectionProvider>
    </AudioProvider>
  )
}

export default Step3Archetype
