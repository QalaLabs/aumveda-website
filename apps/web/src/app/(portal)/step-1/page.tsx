'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep1 } from '@/portal/steps/Step1Breath'

registerStep1()

export default function Step1Page() {
  return <StepRenderer />
}
