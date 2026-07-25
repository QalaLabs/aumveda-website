'use client'

import type { ReactNode } from 'react'
import { usePortal } from '../engine/PortalContext'
import { ProgressBar } from './ProgressBar'
import { RedirectGuard } from '../engine/PortalRouter'
import { ExitIntentPopup } from './ExitIntentPopup'

interface PortalShellProps {
  children: ReactNode
  showProgress?: boolean
  showSaveIndicator?: boolean
}

/** Portal atmosphere: night canvas, gold status — Trust → Regulation */
export function PortalShell({
  children,
  showProgress = true,
  showSaveIndicator = true,
}: PortalShellProps) {
  const { state, autosave } = usePortal()

  return (
    <RedirectGuard>
      <div className="min-h-screen bg-[hsl(var(--av-night))] text-[hsl(var(--av-parchment))]">
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
          <div className="fixed top-20 right-4 z-50" role="status" aria-live="polite">
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-[hsl(var(--av-gold)/0.35)] bg-[hsl(var(--av-ink)/0.8)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--av-gold))]" />
              <span className="font-body text-[10px] uppercase tracking-wider text-[hsl(var(--av-parchment)/0.55)]">
                Saving
              </span>
            </div>
          </div>
        )}

        {showSaveIndicator && autosave.error && (
          <div className="fixed top-20 right-4 z-50" role="alert">
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-[hsl(var(--av-rose)/0.4)] bg-[hsl(var(--av-ink)/0.9)]">
              <span className="font-body text-[10px] uppercase tracking-wider text-[hsl(var(--av-rose))]">
                Save paused — will retry
              </span>
            </div>
          </div>
        )}

        <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          {children}
        </main>

        <ExitIntentPopup />
      </div>
    </RedirectGuard>
  )
}
