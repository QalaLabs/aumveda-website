'use client'

import { motion } from 'framer-motion'
import type { TarotCardItem } from './tarot-data'
import { getTarotTheme } from './theme-map'
import { PortalReveal, PortalButton } from '../../design-system'

interface TarotRevealProps {
  card: TarotCardItem
  onContinue: () => void
}

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export function TarotReveal({ card, onContinue }: TarotRevealProps) {
  const theme = getTarotTheme(card.theme)

  const items = [
    { label: 'Card Number', value: `#${TAROT_CARD_ORDER[card.id as keyof typeof TAROT_CARD_ORDER] || '-'}` },
    { label: 'Theme', value: theme.name, color: theme.color },
  ]

  return (
    <PortalReveal show>
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <motion.div
          className="text-5xl"
          custom={0}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {card.symbol}
        </motion.div>

        <motion.h2
          className="text-2xl font-display text-gold"
          custom={1}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {card.name}
        </motion.h2>

        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex justify-between items-center px-4 py-2 rounded-lg"
            style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}
            custom={i + 2}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <span className="text-xs text-white/40 uppercase tracking-wider">{item.label}</span>
            <span
              className="text-sm font-medium"
              style={{ color: item.color || '#C9A84C' }}
            >
              {item.value}
            </span>
          </motion.div>
        ))}

        <motion.div
          className="p-4 rounded-lg"
          style={{
            background: `${theme.color}08`,
            border: `1px solid ${theme.color}20`,
          }}
          custom={items.length + 2}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <p className="text-sm text-white/60 leading-relaxed italic">
            &ldquo;{card.theme !== card.id ? theme.description : ''}&rdquo;
          </p>
        </motion.div>

        <motion.div
          custom={items.length + 3}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Reflection</p>
            <p className="text-sm text-white/70 leading-relaxed">{card.reflection}</p>
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.color}10, transparent)`,
            border: `1px solid ${theme.color}20`,
          }}
          custom={items.length + 4}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Your Affirmation</p>
          <p className="text-sm text-white/80 font-medium">"{card.affirmation}"</p>
        </motion.div>

        <motion.div
          custom={items.length + 5}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <PortalButton onClick={onContinue}>
            Continue Your Journey
          </PortalButton>
        </motion.div>

        <motion.p
          className="text-[10px] text-white/20 font-mono"
          custom={items.length + 6}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          Drawn at {new Date().toLocaleTimeString()}
        </motion.p>
      </div>
    </PortalReveal>
  )
}

const TAROT_CARD_ORDER = {
  fool: 0,
  magician: 1,
  high_priestess: 2,
  empress: 3,
  emperor: 4,
  hierophant: 5,
  lovers: 6,
  chariot: 7,
  strength: 8,
  hermit: 9,
  wheel_of_fortune: 10,
  justice: 11,
  hanged_man: 12,
  death: 13,
  temperance: 14,
  devil: 15,
  tower: 16,
  star: 17,
  moon: 18,
  sun: 19,
  judgement: 20,
  world: 21,
}
