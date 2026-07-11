'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PortalGlowProps {
  children: ReactNode
  color?: string
  intensity?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const glowIntensities: Record<string, string> = {
  sm: '0 0 20px',
  md: '0 0 40px',
  lg: '0 0 80px',
  xl: '0 0 120px',
}

export function PortalGlow({
  children,
  color = '#C9A84C',
  intensity = 'md',
  className = '',
}: PortalGlowProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `${glowIntensities[intensity]} ${color}20`,
          `${glowIntensities[intensity]} ${color}35`,
          `${glowIntensities[intensity]} ${color}20`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
