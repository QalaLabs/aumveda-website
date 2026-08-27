'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import type { StepProps } from '../../engine/types'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio/AudioProvider'
import { SelectionProvider, useSelection } from '../../selection/SelectionProvider'
import { PortalContent } from '../../design-system/PortalContent'
import { PortalContinueButton } from '../../design-system/PortalContinueButton'
import { PortalAudioToggle } from '../../design-system/PortalAudioToggle'
import { staggerContainer, staggerItem, fadeUpVariants, pageTransitionVariants } from '../../animation/variants'
import { getTheme } from '../../theme/themes'
import { PortalTransition } from '../../design-system/PortalTransition'
import { CHAKRA_ITEMS } from './chakra-data'
import { ChakraCard } from './ChakraCard'
import { ChakraReveal } from './ChakraReveal'

export function registerStep2() {
  StepRegistry.register({
    id: 2,
    title: 'Chakra Frequency Test',
    component: Step2Chakra,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

function Step2Content({
  onNext,
  onDataChange,
}: {
  onNext: () => void
  onDataChange: (data: { chakraSelected: string }) => void
}) {
  const { selectedId, phase: selectionPhase, select, lock, isSelected } = useSelection()
  const [revealPhase, setRevealPhase] = useState<'hidden' | 'revealing' | 'revealed'>('hidden')

  const selectedChakra = selectedId
    ? CHAKRA_ITEMS.find((c) => c.id === selectedId) ?? null
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
    if (!selectedId) return
    onDataChange({ chakraSelected: selectedId })
    onNext()
  }, [selectedId, onDataChange, onNext])

  const showGrid = selectionPhase === 'selecting'
  const showLocked = selectionPhase === 'locked' && revealPhase === 'hidden'
  const showReveal = revealPhase === 'revealing' || revealPhase === 'revealed'

  return (
    <BackgroundEngine theme={getTheme('chakra')}>
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
                  Every chakra holds an energy. Choose the sound that your body is calling for right now.
                </motion.h1>

                <motion.div
                  variants={staggerItem}
                  className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {CHAKRA_ITEMS.map((chakra) => (
                    <motion.div key={chakra.id} variants={staggerItem}>
                      <ChakraCard
                        chakra={chakra}
                        selected={isSelected(chakra.id)}
                        locked={false}
                        onClick={() => handleSelect(chakra.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  variants={staggerItem}
                  className="text-center text-xs uppercase tracking-widest text-white/20"
                >
                  Hover any chakra to hear its frequency
                </motion.p>
              </motion.div>
            )}

            {showLocked && selectedChakra && (
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
                  <ChakraCard
                    chakra={selectedChakra}
                    selected
                    locked
                    onClick={() => {}}
                    large
                  />
                </div>
                <PortalContinueButton
                  onClick={handleReveal}
                  label="Reveal Your Chakra"
                />
              </motion.div>
            )}

            {showReveal && selectedChakra && (
              <motion.div
                key="chakra-reveal"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center gap-8"
              >
                <ChakraReveal chakra={selectedChakra} />
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

export function Step2Chakra(props: StepProps) {
  const { onNext, onDataChange } = props

  return (
    <AudioProvider>
      <SelectionProvider
        items={CHAKRA_ITEMS}
        onConfirm={(id) => {
          /* handled locally */
        }}
      >
        <Step2Content onNext={onNext} onDataChange={onDataChange} />
      </SelectionProvider>
    </AudioProvider>
  )
}

export default Step2Chakra
