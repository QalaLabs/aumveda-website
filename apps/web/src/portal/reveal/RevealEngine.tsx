'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { revealVariants, fadeUpVariants, scaleVariants, slideLeftVariants } from '../animation/variants'
import type { RevealPhase, RevealConfig, RevealContextValue } from './types'

const revealMotionVariants = {
  fade: revealVariants,
  scale: scaleVariants,
  slide: slideLeftVariants,
  flip: fadeUpVariants,
}

interface RevealEngineProps {
  children: ReactNode
  show: boolean
  config?: RevealConfig
  className?: string
}

const RevealCtx = createContext<RevealContextValue | null>(null)

export function RevealEngine({ children, show, config = {}, className = '' }: RevealEngineProps) {
  const [phase, setPhase] = useState<RevealPhase>('hidden')
  const type = config.type || 'fade'
  const variants = revealMotionVariants[type]

  const showFn = useCallback(() => {
    setPhase('entering')
    setTimeout(() => setPhase('visible'), (config.delay || 0) + (config.duration || 500))
  }, [config.delay, config.duration])

  const hideFn = useCallback(() => {
    setPhase('exiting')
    setTimeout(() => setPhase('hidden'), 300)
  }, [])

  return (
    <RevealCtx.Provider value={{ phase, show: showFn, hide: hideFn }}>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="reveal-content"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: config.delay || 0, duration: config.duration || 0.5 }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </RevealCtx.Provider>
  )
}

export function useReveal(): RevealContextValue {
  const ctx = useContext(RevealCtx)
  if (!ctx) throw new Error('useReveal must be used within a RevealEngine')
  return ctx
}
