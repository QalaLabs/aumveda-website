'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scaleUpVariants, staggerContainer, staggerItem } from '../animation/variants'

interface PortalResultProps {
  children: ReactNode
  show: boolean
  title?: string
  subtitle?: string
  className?: string
}

export function PortalResult({ children, show, title, subtitle, className = '' }: PortalResultProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`flex flex-col items-center gap-4 text-center ${className}`}
        >
          {title && (
            <motion.h2
              variants={staggerItem}
              className="font-serif text-3xl font-bold tracking-wide text-white"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              variants={staggerItem}
              className="max-w-md text-lg text-white/60"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div variants={scaleUpVariants} className="mt-4">
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
