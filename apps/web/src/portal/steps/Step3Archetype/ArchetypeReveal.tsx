'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, scaleUpVariants } from '../../animation/variants'
import { RevealEngine } from '../../reveal/RevealEngine'
import type { ArchetypeItem } from './archetype-data'

interface ArchetypeRevealProps {
  archetype: ArchetypeItem
}

export function ArchetypeReveal({ archetype }: ArchetypeRevealProps) {
  return (
    <RevealEngine show={true}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full max-w-lg flex-col items-center gap-6"
      >
        <motion.div
          variants={staggerItem}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{
              backgroundColor: `${archetype.color}22`,
              boxShadow: `0 0 40px ${archetype.color}40`,
            }}
            variants={scaleUpVariants}
          >
            <span style={{ filter: `drop-shadow(0 0 6px ${archetype.color}80)` }}>
              {archetype.symbol}
            </span>
          </motion.div>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-white">
            {archetype.name}
          </h2>
          <p className="flex items-center gap-2 text-sm text-white/40">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: archetype.color }}
            />
            {archetype.element}
          </p>
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="max-w-md text-center text-base leading-relaxed text-white/70"
        >
          {archetype.revealText}
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="w-full space-y-4 rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <p className="mb-1 text-sm font-semibold tracking-wide" style={{ color: archetype.color }}>
              Your Gift
            </p>
            <p className="text-sm leading-relaxed text-white/70">{archetype.gift}</p>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div>
            <p className="mb-1 text-sm font-semibold tracking-wide text-white/50">
              Your Shadow
            </p>
            <p className="text-sm leading-relaxed text-white/70">{archetype.shadow}</p>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div>
            <p className="mb-1 text-sm font-semibold tracking-wide text-white/50">
              Your Growth Path
            </p>
            <p className="text-sm leading-relaxed text-white/70">{archetype.growthPath}</p>
          </div>
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="max-w-md text-center text-sm italic leading-relaxed text-white/40"
        >
          &ldquo;{archetype.quote}&rdquo;
        </motion.p>

        <motion.p
          variants={staggerItem}
          className="max-w-md text-center text-base font-medium text-[#C9A84C]"
        >
          {archetype.affirmation}
        </motion.p>
      </motion.div>
    </RevealEngine>
  )
}
