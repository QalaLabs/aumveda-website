'use client'

import { StepRenderer } from '@/portal/components/StepRenderer'
import { registerStep7 } from '@/portal/steps/Step7Pattern'

registerStep7()

export default function Step7Page() {
  return <StepRenderer />
}
