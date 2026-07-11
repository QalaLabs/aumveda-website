'use client'

import type { ReactNode } from 'react'
import { Starfield } from './starfield'
import { Particles } from './particles'
import { Nebula } from './nebula'
import type { PortalThemeConfig } from '../theme/themes'

interface BackgroundEngineProps {
  theme: PortalThemeConfig
  children?: ReactNode
  className?: string
}

export function BackgroundEngine({ theme, children, className = '' }: BackgroundEngineProps) {
  return (
    <div className={`relative min-h-screen ${theme.background.gradient} ${className}`}>
      {theme.stars && (
        <Starfield
          count={theme.stars.count}
          color={theme.stars.color}
          twinkle={theme.stars.twinkle}
        />
      )}
      {theme.particles && (
        <Particles
          count={theme.particles.count}
          color={theme.particles.color}
          speed={theme.particles.speed}
          size={theme.particles.size}
        />
      )}
      <Nebula />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
