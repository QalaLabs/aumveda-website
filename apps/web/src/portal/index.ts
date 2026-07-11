export { PortalProvider } from './engine/PortalProvider'
export { usePortal } from './engine/PortalContext'
export { StepRegistry } from './engine/StepRegistry'
export { RedirectGuard, getRouteForStep, getStepFromRoute } from './engine/PortalRouter'
export { AnimationManager, getAnimationVariants } from './engine/AnimationManager'
export { portalReducer, createInitialState, isStepAccessible, calculateProgress } from './engine/PortalStateMachine'
export { engine as validationEngine, portalSchema } from './engine/ValidationEngine'
export { sessionPersistence } from './engine/SessionPersistence'
export { autosaveManager } from './engine/AutosaveManager'
export { ProgressBar } from './components/ProgressBar'
export { StepRenderer } from './components/StepRenderer'
export { PortalShell } from './components/PortalShell'
export { usePortalAnalytics } from './hooks/usePortalAnalytics'
export { usePortalAuth } from './hooks/usePortalAuth'
export { usePortalNavigation } from './hooks/usePortalNavigation'

export type { PortalContextValue } from './engine/PortalContext'
export type {
  PortalState,
  PortalStep,
  PortalPhase,
  PortalData,
  StepConfig,
  StepProps,
  ValidationResult,
  AnimationDefinition,
  AnimationType,
  AnalyticsEvent,
  StepTransitionEvent,
  AutosaveState,
  PortalAction,
} from './engine/types'
export { TOTAL_PORTAL_STEPS } from './engine/types'

export type {
  IntegrationProvider,
  ProkeralaAstrologyClient,
  GooglePlacesClient,
  BookingProvider,
  PaymentProvider,
  N8nWebhookDispatcher,
  AhiEngineClient,
  DailyDoseAdapter,
  CrmClient,
} from './types/integration.types'

/* Portal Experience Framework (new) */
export * from './theme'
export * from './animation'
export * from './audio'
export * from './background'
export * from './design-system'
export * from './selection'
export * from './reveal'
export * from './question'
