'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { scaleVariants } from '../animation/variants'
import { RADII, BLUR } from '../theme/tokens'

interface PortalCardProps {
  children: ReactNode
  className?: string
  glow?: string
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'glass' | 'solid' | 'elevated'
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

export function PortalCard({
  children,
  className = '',
  glow,
  padding = 'lg',
  variant = 'glass',
}: PortalCardProps) {
  const variants: Record<string, React.CSSProperties> = {
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: `blur(${BLUR.md})`,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    solid: {
      background: 'rgba(26, 15, 60, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    elevated: {
      background: 'rgba(34, 21, 80, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  }

  return (
    <motion.div
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full rounded-2xl ${paddings[padding]} ${className}`}
      style={{
        ...variants[variant],
        borderRadius: RADII['2xl'],
        boxShadow: glow || undefined,
      }}
    >
      {children}
    </motion.div>
  )
}
