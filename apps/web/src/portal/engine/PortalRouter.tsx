'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { usePortal } from './PortalContext'
import { isStepAccessible } from './PortalStateMachine'
import type { PortalStep } from './types'
import { TOTAL_PORTAL_STEPS } from './types'

const STEP_ROUTES: Record<number, string> = {
  1: '/step-1',
  2: '/step-2',
  3: '/step-3',
  4: '/step-4',
  5: '/step-5',
  6: '/step-6',
  7: '/step-7',
  8: '/step-8',
}

const ROUTE_TO_STEP: Record<string, PortalStep> = {
  '/step-1': 1,
  '/step-2': 2,
  '/step-3': 3,
  '/step-4': 4,
  '/step-5': 5,
  '/step-6': 6,
  '/step-7': 7,
  '/step-8': 8,
}

export function getRouteForStep(step: PortalStep): string {
  return STEP_ROUTES[step] || '/step-1'
}

export function getStepFromRoute(path: string): PortalStep | null {
  return ROUTE_TO_STEP[path] || null
}

export function RedirectGuard({ children }: { children: React.ReactNode }) {
  const { state, isStepAccessible } = usePortal()
  const pathname = usePathname()
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (!state.isHydrated) return

    const currentRouteStep = getStepFromRoute(pathname)

    if (state.phase === 'completed') {
      if (pathname !== '/step-8') {
        router.replace('/step-8')
      }
      return
    }

    if (!currentRouteStep) {
      const targetRoute = getRouteForStep(state.currentStep)
      router.replace(targetRoute)
      return
    }

    if (currentRouteStep !== state.currentStep) {
      if (currentRouteStep > state.currentStep) {
        const targetRoute = getRouteForStep(state.currentStep)
        router.replace(targetRoute)
      } else if (!isStepAccessible(currentRouteStep)) {
        const targetRoute = getRouteForStep(state.currentStep)
        router.replace(targetRoute)
      }
    }
  }, [state.currentStep, state.isHydrated, state.phase, pathname, router, isStepAccessible])

  if (!state.isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A0F3C]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
