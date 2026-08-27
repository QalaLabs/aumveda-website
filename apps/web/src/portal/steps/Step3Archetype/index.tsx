'use client'

import { useState, useCallback } from 'react'
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
  const { selectedId, phase: selectionPhase, select, lock, isSelected } = useSelection()
  const [revealPhase, setRevealPhase] = useState<'hidden' | 'revealing' | 'revealed'>('hidden')

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

  const showGrid = selectionPhase === 'selecting'
  const showLocked = selectionPhase === 'locked' && revealPhase === 'hidden'
  const showReveal = revealPhase === 'revealing' || revealPhase === 'revealed'

  return (
    <BackgroundEngine theme={getTheme('archetype')}>
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-16">
        <div className="fixed right-6 top-6 z-50">
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
                className="flex flex-col items-center gap-10"
              >
                <motion.h1
                  variants={staggerItem}
                  className="max-w-xl text-center font-serif text-2xl leading-snug text-white md:text-3xl"
                >
                  Six archetypes. One is you. Choose the one that feels most true &mdash; without thinking.
                </motion.h1>

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

                <motion.p
                  variants={staggerItem}
                  className="text-center text-xs uppercase tracking-widest text-white/20"
                >
                  Your first instinct is the right one
                </motion.p>
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
