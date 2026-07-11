import type { PortalData, PortalState } from './types'
import { sessionPersistence } from './SessionPersistence'

type SaveCallback = (state: AutosaveManagerState) => void

export interface AutosaveManagerState {
  lastSavedAt: string | null
  lastSyncedAt: string | null
  pending: boolean
  error: string | null
  queueLength: number
}

export class AutosaveManager {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private saveQueue: Map<string, unknown> = new Map()
  private state: AutosaveManagerState = {
    lastSavedAt: null,
    lastSyncedAt: null,
    pending: false,
    error: null,
    queueLength: 0,
  }
  private callback: SaveCallback | null = null
  private debounceMs: number

  private localSaveCounter = 0
  private syncCounter = 0
  private maxSyncRetries = 3

  constructor(debounceMs = 300) {
    this.debounceMs = debounceMs
  }

  getState(): AutosaveManagerState {
    return { ...this.state }
  }

  onStateChange(cb: SaveCallback): void {
    this.callback = cb
  }

  scheduleSave(data: Partial<PortalData>, portalState: PortalState): void {
    for (const [key, value] of Object.entries(data)) {
      this.saveQueue.set(key, value)
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.flush(portalState)
    }, this.debounceMs)
  }

  async flush(portalState: PortalState): Promise<void> {
    if (this.saveQueue.size === 0) return

    this.state.pending = true
    this.state.queueLength = this.saveQueue.size
    this.notify()

    const updatedData = { ...portalState.portalData }
    for (const [key, value] of this.saveQueue) {
      ;(updatedData as any)[key] = value
    }
    this.saveQueue.clear()

    const updatedState: PortalState = {
      ...portalState,
      portalData: updatedData,
    }

    try {
      sessionPersistence.saveToLocal(updatedState)
      this.localSaveCounter++
      this.state.lastSavedAt = new Date().toISOString()
      this.state.error = null
      this.notify()

      const synced = await this.syncWithRetry(updatedState)
      if (synced) {
        this.syncCounter++
        this.state.lastSyncedAt = new Date().toISOString()
      }
    } catch (err) {
      this.state.error = err instanceof Error ? err.message : 'Save failed'
    } finally {
      this.state.pending = false
      this.state.queueLength = 0
      this.notify()
    }
  }

  private async syncWithRetry(state: PortalState, attempt = 0): Promise<boolean> {
    try {
      return await sessionPersistence.syncToServer(state)
    } catch {
      if (attempt < this.maxSyncRetries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        return this.syncWithRetry(state, attempt + 1)
      }
      return false
    }
  }

  async forceSync(state: PortalState): Promise<boolean> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    await this.flush(state)
    return this.state.error === null
  }

  private notify(): void {
    this.callback?.(this.getState())
  }

  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.callback = null
  }
}

export const autosaveManager = new AutosaveManager()
