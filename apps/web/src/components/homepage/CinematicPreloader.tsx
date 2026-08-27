'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const SceneCanvas = dynamic(
  () => import('./SceneCanvas').then((m) => m.SceneCanvas),
  { ssr: false }
)

interface CinematicPreloaderProps {
  onComplete?: () => void
  durationMs?: number
}

export function CinematicPreloader({
  onComplete,
  durationMs = 2800,
}: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const start = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100))
      setProgress(pct)

      if (elapsed < durationMs) {
        frameId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 300)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [durationMs, onComplete])

  const handleSkip = () => {
    setIsVisible(false)
    onComplete?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[hsl(var(--av-ink))] text-[hsl(var(--av-parchment))] overflow-hidden select-none"
        >
          {/* Lazy 3D Scene in background of preloader */}
          <div className="absolute inset-0 opacity-80 pointer-events-none">
            <SceneCanvas />
          </div>

          {/* Meditative glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--av-gold)/0.12)] blur-3xl"
            aria-hidden
          />

          {/* Central Monogram & Typography */}
          <div className="relative z-10 text-center px-6 space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[hsl(var(--av-gold)/0.4)] bg-[hsl(var(--av-night)/0.6)] backdrop-blur-md shadow-2xl mx-auto"
            >
              <span className="font-serif text-2xl text-[hsl(var(--av-gold))]">ॐ</span>
            </motion.div>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="font-serif text-4xl md:text-5xl tracking-[0.08em] text-[hsl(var(--av-parchment))]">
                AUMVEDA
              </h1>
              <p className="font-body text-xs uppercase tracking-[0.28em] text-[hsl(var(--av-gold-soft))]">
                Neuro-Vedic Healing Sanctuary
              </p>
            </motion.div>

            {/* Minimal Progress Bar */}
            <div className="w-48 mx-auto space-y-2 pt-4">
              <div className="h-[2px] w-full bg-[hsl(var(--av-stone)/0.2)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[hsl(var(--av-gold))]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-body text-[10px] uppercase tracking-widest text-[hsl(var(--av-mute))]">
                Aligning Frequencies • {progress}%
              </p>
            </div>
          </div>

          {/* Skip Intro button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-10 right-8 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--av-stone)/0.3)] bg-[hsl(var(--av-night)/0.6)] backdrop-blur-md font-body text-[11px] uppercase tracking-widest text-[hsl(var(--av-parchment)/0.75)] hover:text-[hsl(var(--av-gold))] hover:border-[hsl(var(--av-gold)/0.5)] transition-all cursor-pointer"
          >
            <span>Skip Intro</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
