'use client'

import { useCallback, useRef } from 'react'

export interface AnalyticsTracker {
  track: (eventName: string, properties?: Record<string, unknown>) => void
  identify: (userId: string, traits?: Record<string, unknown>) => void
  page: (pageName: string, properties?: Record<string, unknown>) => void
}

declare global {
  interface Window {
    mixpanel?: {
      track: (event: string, props?: Record<string, unknown>) => void
      identify: (id: string) => void
      people: { set: (traits: Record<string, unknown>) => void }
      init: (token: string, config?: Record<string, unknown>) => void
    }
    dataLayer?: unknown[]
  }
}

export function usePortalAnalytics(): AnalyticsTracker {
  const sessionRef = useRef<string>(`session_${Date.now()}`)

  const track = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: sessionRef.current,
        platform: 'portal',
        environment: process.env.NODE_ENV,
      },
    }

    if (typeof window !== 'undefined') {
      try {
        if (window.mixpanel) {
          window.mixpanel.track(eventName, event.properties)
        }
      } catch {
      }

      try {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: eventName,
            ...event.properties,
          })
        }
      } catch {
      }

      // Persist event in database via local analytics route
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          payload: event.properties,
          source: 'client',
        }),
      }).catch((err) => console.error('Database event tracking failed:', err))
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[Portal Analytics]', eventName, event.properties)
    }
  }, [])

  const identify = useCallback((userId: string, traits?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      try {
        if (window.mixpanel) {
          window.mixpanel.identify(userId)
          if (traits) {
            window.mixpanel.people.set(traits)
          }
        }
      } catch {
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[Portal Analytics] identify:', userId, traits)
    }
  }, [])

  const page = useCallback((pageName: string, properties?: Record<string, unknown>) => {
    track('page_view', { page: pageName, ...properties })
  }, [track])

  return { track, identify, page }
}
