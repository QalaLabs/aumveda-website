import type { PortalStep, PortalPhase, PortalState, PortalAction } from './types'
import { TOTAL_PORTAL_STEPS } from './types'

const STEP_ORDER: PortalStep[] = [1, 2, 3, 4, 5, 6, 7, 8]

export function portalReducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...state, ...action.payload, isHydrated: true }

    case 'SET_PHASE':
      return { ...state, phase: action.payload }

    case 'GO_TO_STEP': {
      const { step, direction } = action.payload
      const newCompleted = direction === 'forward'
        ? Array.from(new Set([...state.completedSteps, state.currentStep]))
        : state.completedSteps.filter(s => s < step)

      return {
        ...state,
        phase: step as PortalPhase,
        currentStep: step,
        completedSteps: newCompleted,
        direction,
        validationErrors: { ...state.validationErrors, [state.currentStep]: {} },
        error: null,
      }
    }

    case 'UPDATE_PORTAL_DATA':
      return {
        ...state,
        portalData: { ...state.portalData, ...action.payload },
      }

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: { ...state.validationErrors, [action.payload.step]: action.payload.errors },
      }

    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: { ...state.validationErrors, [action.payload]: {} },
      }

    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_SAVING':
      return { ...state, saving: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'SET_HYDRATED':
      return { ...state, isHydrated: action.payload }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}

export function createInitialState(): PortalState {
  return {
    sessionId: '',
    phase: 'idle',
    currentStep: 1,
    completedSteps: [],
    portalData: {},
    validationErrors: {},
    progress: 0,
    loading: false,
    saving: false,
    error: null,
    direction: null,
    isHydrated: false,
  }
}

export function isStepAccessible(
  step: PortalStep,
  completedSteps: number[],
  phase: PortalPhase,
): boolean {
  if (phase === 'completed') return step === TOTAL_PORTAL_STEPS
  if (step === 1) return true
  return completedSteps.includes(step - 1)
}

export function canGoNext(
  currentStep: PortalStep,
  completedSteps: number[],
): boolean {
  if (currentStep >= TOTAL_PORTAL_STEPS) return false
  return true
}

export function canGoBack(currentStep: PortalStep): boolean {
  return currentStep > 1
}

export function calculateProgress(completedSteps: number[]): number {
  return Math.round((completedSteps.length / TOTAL_PORTAL_STEPS) * 100)
}

export function getNextStep(currentStep: PortalStep): PortalStep | null {
  const idx = STEP_ORDER.indexOf(currentStep)
  if (idx === -1 || idx >= TOTAL_PORTAL_STEPS - 1) return null
  return STEP_ORDER[idx + 1]
}

export function getPrevStep(currentStep: PortalStep): PortalStep | null {
  const idx = STEP_ORDER.indexOf(currentStep)
  if (idx <= 0) return null
  return STEP_ORDER[idx - 1]
}

export function getAllSteps(): PortalStep[] {
  return [...STEP_ORDER]
}
