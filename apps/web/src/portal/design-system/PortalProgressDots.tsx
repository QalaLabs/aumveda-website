'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface PortalProgressDotsProps {
  total: number
  current: number
  className?: string
  accentColor?: string
}

export function PortalProgressDots({
  total,
  current,
  className = '',
  accentColor = '#C9A84C',
}: PortalProgressDotsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="progressbar" aria-valuenow={current + 1} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
          {i === current && (
            <motion.div
              layoutId="activeDot"
              className="absolute inset-0 rounded-full"
              style={{
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}60`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
          <div
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'h-2.5 w-2.5'
                : i < current
                  ? 'h-2 w-2 bg-white/30'
                  : 'h-2 w-2 bg-white/10'
            }`}
            style={i === current ? { background: accentColor } : undefined}
          />
        </div>
      ))}
    </div>
  )
}
