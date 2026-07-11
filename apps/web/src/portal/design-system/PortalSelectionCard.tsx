'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RADII, BLUR, PORTAL_GLOWS } from '../theme/tokens'

interface PortalSelectionCardProps {
  children: ReactNode
  selected: boolean
  locked?: boolean
  revealed?: boolean
  onClick?: () => void
  className?: string
  accentColor?: string
}

export function PortalSelectionCard({
  children,
  selected,
  locked = false,
  revealed = false,
  onClick,
  className = '',
  accentColor = '#C9A84C',
}: PortalSelectionCardProps) {
  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      whileHover={!locked ? { scale: 1.03, y: -2 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      className={`
        relative w-full cursor-pointer overflow-hidden rounded-2xl p-6 text-left
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
        ${selected ? 'ring-2' : ''}
        ${locked ? 'cursor-default opacity-50' : ''}
        ${revealed ? 'cursor-default' : ''}
        ${className}
      `}
      style={{
        borderRadius: RADII['2xl'],
        background: selected
          ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`
          : 'rgba(255, 255, 255, 0.04)',
        border: selected
          ? `1px solid ${accentColor}50`
          : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: `blur(${BLUR.sm})`,
        boxShadow: selected ? `${accentColor}30 0 0 20px` : 'none',
        outline: selected ? `1px solid ${accentColor}30` : 'none',
      }}
      role="radio"
      aria-checked={selected}
      aria-disabled={locked}
      tabIndex={locked ? -1 : 0}
    >
      {selected && (
        <motion.div
          layoutId="selectionGlow"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor}10 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.button>
  )
}
