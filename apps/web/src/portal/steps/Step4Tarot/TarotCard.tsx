'use client'

import { motion } from 'framer-motion'
import type { TarotCardItem } from './tarot-data'
import { getTarotTheme } from './theme-map'
import { cardFlipVariants } from './animations'

interface TarotCardProps {
  card: TarotCardItem
  flipped: boolean
  onFlipComplete?: () => void
}

const BACK_GRADIENT = 'linear-gradient(135deg, #1a1040, #2d1b69, #1a1040)'
const BACK_PATTERN = 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.15) 0%, transparent 70%)'

export function TarotCard({ card, flipped, onFlipComplete }: TarotCardProps) {
  const theme = getTarotTheme(card.theme)

  return (
    <div
      className="relative"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative w-56 h-80 cursor-default"
        style={{ transformStyle: 'preserve-3d' }}
        variants={cardFlipVariants}
        initial="back"
        animate={flipped ? 'front' : 'back'}
        onAnimationComplete={onFlipComplete}
      >
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-gold/30 flex items-center justify-center overflow-hidden"
          style={{
            background: BACK_GRADIENT,
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: BACK_PATTERN }}
          />
          <div className="relative z-10 w-16 h-24 rounded-lg border border-gold/40 flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.08)' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L24.49 16.27L37 17.27L27 26.14L29.49 39L20 32.27L10.51 39L13 26.14L3 17.27L15.51 16.27L20 4Z" fill="#C9A84C" fillOpacity="0.3"/>
              <circle cx="20" cy="20" r="8" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border border-gold/40 p-5 flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0a1a, #1a1040)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
          />
          <span className="text-4xl mb-2">{card.symbol}</span>
          <h3 className="text-lg font-display text-gold mb-1">{card.name}</h3>
          <span
            className="text-xs font-mono tracking-wider uppercase px-2 py-0.5 rounded-full"
            style={{
              background: `${theme.color}20`,
              color: theme.color,
              border: `1px solid ${theme.color}40`,
            }}
          >
            {theme.name}
          </span>
          <p className="text-xs text-white/50 mt-2 leading-relaxed">
            {card.keywords}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
