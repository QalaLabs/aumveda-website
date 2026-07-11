'use client'

import type { ReactNode } from 'react'
import { usePortal } from '../engine/PortalContext'
import { ProgressBar } from './ProgressBar'
import { RedirectGuard } from '../engine/PortalRouter'

interface PortalShellProps {
  children: ReactNode
  showProgress?: boolean
  showSaveIndicator?: boolean
}

export function PortalShell({ children, showProgress = true, showSaveIndicator = true }: PortalShellProps) {
  const { state, autosave } = usePortal()

  return (
    <RedirectGuard>
      <div className="min-h-screen bg-[#1A0F3C] text-white">
        {showProgress && (
          <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <ProgressBar
              currentStep={state.currentStep}
              completedSteps={state.completedSteps}
              labels={true}
            />
          </div>
        )}

        {showSaveIndicator && autosave.pending && (
          <div className="fixed top-20 right-4 z-50">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Saving</span>
            </div>
          </div>
        )}

        {showSaveIndicator && autosave.error && (
          <div className="fixed top-20 right-4 z-50">
            <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-red-500/30">
              <span className="text-[10px] text-red-300 uppercase tracking-wider">Save error</span>
            </div>
          </div>
        )}

        <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          {children}
        </main>
      </div>
    </RedirectGuard>
  )
}
