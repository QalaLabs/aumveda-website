'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep4 } from '@/portal/steps/Step4Tarot'

registerStep4()

export default function Step4Page() {
  return <StepRenderer />
}
