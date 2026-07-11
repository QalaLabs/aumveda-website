'use client'

import { motion } from 'framer-motion'
import { useAudio } from '../audio/AudioProvider'

interface PortalAudioToggleProps {
  className?: string
  size?: 'sm' | 'md'
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
}

export function PortalAudioToggle({ className = '', size = 'md' }: PortalAudioToggleProps) {
  const { muted, toggleMute } = useAudio()

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        flex items-center justify-center rounded-full
        bg-white/5 text-white/50 backdrop-blur-sm
        transition-colors hover:bg-white/10 hover:text-white/80
        focus:outline-none focus:ring-2 focus:ring-white/30
        ${sizes[size]} ${className}
      `}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
    </motion.button>
  )
}
