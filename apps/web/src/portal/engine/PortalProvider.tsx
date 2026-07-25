'use client'

import { useReducer, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import { PortalContextProvider, type PortalContextValue } from './PortalContext'
import { portalReducer, createInitialState, isStepAccessible, getPrevStep, getNextStep, calculateProgress, canGoNext, canGoBack } from './PortalStateMachine'
import { StepRegistry } from './StepRegistry'
import { sessionPersistence } from './SessionPersistence'
import { autosaveManager, type AutosaveManagerState } from './AutosaveManager'
import { engine as validationEngine } from './ValidationEngine'
import { usePortalAnalytics } from '../hooks/usePortalAnalytics'
import { getRouteForStep } from './PortalRouter'
import type { PortalStep, PortalData } from './types'
import { TOTAL_PORTAL_STEPS } from './types'
import { useRouter } from 'next/navigation'
import { getFeatureFlags } from '@/lib/flags'

interface PortalProviderProps {
  children: ReactNode
  onComplete?: (data: PortalData) => void
}

export function PortalProvider({ children, onComplete }: PortalProviderProps) {
  const [state, dispatch] = useReducer(portalReducer, null, createInitialState)
  const [autosaveState, setAutosaveState] = useState<AutosaveManagerState>({
    lastSavedAt: null,
    lastSyncedAt: null,
    pending: false,
    error: null,
    queueLength: 0,
  })
  const analytics = usePortalAnalytics()
  const router = useRouter()
  const initializedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    autosaveManager.onStateChange((newState) => {
      setAutosaveState(newState)
    })
    return () => {
      autosaveManager.destroy()
    }
  }, [])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    async function init() {
      dispatch({ type: 'SET_LOADING', payload: true })

      const restored = await sessionPersistence.restore()
      const phase = restored.currentStep as any
      const progress = calculateProgress(restored.completedSteps)

      dispatch({
        type: 'INITIALIZE',
        payload: {
          ...restored,
          phase,
          progress,
        },
      })

      dispatch({ type: 'SET_LOADING', payload: false })
      analytics.track('portal.session_restored', {
        sessionId: restored.sessionId,
        currentStep: restored.currentStep,
        completedSteps: restored.completedSteps,
      })
    }

    init()
  }, [analytics])

  const goNext = useCallback(async () => {
    if (!canGoNext(state.currentStep, state.completedSteps)) return

    let nextStep = getNextStep(state.currentStep)
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined
    const flags = getFeatureFlags(searchParams)
    if (flags.shortPortal && state.currentStep === 2) {
      nextStep = 6
    }

    if (!nextStep) return

    const config = StepRegistry.get(state.currentStep)

    if (config?.validationSchema) {
      const result = validationEngine.validateStepData(
        config.validationSchema,
        state.portalData,
        state.currentStep,
      )
      if (!result.valid) {
        dispatch({
          type: 'SET_VALIDATION_ERRORS',
          payload: { step: state.currentStep, errors: result.errors },
        })
        return
      }
    }

    const completedSteps = [...new Set([...state.completedSteps, state.currentStep])]
    const progress = calculateProgress(completedSteps)

    const updatedState = {
      ...state,
      currentStep: state.currentStep,
      completedSteps,
      portalData: state.portalData,
      progress,
    }
    sessionPersistence.saveToLocal({
      ...updatedState,
      phase: nextStep as any,
      direction: 'forward',
    } as any)

    dispatch({
      type: 'GO_TO_STEP',
      payload: { step: nextStep, direction: 'forward' },
    })
    dispatch({ type: 'SET_PROGRESS', payload: progress })

    router.push(getRouteForStep(nextStep))

    analytics.track('portal.step_completed', {
      step: state.currentStep,
      nextStep,
      progress,
      sessionId: state.sessionId,
    })
  }, [state, analytics, router])

  const goBack = useCallback(() => {
    if (!canGoBack(state.currentStep)) return

    let prevStep = getPrevStep(state.currentStep)
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined
    const flags = getFeatureFlags(searchParams)
    if (flags.shortPortal && state.currentStep === 6) {
      prevStep = 2
    }

    if (!prevStep) return

    const completedSteps = state.completedSteps.filter(s => s < prevStep)
    const progress = calculateProgress(completedSteps)

    dispatch({
      type: 'GO_TO_STEP',
      payload: { step: prevStep, direction: 'backward' },
    })
    dispatch({ type: 'SET_PROGRESS', payload: progress })

    sessionPersistence.saveToLocal({
      ...state,
      currentStep: prevStep,
      completedSteps,
      progress,
      phase: prevStep as any,
      direction: 'backward',
    } as any)

    router.push(getRouteForStep(prevStep))

    analytics.track('portal.step_back', {
      from: state.currentStep,
      to: prevStep,
      sessionId: state.sessionId,
    })
  }, [state, analytics, router])

  const goToStep = useCallback((step: PortalStep) => {
    if (!isStepAccessible(step, state.completedSteps, state.phase)) return

    const direction = step > state.currentStep ? 'forward' : 'backward'

    dispatch({
      type: 'GO_TO_STEP',
      payload: { step, direction },
    })

    router.push(getRouteForStep(step))
  }, [state.completedSteps, state.phase, state.currentStep, router])

  const updatePortalData = useCallback((data: Partial<PortalData>) => {
    dispatch({ type: 'UPDATE_PORTAL_DATA', payload: data })

    const updatedPortalData = { ...state.portalData, ...data }
    const updatedState = { ...state, portalData: updatedPortalData }
    autosaveManager.scheduleSave(data, updatedState)
  }, [state])

  const completePortal = useCallback(async () => {
    const portalData: PortalData = {
      ...state.portalData,
      portalCompletedAt: new Date().toISOString(),
    }

    dispatch({ type: 'UPDATE_PORTAL_DATA', payload: { portalCompletedAt: new Date().toISOString() } })
    dispatch({ type: 'SET_PHASE', payload: 'completed' })
    dispatch({
      type: 'SET_PROGRESS',
      payload: 100,
    })

    await autosaveManager.forceSync({
      ...state,
      portalData,
      completedSteps: [1, 2, 3, 4, 5, 6, 7, 8],
      progress: 100,
    } as any)

    analytics.track('portal.completed', {
      sessionId: state.sessionId,
      profileResult: state.portalData.profileResult,
      portalData,
    })

    onCompleteRef.current?.(portalData)
  }, [state, analytics])

  const reset = useCallback(() => {
    sessionPersistence.reset()
    dispatch({ type: 'RESET' })

    const initialState = createInitialState()
    initialState.sessionId = sessionPersistence.generateNewSession()
    dispatch({ type: 'INITIALIZE', payload: { ...initialState } })

    analytics.track('portal.reset', {
      sessionId: initialState.sessionId,
    })

    router.push('/step-1')
  }, [analytics, router])

  const contextValue = useMemo<PortalContextValue>(() => ({
    state,
    autosave: {
      lastSavedAt: autosaveState.lastSavedAt,
      lastSyncedAt: autosaveState.lastSyncedAt,
      pending: autosaveState.pending,
      error: autosaveState.error,
    },
    goNext,
    goBack,
    goToStep,
    updatePortalData,
    completePortal,
    reset,
    isStepAccessible: (step: number) =>
      isStepAccessible(step as PortalStep, state.completedSteps, state.phase),
    getStepTitle: (step: PortalStep) => StepRegistry.get(step)?.title || `Step ${step}`,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === TOTAL_PORTAL_STEPS,
  }), [state, autosaveState, goNext, goBack, goToStep, updatePortalData, completePortal, reset])

  return (
    <PortalContextProvider value={contextValue}>
      {children}
    </PortalContextProvider>
  )
}
