'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, scaleUpVariants } from '../../animation/variants'
import { RevealEngine } from '../../reveal/RevealEngine'
import type { ChakraItem } from './chakra-data'

interface ChakraRevealProps {
  chakra: ChakraItem
}

export function ChakraReveal({ chakra }: ChakraRevealProps) {
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
              backgroundColor: `${chakra.color}22`,
              boxShadow: `0 0 40px ${chakra.color}40`,
            }}
            variants={scaleUpVariants}
          >
            <span style={{ filter: `drop-shadow(0 0 6px ${chakra.color}80)` }}>
              {chakra.icon}
            </span>
          </motion.div>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-white">
            {chakra.name}
          </h2>
          <p className="text-sm font-medium text-white/40">
            {chakra.sanskrit}
          </p>
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="text-center text-lg font-medium italic text-[#C9A84C]"
        >
          This chakra is calling for healing.
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
            <p className="mb-1 text-sm font-semibold tracking-wide" style={{ color: chakra.color }}>
              {chakra.revealTitle}
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              {chakra.blockedMeaning}
            </p>
          </div>
          <div className="h-px w-full bg-white/5" />
          <div>
            <p className="mb-1 text-sm font-semibold tracking-wide text-white/50">
              How it shows up in your life
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              {chakra.lifeManifestation}
            </p>
          </div>
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="max-w-md text-center text-sm italic leading-relaxed text-white/30"
        >
          This is where we begin. Your chart already knows why.
        </motion.p>
      </motion.div>
    </RevealEngine>
  )
}
