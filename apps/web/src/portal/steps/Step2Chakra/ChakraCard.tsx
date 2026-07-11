'use client'

import { useRef, useCallback } from 'react'
import { PortalSelectionCard } from '../../design-system/PortalSelectionCard'
import { getSolfeggioFileForFrequency } from '../../audio/frequencies'
import type { ChakraItem } from './chakra-data'

interface ChakraCardProps {
  chakra: ChakraItem
  selected: boolean
  locked: boolean
  onClick: () => void
  large?: boolean
}

let hoverAudioCtx: AudioContext | null = null
let hoverOsc: OscillatorNode | null = null
let hoverGain: GainNode | null = null
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let hoverEl: HTMLAudioElement | null = null

function stopHoverTone() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  if (hoverEl) {
    try { hoverEl.pause() } catch {}
    hoverEl = null
  }
  if (hoverOsc) {
    try { hoverOsc.stop() } catch {}
    hoverOsc.disconnect()
    hoverOsc = null
  }
  if (hoverGain) {
    hoverGain.disconnect()
    hoverGain = null
  }
  if (hoverAudioCtx && hoverAudioCtx.state !== 'closed') {
    hoverAudioCtx.close()
    hoverAudioCtx = null
  }
}

function playOscillatorTone(hz: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = hz / 2
    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    hoverAudioCtx = ctx
    hoverOsc = osc
    hoverGain = gain
  } catch {}
}

/** Prefer the real solfeggio recording; fall back to a synthesized sine tone if the file is missing or fails to load. */
function playChakraFrequency(hz: number) {
  stopHoverTone()
  const file = getSolfeggioFileForFrequency(hz)
  if (!file) {
    playOscillatorTone(hz)
    return
  }
  try {
    const el = new Audio(file)
    el.volume = 0.25
    el.loop = false
    el.addEventListener('error', () => playOscillatorTone(hz), { once: true })
    el.play().catch(() => playOscillatorTone(hz))
    hoverEl = el
  } catch {
    playOscillatorTone(hz)
  }
}

export function ChakraCard({ chakra, selected, locked, onClick, large = false }: ChakraCardProps) {
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (locked || selected) return
    hoverTimeoutRef.current = setTimeout(() => {
      playChakraFrequency(chakra.frequency)
    }, 150)
  }, [chakra.frequency, locked, selected])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    stopHoverTone()
  }, [])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <PortalSelectionCard
        selected={selected}
        locked={locked}
        onClick={onClick}
        accentColor={chakra.color}
        className={large ? 'p-8' : ''}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className={`leading-none ${large ? 'text-5xl' : 'text-3xl'}`}
            style={{ filter: selected ? `drop-shadow(0 0 8px ${chakra.color}80)` : undefined }}
            aria-hidden="true"
          >
            {chakra.icon}
          </span>
          <div className="flex flex-col items-center gap-0.5">
            <p className={`font-semibold text-white ${large ? 'text-xl' : 'text-base'}`}>
              {chakra.name}
            </p>
            <p className={`text-white/40 ${large ? 'text-sm' : 'text-xs'}`}>
              {chakra.sanskrit}
            </p>
          </div>
          <p className={`text-white/20 font-mono ${large ? 'text-xs' : 'text-[10px]'}`}>
            {chakra.frequency} Hz
          </p>
          {!large && (
            <p className="text-xs leading-relaxed text-white/50 line-clamp-2">
              {chakra.description}
            </p>
          )}
        </div>
      </PortalSelectionCard>
    </div>
  )
}
