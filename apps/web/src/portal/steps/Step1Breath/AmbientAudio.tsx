'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { AUDIO } from './constants'

interface AmbientAudioProps {
  enabled?: boolean
}

export function AmbientAudio({ enabled = true }: AmbientAudioProps) {
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(AUDIO.localStorageKey)
    if (stored !== null) {
      setMuted(stored === 'true')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const audio = new Audio(AUDIO.ambientSrc)
    audio.loop = true
    audio.volume = 0
    audio.muted = true
    audio.preload = 'none'
    audioRef.current = audio

    const onCanPlay = () => {
      setLoaded(true)
      audio.play().catch(() => {})
    }
    audio.addEventListener('canplaythrough', onCanPlay, { once: true })
    audio.load()

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('canplaythrough', onCanPlay)
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
      audioRef.current = null
    }
  }, [enabled])

  useEffect(() => {
    const el = audioRef.current
    if (!el || !loaded) return
    const elRef = el

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)

    if (!muted) {
      elRef.muted = false
      const targetVol = 0.3
      const startVol = elRef.volume
      const fadeDuration = AUDIO.fadeInMs
      const startTime = performance.now()

      function fadeIn(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / fadeDuration, 1)
        elRef.volume = startVol + (targetVol - startVol) * progress
        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(fadeIn)
        }
      }
      fadeRef.current = requestAnimationFrame(fadeIn)
    } else {
      const startVol = elRef.volume
      const fadeDuration = AUDIO.fadeOutMs
      const startTime = performance.now()

      function fadeOut(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / fadeDuration, 1)
        elRef.volume = startVol * (1 - progress)
        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(fadeOut)
        } else {
          elRef.muted = true
        }
      }
      fadeRef.current = requestAnimationFrame(fadeOut)
    }

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [muted, loaded])

  const toggle = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      try { localStorage.setItem(AUDIO.localStorageKey, String(next)) } catch {}
      return next
    })
  }, [])

  if (!loaded) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A0F3C]"
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  )
}
