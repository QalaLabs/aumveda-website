'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep3 } from '@/portal/steps/Step3Archetype'

registerStep3()

export default function Step3Page() {
  return <StepRenderer />
}
