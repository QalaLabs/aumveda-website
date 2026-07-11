'use client'

import { useRef, useEffect } from 'react'
import { motion, useAnimation, type Variants } from 'framer-motion'
import { useCardDraw } from '../../card-draw'
import type { TarotCardItem } from './tarot-data'
import { TarotCard } from './TarotCard'

interface TarotDeckProps {
  onDrawStart?: () => void
  onDrawComplete?: () => void
}

const DECK_OFFSET = 2.5
const DECK_ROTATION = 1.2
const DECK_X_OFFSET = 0.8

const oscillationVariants: Variants = {
  idle: (i: number) => ({
    y: -i * DECK_OFFSET,
    rotate: (i - 2) * DECK_ROTATION,
    x: (i - 2) * DECK_X_OFFSET,
  }),
  oscillate: (i: number) => ({
    y: [-i * DECK_OFFSET, -i * DECK_OFFSET + Math.sin(i * 0.8) * 1.5, -i * DECK_OFFSET],
    rotate: [(i - 2) * DECK_ROTATION, (i - 2) * DECK_ROTATION + Math.cos(i * 1.2) * 0.6, (i - 2) * DECK_ROTATION],
    x: [(i - 2) * DECK_X_OFFSET, (i - 2) * DECK_X_OFFSET + Math.sin(i * 0.5) * 0.4, (i - 2) * DECK_X_OFFSET],
    transition: {
      duration: 3 + i * 0.1,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.08,
    },
  }),
  draw: (i: number) => ({
    y: -(i - 0) * DECK_OFFSET - 60,
    scale: 0.5,
    opacity: i === 0 ? 0 : 0.4,
    transition: { duration: 0.5, ease: 'easeIn' },
  }),
}

export function TarotDeck({ onDrawStart, onDrawComplete }: TarotDeckProps) {
  const { deck, phase, draw, drawnCard } = useCardDraw()
  const deckCtrls = useAnimation()
  const visibleCards = deck.slice(0, 5) as unknown as TarotCardItem[]
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (phase === 'shuffling') {
      deckCtrls.start((i) => 'oscillate')
    } else if (phase === 'ready') {
      deckCtrls.start((i) => i === 0 ? 'idle' : 'oscillate')
    }
  }, [phase, deckCtrls])

  useEffect(() => {
    if (phase === 'drawing' && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      onDrawStart?.()
      deckCtrls.start((i) => 'draw')
    }
    if (phase !== 'drawing') {
      hasTriggeredRef.current = false
    }
  }, [phase, deckCtrls, onDrawStart])

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-80 w-56">
        {phase !== 'flipping' && phase !== 'revealed' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {visibleCards.map((card, i) => (
              <motion.div
                key={card.id}
                className="absolute"
                custom={i}
                variants={oscillationVariants}
                initial="idle"
                animate={deckCtrls}
                style={{ zIndex: visibleCards.length - i }}
              >
                <div
                  className="w-48 h-72 rounded-2xl border border-gold/30 flex items-center justify-center cursor-pointer select-none"
                  style={{
                    background: 'linear-gradient(135deg, #1a1040, #2d1b69)',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.08)`,
                  }}
                  onClick={() => {
                    if (phase === 'ready') draw()
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Draw a tarot card"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (phase === 'ready') draw()
                    }
                  }}
                >
                  <div
                    className="w-12 h-18 rounded-lg border border-gold/30 flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.06)' }}
                  >
                    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4L24.49 16.27L37 17.27L27 26.14L29.49 39L20 32.27L10.51 39L13 26.14L3 17.27L15.51 16.27L20 4Z" fill="#C9A84C" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
            {phase === 'shuffling' && (
              <motion.p
                className="absolute -bottom-8 text-xs text-gold/50 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Shuffling...
              </motion.p>
            )}
            {phase === 'ready' && (
              <motion.p
                className="absolute -bottom-8 text-xs text-gold/60 tracking-widest"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tap to draw your card
              </motion.p>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {drawnCard && (
              <TarotCard
                card={drawnCard as unknown as TarotCardItem}
                flipped={phase === 'revealed'}
                onFlipComplete={() => {
                  onDrawComplete?.()
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
