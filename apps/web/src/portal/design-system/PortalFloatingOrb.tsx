'use client'

import { motion } from 'framer-motion'

interface PortalFloatingOrbProps {
  color?: string
  glowColor?: string
  size?: number
  className?: string
}

export function PortalFloatingOrb({
  color = '#C9A84C',
  glowColor = 'rgba(201, 168, 76, 0.25)',
  size = 200,
  className = '',
}: PortalFloatingOrbProps) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${color}, transparent)`,
        boxShadow: `0 0 ${size * 0.4}px ${glowColor}`,
        filter: 'blur(1px)',
      }}
      animate={{
        y: [0, -15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  )
}
