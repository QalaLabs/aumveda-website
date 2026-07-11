'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep5 } from '@/portal/steps/Step5Intention'

registerStep5()

export default function Step5Page() {
  return <StepRenderer />
}
