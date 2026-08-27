'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicPreloaderProps {
  onComplete?: () => void
  durationMs?: number
}

const STATUS_STEPS = [
  { threshold: 0, text: 'Awakening Sacred Space' },
  { threshold: 28, text: 'Harmonizing Nervous System' },
  { threshold: 60, text: 'Aligning Vedic Frequencies' },
  { threshold: 88, text: 'Welcome to AUMVEDA' },
]

export function CinematicPreloader({
  onComplete,
  durationMs = 2800,
}: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
        }, 350)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [durationMs, onComplete])

  const handleSkip = () => {
    setIsVisible(false)
    onComplete?.()
  }

  const currentStatus =
    [...STATUS_STEPS].reverse().find((s) => progress >= s.threshold)?.text ||
    'Aligning Frequencies'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[hsl(var(--av-ink))] text-[hsl(var(--av-parchment))] overflow-hidden select-none"
        >
          {/* Ambient Video Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <video
              ref={videoRef}
              src="/story/beat0-arrival.mp4"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-1000 scale-105 ${
                videoLoaded ? 'opacity-40' : 'opacity-0'
              }`}
            />
            {/* Atmospheric Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--av-ink)/0.8)] via-[hsl(var(--av-ink)/0.6)] to-[hsl(var(--av-ink)/0.95)]" />
          </div>

          {/* Meditative Pulsing Aura */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.28, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--av-gold)/0.25)] blur-[100px]"
            aria-hidden
          />

          {/* Central Monogram & Typography */}
          <div className="relative z-10 text-center px-6 max-w-md mx-auto space-y-7">
            <div className="relative inline-flex items-center justify-center">
              {/* Outer Golden Ripple Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute -inset-3 rounded-full border border-[hsl(var(--av-gold)/0.5)]"
              />

              {/* ॐ Monogram Card */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border border-[hsl(var(--av-gold)/0.45)] bg-[hsl(var(--av-night)/0.75)] backdrop-blur-xl shadow-[0_0_40px_rgba(201,168,76,0.25)]"
              >
                <span className="font-serif text-3xl text-[hsl(var(--av-gold))] select-none">ॐ</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="font-serif text-4xl md:text-5xl tracking-[0.14em] text-[hsl(var(--av-parchment))] font-light">
                AUMVEDA
              </h1>
              <p className="font-body text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--av-gold-soft))]">
                Mother–Daughter Neuro-Vedic Healing
              </p>
            </motion.div>

            {/* Minimal Progress Bar & Status Text */}
            <div className="w-56 mx-auto space-y-3 pt-2">
              <div className="h-[2px] w-full bg-[hsl(var(--av-parchment)/0.15)] rounded-full overflow-hidden p-[0.5px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[hsl(var(--av-gold))] via-[hsl(var(--av-gold-soft))] to-[hsl(var(--av-parchment))] rounded-full shadow-[0_0_8px_hsl(var(--av-gold))]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--av-parchment)/0.6)] font-mono">
                <span className="truncate pr-2">{currentStatus}</span>
                <span className="text-[hsl(var(--av-gold))] font-medium">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Skip Intro button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            type="button"
            onClick={handleSkip}
            className="group absolute bottom-10 right-8 z-20 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[hsl(var(--av-parchment)/0.2)] bg-[hsl(var(--av-night)/0.65)] backdrop-blur-md font-body text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.8)] hover:text-[hsl(var(--av-gold))] hover:border-[hsl(var(--av-gold)/0.6)] hover:bg-[hsl(var(--av-night)/0.85)] transition-all cursor-pointer shadow-lg"
          >
            <span>Skip Intro</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
