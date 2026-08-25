'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { PortalProvider } from '@/portal/engine/PortalProvider'
import { RedirectGuard } from '@/portal/engine/PortalRouter'
import { usePortal } from '@/portal/engine/PortalContext'

const STEP_LABELS = ['Breathe', 'Chakra', 'Archetype', 'Tarot', 'Intention', 'Constellation', 'Pattern', 'Book']

export function PortalClientShell({ children }: { children: ReactNode }) {
  return (
    <PortalProvider>
      <ShellFrame>
        <RedirectGuard>{children}</RedirectGuard>
      </ShellFrame>
    </PortalProvider>
  )
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { state } = usePortal()

  return (
    <div className="min-h-screen text-white">
      <nav aria-label="Portal progress" className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="flex-1">
            <div
              className="flex items-center gap-1.5"
              role="progressbar"
              aria-valuenow={state.currentStep}
              aria-valuemin={1}
              aria-valuemax={8}
              aria-valuetext={`Step ${state.currentStep} of 8: ${STEP_LABELS[state.currentStep - 1] ?? ''}`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i <= state.currentStep ? 'bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]' : 'bg-white/10'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <ol className="mt-1 flex justify-between px-0.5">
              {STEP_LABELS.map((label, i) => (
                <li
                  key={label}
                  className={`text-[9px] uppercase tracking-widest ${
                    i + 1 <= state.currentStep ? 'text-[#C9A84C]' : 'text-white/20'
                  }`}
                  aria-current={i + 1 === state.currentStep ? 'step' : undefined}
                >
                  {label}
                </li>
              ))}
            </ol>
          </div>
          {state.currentStep >= 2 && (
            <Link
              href="/"
              className="flex-shrink-0 font-body text-[10px] uppercase tracking-widest text-white/45 underline underline-offset-4 transition-colors hover:text-[#C9A84C]"
            >
              Skip for now
            </Link>
          )}
        </div>
      </nav>
      {children}
    </div>
  )
}
