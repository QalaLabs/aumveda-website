'use client'

import { usePortal } from '../engine/PortalContext'
import { StepRegistry } from '../engine/StepRegistry'
import { AnimationManager } from '../engine/AnimationManager'

export function StepRenderer() {
  const { state, goNext, goBack, updatePortalData, isFirstStep, isLastStep } = usePortal()

  if (!state.isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0720]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    )
  }

  const config = StepRegistry.get(state.currentStep)
  if (!config) {
    return (
      <div className="text-center text-white/50 py-20">
        <p>Step {state.currentStep} not registered.</p>
        <p className="text-sm text-white/30 mt-2">Register a component via StepRegistry.register().</p>
      </div>
    )
  }

  const StepComponent = config.component as React.ComponentType<any>

  return (
    <AnimationManager step={state.currentStep} direction={state.direction}>
      <StepComponent
        data={state.portalData}
        onDataChange={updatePortalData}
        onNext={goNext}
        onPrevious={goBack}
        isActive={true}
        isFirst={isFirstStep}
        isLast={isLastStep}
        progress={state.progress}
      />
    </AnimationManager>
  )
}
