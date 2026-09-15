'use client'

import { useEffect, useRef, useCallback } from 'react'

export interface InteractionTelemetryData {
  sessionId: string
  stepNumber: number
  rageClicksCount: number
  deadClicksCount: number
  hesitationDwellMs: number
  cursorVelocityAvg: number | null
  userId?: string
  payload?: Record<string, unknown>
}

interface UseInteractionTelemetryOptions {
  sessionId: string
  stepNumber: number
  userId?: string
  enabled?: boolean
}

export function useInteractionTelemetry({
  sessionId,
  stepNumber,
  userId,
  enabled = true,
}: UseInteractionTelemetryOptions) {
  const clickTimestampsRef = useRef<number[]>([])
  const rageClicksCountRef = useRef(0)
  const deadClicksCountRef = useRef(0)
  const startTimeRef = useRef<number>(Date.now())
  const lastMouseMoveTimeRef = useRef<number>(Date.now())
  const hesitationDwellMsRef = useRef<number>(0)
  const velocitiesRef = useRef<number[]>([])
  const lastCursorPosRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const isFlushedRef = useRef(false)

  // Track click interactions (rage clicks & dead clicks)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    startTimeRef.current = Date.now()
    lastMouseMoveTimeRef.current = Date.now()

    const handleClick = (e: MouseEvent) => {
      const now = Date.now()

      // Track rapid clicks (rage clicks: >= 3 within 1000ms)
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t <= 1000)
      clickTimestampsRef.current.push(now)
      if (clickTimestampsRef.current.length >= 3) {
        rageClicksCountRef.current += 1
      }

      // Track dead clicks (clicking non-interactive surfaces)
      const target = e.target as HTMLElement | null
      const isInteractive = Boolean(
        target?.closest(
          'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"]), [data-interactive="true"]',
        ),
      )
      if (!isInteractive) {
        deadClicksCountRef.current += 1
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const timeSinceLastMove = now - lastMouseMoveTimeRef.current

      // If cursor paused for > 800ms before moving, user was hesitating
      if (timeSinceLastMove > 800) {
        hesitationDwellMsRef.current += timeSinceLastMove
      }
      lastMouseMoveTimeRef.current = now

      // Calculate cursor velocity (pixels / ms)
      if (lastCursorPosRef.current) {
        const dt = now - lastCursorPosRef.current.time
        if (dt > 16) {
          // ~60fps sample
          const dx = e.clientX - lastCursorPosRef.current.x
          const dy = e.clientY - lastCursorPosRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const velocity = distance / dt
          velocitiesRef.current.push(velocity)
          if (velocitiesRef.current.length > 50) {
            velocitiesRef.current.shift()
          }
        }
      }
      lastCursorPosRef.current = { x: e.clientX, y: e.clientY, time: now }
    }

    window.addEventListener('click', handleClick, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled])

  const flushTelemetry = useCallback(
    (extraPayload?: Record<string, unknown>) => {
      if (isFlushedRef.current) return
      isFlushedRef.current = true

      const totalDwellMs = Date.now() - startTimeRef.current
      const avgVelocity =
        velocitiesRef.current.length > 0
          ? velocitiesRef.current.reduce((a, b) => a + b, 0) / velocitiesRef.current.length
          : null

      const data: InteractionTelemetryData = {
        sessionId,
        stepNumber,
        userId,
        rageClicksCount: rageClicksCountRef.current,
        deadClicksCount: deadClicksCountRef.current,
        hesitationDwellMs: hesitationDwellMsRef.current || Math.min(totalDwellMs, 10000),
        cursorVelocityAvg: avgVelocity ? Math.round(avgVelocity * 100) / 100 : null,
        payload: {
          totalDwellMs,
          recordedAt: new Date().toISOString(),
          ...extraPayload,
        },
      }

      try {
        const body = JSON.stringify(data)
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' })
          navigator.sendBeacon('/api/telemetry/interaction', blob)
        } else {
          fetch('/api/telemetry/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => null)
        }
      } catch (err) {
        console.warn('Telemetry dispatch error:', err)
      }
    },
    [sessionId, stepNumber, userId],
  )

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (!isFlushedRef.current) {
        flushTelemetry({ trigger: 'step_unmount' })
      }
    }
  }, [flushTelemetry])

  return {
    flushTelemetry,
    getRageClicksCount: () => rageClicksCountRef.current,
    getDeadClicksCount: () => deadClicksCountRef.current,
    getHesitationDwellMs: () => hesitationDwellMsRef.current,
  }
}
