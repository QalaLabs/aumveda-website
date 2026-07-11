'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep2 } from '@/portal/steps/Step2Chakra'

registerStep2()

export default function Step2Page() {
  return <StepRenderer />
}
