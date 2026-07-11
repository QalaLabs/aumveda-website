'use client'

import { useCallback } from 'react'
import { usePortal } from '../engine/PortalContext'

interface NavigationActions {
  goNext: () => Promise<void>
  goBack: () => void
  goToStep: (step: number) => void
  isFirstStep: boolean
  isLastStep: boolean
  isStepAccessible: (step: number) => boolean
}

export function usePortalNavigation(): NavigationActions {
  const { goNext, goBack, goToStep, isFirstStep, isLastStep, isStepAccessible } = usePortal()

  return {
    goNext: useCallback(() => goNext(), [goNext]),
    goBack: useCallback(() => goBack(), [goBack]),
    goToStep: useCallback((step: number) => goToStep(step as any), [goToStep]),
    isFirstStep,
    isLastStep,
    isStepAccessible,
  }
}
