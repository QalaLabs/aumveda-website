'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { revealVariants } from '../animation/variants'

interface PortalRevealProps {
  children: ReactNode
  show: boolean
  delay?: number
  className?: string
}

export function PortalReveal({ children, show, delay = 0, className = '' }: PortalRevealProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="reveal"
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ delay }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
