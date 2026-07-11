'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep6 } from '@/portal/steps/Step6Constellation'

registerStep6()

export default function Step6Page() {
  return <StepRenderer />
}
