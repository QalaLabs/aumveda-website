import { TOTAL_PORTAL_STEPS } from './types'

export class ProgressManager {
  private onChange?: (progress: number) => void

  constructor(onChange?: (progress: number) => void) {
    this.onChange = onChange
  }

  calculateFromCompleted(completedSteps: number[]): number {
    return Math.round((completedSteps.length / TOTAL_PORTAL_STEPS) * 100)
  }

  calculateFromCurrentStep(currentStep: number): number {
    const completed = Math.max(0, currentStep - 1)
    return Math.round((completed / TOTAL_PORTAL_STEPS) * 100)
  }

  getStepWeight(): number {
    return 100 / TOTAL_PORTAL_STEPS
  }

  getRemainingSteps(completedSteps: number[]): number {
    return TOTAL_PORTAL_STEPS - completedSteps.length
  }

  isComplete(completedSteps: number[]): boolean {
    return completedSteps.length >= TOTAL_PORTAL_STEPS
  }

  notify(progress: number): void {
    this.onChange?.(progress)
  }

  setCallback(cb: (progress: number) => void): void {
    this.onChange = cb
  }
}

export const progress = new ProgressManager()
