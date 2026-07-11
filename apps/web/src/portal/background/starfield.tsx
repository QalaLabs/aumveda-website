'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  duration: number
}

interface StarfieldProps {
  count?: number
  color?: string
  twinkle?: boolean
}

export function Starfield({ count = 80, color = '#FFFFFF', twinkle = true }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }))
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: color,
            boxShadow: `0 0 ${star.size * 2}px ${color}`,
          }}
          initial={{ opacity: star.opacity }}
          animate={
            twinkle
              ? {
                  opacity: [star.opacity, star.opacity * 3, star.opacity],
                  scale: [1, 1.2, 1],
                }
              : undefined
          }
          transition={
            twinkle
              ? {
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
