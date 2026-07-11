import type { ReactNode } from 'react'
import type { ZodSchema } from 'zod'

export const TOTAL_PORTAL_STEPS = 8 as const
export type PortalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type PortalPhase = 'idle' | PortalStep | 'completed'

export interface PortalData {
  // Step 1 — Breath (nothing persisted)

  // Step 2 — Chakra Frequency
  chakraSelected?: string | null

  // Step 3 — Archetype Discovery
  archetypeSelected?: string | null
  archetypeGift?: string | null
  archetypeShadow?: string | null
  archetypeElement?: string | null

  // Step 4 — Tarot Card Draw
  tarotCard?: string | null
  tarotTheme?: string | null
  tarotSeed?: number | null
  tarotTimestamp?: number | null

  // Step 5 — Intention Setting
  intention?: string | null

  // Step 6 — Constellation Birth Chart
  dob?: string | null
  timeOfBirth?: string | null
  placeOfBirth?: string | null
  birthLat?: number | null
  birthLng?: number | null
  sunSign?: string | null
  moonSign?: string | null
  risingSign?: string | null
  email?: string | null

  // Step 7 — Pattern Assessment
  q1Answer?: string | null
  q2Answer?: string | null
  q3Answer?: string | null
  q4Answer?: string | null
  q5Answer?: string | null
  q6Answer?: string | null
  q7Answer?: string | null
  nervousSystemScore?: string | null
  relationshipScore?: string | null
  childhoodScore?: string | null
  financialScore?: string | null
  profileResult?: string | null

  // Step 8 — Booking / Submission
  portalCompletedAt?: string | null
}

export interface PortalState {
  sessionId: string
  phase: PortalPhase
  currentStep: PortalStep
  completedSteps: number[]
  portalData: PortalData
  validationErrors: Record<number, Record<string, string[]>>
  progress: number
  loading: boolean
  saving: boolean
  error: string | null
  direction: 'forward' | 'backward' | null
  isHydrated: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string[]>
}

export type AnimationType = 'fade' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'slideUp' | 'custom'

export interface AnimationDefinition {
  type: AnimationType
  duration?: number
  delay?: number
}

export interface StepConfig<TData = unknown> {
  id: PortalStep
  title: string
  component: React.ComponentType<StepProps<TData>>
  validationSchema?: ZodSchema<TData>
  enterAnimation: AnimationDefinition
  exitAnimation: AnimationDefinition
  requiresData?: (keyof PortalData)[]
}

export interface StepProps<TData = unknown> {
  data: TData
  onDataChange: (data: Partial<TData>) => void
  onNext: () => void
  onPrevious: () => void
  isActive: boolean
  isFirst: boolean
  isLast: boolean
  progress: number
}

export interface StepTransitionEvent {
  from: PortalStep | null
  to: PortalStep
  direction: 'forward' | 'backward'
  timestamp: string
}

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp?: string
  sessionId?: string
}

export interface AutosaveState {
  lastSavedAt: string | null
  lastSyncedAt: string | null
  pending: boolean
  error: string | null
}

export type PortalAction =
  | { type: 'INITIALIZE'; payload: Partial<PortalState> }
  | { type: 'SET_PHASE'; payload: PortalPhase }
  | { type: 'GO_TO_STEP'; payload: { step: PortalStep; direction: 'forward' | 'backward' } }
  | { type: 'UPDATE_PORTAL_DATA'; payload: Partial<PortalData> }
  | { type: 'SET_VALIDATION_ERRORS'; payload: { step: number; errors: Record<string, string[]> } }
  | { type: 'CLEAR_VALIDATION_ERRORS'; payload: number }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HYDRATED'; payload: boolean }
  | { type: 'RESET' }
