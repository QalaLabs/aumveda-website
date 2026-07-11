'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { PortalState, PortalStep, PortalData, AutosaveState } from './types'

export interface PortalContextValue {
  state: PortalState
  autosave: AutosaveState
  goNext: () => Promise<void>
  goBack: () => void
  goToStep: (step: PortalStep) => void
  updatePortalData: (data: Partial<PortalData>) => void
  completePortal: () => Promise<void>
  reset: () => void
  isStepAccessible: (step: number) => boolean
  getStepTitle: (step: PortalStep) => string
  isFirstStep: boolean
  isLastStep: boolean
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return ctx
}

export function PortalContextProvider({
  children,
  value,
}: {
  children: ReactNode
  value: PortalContextValue
}) {
  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  )
}
