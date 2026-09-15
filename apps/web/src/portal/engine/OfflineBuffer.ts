'use client'

import type { PortalData } from './types'

export interface OfflineBufferedStep {
  id?: number | string
  sessionId: string
  stepNumber: number
  data: Partial<PortalData>
  isOfflineSync: true
  clientRecordedAt: string
}

const DB_NAME = 'aumveda_portal_db'
const STORE_NAME = 'offline_steps'
const DB_VERSION = 1
const SESSION_STORAGE_KEY = 'aumveda_offline_buffer'

class OfflineBufferEngine {
  private isClient = typeof window !== 'undefined'
  private dbPromise: Promise<IDBDatabase> | null = null

  constructor() {
    if (this.isClient) {
      this.initDb()
      window.addEventListener('online', () => {
        this.flushOfflineQueue().catch(() => null)
      })
    }
  }

  private initDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise((resolve, reject) => {
      if (!this.isClient || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'))
      }

      const req = window.indexedDB.open(DB_NAME, DB_VERSION)

      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        }
      }

      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })

    return this.dbPromise
  }

  // --- SessionStorage Fallback Helpers ---
  private getFromSessionStorage(): OfflineBufferedStep[] {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  private saveToSessionStorage(items: OfflineBufferedStep[]): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Buffer a portal step locally when server write fails or network is offline
   */
  async bufferStep(payload: {
    sessionId: string
    stepNumber: number
    data: Partial<PortalData>
  }): Promise<void> {
    const item: OfflineBufferedStep = {
      sessionId: payload.sessionId,
      stepNumber: payload.stepNumber,
      data: payload.data,
      isOfflineSync: true,
      clientRecordedAt: new Date().toISOString(),
    }

    try {
      const db = await this.initDb()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.add(item)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
    } catch {
      // Fallback to sessionStorage
      const existing = this.getFromSessionStorage()
      existing.push({ ...item, id: `ss_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` })
      this.saveToSessionStorage(existing)
    }
  }

  /**
   * Retrieve all pending offline steps from IndexedDB or sessionStorage
   */
  async getBufferedSteps(): Promise<OfflineBufferedStep[]> {
    const results: OfflineBufferedStep[] = []

    try {
      const db = await this.initDb()
      const idbItems = await new Promise<OfflineBufferedStep[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.getAll()
        req.onsuccess = () => resolve(req.result || [])
        req.onerror = () => reject(req.error)
      })
      results.push(...idbItems)
    } catch {
      // Ignore idb errors
    }

    // Also include any in sessionStorage
    const ssItems = this.getFromSessionStorage()
    results.push(...ssItems)

    return results
  }

  /**
   * Clear processed items from storage
   */
  async clearBufferedSteps(ids?: Array<number | string>): Promise<void> {
    try {
      const db = await this.initDb()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      if (!ids) {
        store.clear()
      } else {
        ids.forEach((id) => {
          if (typeof id === 'number' || !id.startsWith('ss_')) {
            store.delete(id)
          }
        })
      }
    } catch {
      // Ignore
    }

    if (!ids) {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
      } catch {}
    } else {
      const remaining = this.getFromSessionStorage().filter(
        (item) => !item.id || !ids.includes(item.id),
      )
      this.saveToSessionStorage(remaining)
    }
  }

  /**
   * Bulk flush buffered offline steps to /api/portal/sync-offline
   */
  async flushOfflineQueue(): Promise<boolean> {
    if (!this.isClient || !navigator.onLine) return false

    const items = await this.getBufferedSteps()
    if (items.length === 0) return true

    try {
      const res = await fetch('/api/portal/sync-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: items }),
        signal: AbortSignal.timeout(10000),
      })

      if (res.ok) {
        const itemIds = items.map((i) => i.id).filter(Boolean) as Array<number | string>
        await this.clearBufferedSteps(itemIds.length > 0 ? itemIds : undefined)
        return true
      }
      return false
    } catch (err) {
      console.warn('Offline flush error:', err)
      return false
    }
  }
}

export const offlineBuffer = new OfflineBufferEngine()
