'use client'

import { motion } from 'framer-motion'
import { PORTAL_GLOWS } from '../theme/tokens'

interface PortalLoadingProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-3',
  lg: 'h-16 w-16 border-4',
}

export function PortalLoading({ label, size = 'md', className = '' }: PortalLoadingProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`} role="status">
      <motion.div
        className={`rounded-full border-[#C9A84C]/30 border-t-[#C9A84C] ${sizes[size]}`}
        style={{
          boxShadow: PORTAL_GLOWS.gold.sm,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {label && (
        <motion.p
          className="text-sm tracking-wider text-white/50"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.p>
      )}
      <span className="sr-only">Loading{label ? `: ${label}` : ''}</span>
    </div>
  )
}
