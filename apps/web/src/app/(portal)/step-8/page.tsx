'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep8 } from '@/portal/steps/Step8Booking'

registerStep8()

export default function Step8Page() {
  return <StepRenderer />
}
