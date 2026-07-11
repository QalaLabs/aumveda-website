'use client'

import { motion } from 'framer-motion'

interface NebulaProps {
  colors?: string[]
  intensity?: number
}

export function Nebula({ colors = ['#7C3AED', '#3B82F6', '#14B8A6'], intensity = 0.3 }: NebulaProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${40 + i * 20}%`,
            height: `${40 + i * 20}%`,
            left: `${20 + i * 10}%`,
            top: `${20 + i * 5}%`,
            background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
            opacity: intensity * (1 - i * 0.15),
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            opacity: [intensity * (1 - i * 0.15), intensity * (1 - i * 0.15) * 1.2, intensity * (1 - i * 0.15)],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
