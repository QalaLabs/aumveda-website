'use client'

import type { ReactNode } from 'react'
import type { PortalThemeConfig } from '../theme/themes'

interface PortalBackgroundProps {
  theme: PortalThemeConfig
  children: ReactNode
  className?: string
}

export function PortalBackground({ theme, children, className = '' }: PortalBackgroundProps) {
  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden ${className}`}
      style={{ background: theme.background.gradient }}
    >
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${theme.glow.primary}15 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex w-full flex-col items-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
