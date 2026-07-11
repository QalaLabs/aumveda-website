'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { CardDrawProvider, useCardDraw } from '../../card-draw'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { TAROT_CARDS, type TarotCardItem } from './tarot-data'
import { TarotDeck } from './TarotDeck'
import { TarotReveal } from './TarotReveal'
import type { StepProps } from '../../engine/types'

export function registerStep4() {
  StepRegistry.register({
    id: 4,
    title: 'Tarot Card Draw',
    component: Step4Tarot,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

const DRAW_PHRASES = [
  'Your card is choosing you...',
  'The universe is shuffling your path...',
  'An ancient wisdom rises...',
  'The cards reveal what your heart already knows...',
  'The veil grows thin...',
]

function TarotContent({ onNext, onDataChange }: StepProps) {
  const { drawnCard, phase, seed } = useCardDraw()
  const [drawStarted, setDrawStarted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [phrase, setPhrase] = useState('')

  const handleDrawStart = useCallback(() => {
    setDrawStarted(true)
    setPhrase(DRAW_PHRASES[Math.floor(Math.random() * DRAW_PHRASES.length)])
  }, [])

  const handleDrawComplete = useCallback(() => {
    setRevealed(true)
    if (drawnCard) {
      const card = drawnCard as unknown as TarotCardItem
      onDataChange?.({
        tarotCard: card.id,
        tarotTheme: card.theme,
        tarotSeed: seed,
        tarotTimestamp: Date.now(),
      })
    }
  }, [drawnCard, seed, onDataChange])

  const handleContinue = useCallback(() => {
    onNext?.()
  }, [onNext])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <p className="text-xs text-gold/40 uppercase tracking-[0.3em] font-mono mb-2">Step 4 of 8</p>
        <h1 className="text-2xl font-display text-gold">Tarot Card Draw</h1>
        <p className="text-sm text-white/40 mt-1 max-w-md">
          Draw a single card from the Major Arcana. Its meaning is uniquely for you, right now.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!revealed && (
          <motion.div
            key="deck"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TarotDeck
              onDrawStart={handleDrawStart}
              onDrawComplete={handleDrawComplete}
            />
          </motion.div>
        )}

        {drawStarted && !revealed && (
          <motion.p
            key="phrase"
            className="text-sm text-gold/50 italic mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {phrase}
          </motion.p>
        )}

        {revealed && drawnCard && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TarotReveal
              card={drawnCard as unknown as TarotCardItem}
              onContinue={handleContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Step4Tarot(props: StepProps) {
  return (
    <AudioProvider>
      <BackgroundEngine theme={getTheme('tarot')} />
      <CardDrawProvider cards={TAROT_CARDS}>
        <TarotContent {...props} />
      </CardDrawProvider>
    </AudioProvider>
  )
}
