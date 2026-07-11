import type { PortalStep, StepConfig } from './types'
import { getAllSteps } from './PortalStateMachine'

class StepRegistryImpl {
  private steps = new Map<PortalStep, StepConfig>()

  register<T>(config: StepConfig<T>): void {
    // Idempotent by design: step modules call register() at module-evaluation time
    // (not inside useEffect) so the registry is populated before the first render.
    // Next.js Fast Refresh and route remounts re-evaluate that module scope, so a
    // second call for the same id is expected — overwrite rather than throw.
    this.steps.set(config.id, config as unknown as StepConfig)
  }

  get(step: PortalStep): StepConfig | undefined {
    return this.steps.get(step)
  }

  getAll(): StepConfig[] {
    const allSteps = getAllSteps()
    const registered: StepConfig[] = []
    for (const s of allSteps) {
      const config = this.steps.get(s)
      if (config) registered.push(config)
    }
    return registered
  }

  has(step: PortalStep): boolean {
    return this.steps.has(step)
  }

  getTotalSteps(): number {
    return this.steps.size
  }

  getStepTitles(): Record<PortalStep, string> {
    const titles = {} as Record<PortalStep, string>
    for (const [id, config] of this.steps) {
      titles[id] = config.title
    }
    return titles
  }

  clear(): void {
    this.steps.clear()
  }
}

export const StepRegistry = new StepRegistryImpl()
