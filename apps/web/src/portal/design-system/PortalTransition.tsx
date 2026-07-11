'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransitionVariants } from '../animation/variants'

interface PortalTransitionProps {
  children: ReactNode
  key: string | number
  className?: string
}

export function PortalTransition({ children, key, className = '' }: PortalTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
