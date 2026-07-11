'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  xDrift: number
  yDrift: number
  duration: number
  delay: number
}

interface ParticlesProps {
  count?: number
  color?: string
  speed?: number
  size?: number
}

export function Particles({ count = 20, color = '#C9A84C', speed = 1, size = 2 }: ParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size * 1.5) + size * 0.5,
      xDrift: (Math.random() - 0.5) * 40,
      yDrift: -(Math.random() * 30 + 10),
      duration: (Math.random() * 3 + 3) / speed,
      delay: Math.random() * 5,
    }))
  }, [count, speed, size])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
          animate={{
            y: [0, p.yDrift, 0],
            x: [0, p.xDrift, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
