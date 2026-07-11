import type { PortalState } from './types'
import { createInitialState } from './PortalStateMachine'

/**
 * Client-side portal persistence.
 *
 * Local (always): full state → localStorage, so refresh / back-nav / crash all restore.
 *
 * Server (from Step 6 onward): sync via `POST /api/portal`. Anonymous pre-Step-6 writes
 * are localStorage-only by design — the PRD gates server-side identity on the Step-6
 * email capture, so we never invent a phantom user just to hold session bytes.
 */

const SESSION_KEY_PREFIX = 'aumveda_portal_session_'
const SESSION_ID_KEY = 'aumveda_portal_session_id'
const USER_ID_KEY = 'aumveda_portal_user_id'

function generateSessionId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `portal_${result}_${Date.now()}`
}

function safeLocalGet(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

function safeLocalSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, value)
  } catch {
    /* localStorage disabled (Safari private mode, quota exceeded) — persistence
     * silently degrades to in-memory only. Portal still works for the current tab. */
  }
}

function safeLocalRemove(key: string): void {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(key)
  } catch {
    /* see safeLocalSet */
  }
}

export class SessionPersistence {
  private sessionId: string = ''

  getSessionId(): string {
    return this.sessionId
  }

  getUserId(): string | null {
    return safeLocalGet(USER_ID_KEY)
  }

  private setUserId(userId: string | null): void {
    if (userId) {
      safeLocalSet(USER_ID_KEY, userId)
    } else {
      safeLocalRemove(USER_ID_KEY)
    }
  }

  generateNewSession(): string {
    this.sessionId = generateSessionId()
    safeLocalSet(SESSION_ID_KEY, this.sessionId)
    return this.sessionId
  }

  saveToLocal(state: PortalState): void {
    const key = `${SESSION_KEY_PREFIX}${state.sessionId}`
    const payload = JSON.stringify({
      sessionId: state.sessionId,
      phase: state.phase,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      portalData: state.portalData,
      progress: state.progress,
      direction: state.direction,
    })
    safeLocalSet(key, payload)
  }

  restoreFromLocal(): PortalState | null {
    const sessionId = safeLocalGet(SESSION_ID_KEY)
    if (!sessionId) return null

    const key = `${SESSION_KEY_PREFIX}${sessionId}`
    const raw = safeLocalGet(key)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw)
      this.sessionId = parsed.sessionId || sessionId
      return {
        ...createInitialState(),
        sessionId: this.sessionId,
        phase: parsed.phase || 'idle',
        currentStep: parsed.currentStep || 1,
        completedSteps: parsed.completedSteps || [],
        portalData: parsed.portalData || {},
        progress: parsed.progress || 0,
        direction: parsed.direction || null,
        isHydrated: true,
      }
    } catch {
      // Corrupted payload — wipe and start fresh rather than crashing on next read.
      safeLocalRemove(key)
      return null
    }
  }

  async syncToServer(state: PortalState): Promise<boolean> {
    const userId = this.getUserId()

    // Pre-Step-6: no email yet → nothing to persist server-side. localStorage
    // is the only source of truth until identity is established.
    if (!userId && !state.portalData.email) {
      return true
    }

    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          userId,
          portalData: state.portalData,
        }),
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) return false
      const json = await res.json()

      // Server returns the userId it minted on email capture — cache it so subsequent
      // writes travel under the same identity.
      if (json?.userId && json.userId !== userId) {
        this.setUserId(json.userId)
      }
      return json?.ok === true
    } catch {
      // Network / timeout / server failure — retry logic lives in AutosaveManager.
      return false
    }
  }

  async restore(): Promise<PortalState> {
    const local = this.restoreFromLocal()
    if (local) return local

    const initialState = createInitialState()
    initialState.sessionId = this.generateNewSession()
    this.saveToLocal(initialState)
    return initialState
  }

  clear(): void {
    if (this.sessionId) {
      const key = `${SESSION_KEY_PREFIX}${this.sessionId}`
      safeLocalRemove(key)
    }
    safeLocalRemove(SESSION_ID_KEY)
    safeLocalRemove(USER_ID_KEY)
  }

  reset(): void {
    this.clear()
    this.sessionId = ''
  }
}

export const sessionPersistence = new SessionPersistence()
