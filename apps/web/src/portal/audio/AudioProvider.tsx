'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { AudioManager } from './AudioManager'

interface AudioContextValue {
  muted: boolean
  toggleMute: () => void
  setMuted: (muted: boolean) => void
  play: (id: string, src: string, options?: { loop?: boolean; volume?: number }) => void
  stop: (id: string) => void
  stopAll: () => void
  isPlaying: (id: string) => boolean
  loadTrack: (id: string, src: string) => Promise<void>
  fadeOut: (id: string, duration?: number) => void
  fadeIn: (id: string, duration?: number) => void
  setVolume: (id: string, volume: number) => void
}

const AudioContextValue = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false)
  const mgr = AudioManager.getInstance()

  useEffect(() => {
    const stored = localStorage.getItem('portal-audio-muted')
    if (stored === 'true') {
      setMutedState(true)
      mgr.setMuted(true)
    }
  }, [mgr])

  const toggleMute = useCallback(() => {
    const nowMuted = mgr.toggleMute()
    setMutedState(nowMuted)
    return nowMuted
  }, [mgr])

  const setMuted = useCallback((value: boolean) => {
    mgr.setMuted(value)
    setMutedState(value)
  }, [mgr])

  const play = useCallback((id: string, src: string, options?: { loop?: boolean; volume?: number }) => {
    mgr.loadTrack(id, src).then(() => mgr.play(id, options))
  }, [mgr])

  const stop = useCallback((id: string) => mgr.stop(id), [mgr])
  const stopAll = useCallback(() => mgr.stopAll(), [mgr])
  const isPlaying = useCallback((id: string) => mgr.isPlaying(id), [mgr])
  const loadTrack = useCallback((id: string, src: string) => mgr.loadTrack(id, src), [mgr])
  const fadeOut = useCallback((id: string, duration?: number) => mgr.fadeOut(id, duration), [mgr])
  const fadeIn = useCallback((id: string, duration?: number) => mgr.fadeIn(id, duration), [mgr])
  const setVolume = useCallback((id: string, volume: number) => mgr.setVolume(id, volume), [mgr])

  return (
    <AudioContextValue.Provider value={{ muted, toggleMute, setMuted, play, stop, stopAll, isPlaying, loadTrack, fadeOut, fadeIn, setVolume }}>
      {children}
    </AudioContextValue.Provider>
  )
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContextValue)
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return ctx
}
