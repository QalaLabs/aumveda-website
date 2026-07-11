import { NextRequest, NextResponse } from 'next/server'

interface PortalCompletedPayload {
  sessionId: string
  userId?: string | null
  email?: string | null
  chakraSelected?: string | null
  archetypeSelected?: string | null
  tarotCard?: string | null
  tarotTheme?: string | null
  intention?: string | null
  dob?: string | null
  timeOfBirth?: string | null
  placeOfBirth?: string | null
  sunSign?: string | null
  moonSign?: string | null
  risingSign?: string | null
  profileResult?: string | null
  nervousSystemScore?: string | null
  relationshipScore?: string | null
  childhoodScore?: string | null
  financialScore?: string | null
  bookingScheduledEvent?: string | null
  timestamp: string
}

const MAX_ATTEMPTS = 3

async function dispatchWithRetry(url: string, payload: unknown, attempt = 1): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) return true
    throw new Error(`n8n webhook responded ${res.status}`)
  } catch (err) {
    if (attempt >= MAX_ATTEMPTS) {
      console.error(`[n8n/portal-completed] Giving up after ${attempt} attempts:`, err)
      return false
    }
    await new Promise((r) => setTimeout(r, 500 * attempt))
    return dispatchWithRetry(url, payload, attempt + 1)
  }
}

/**
 * Fires the "portal completed" event toward n8n: WhatsApp to Sejal, ClickUp lead card,
 * email confirmation. Retries up to 3x with backoff; never throws back to the portal UI —
 * a failed notification must not block the client's completed-portal experience, but it
 * is logged so it can be replayed manually if n8n is unreachable.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<PortalCompletedPayload>

  if (!body.sessionId) {
    return NextResponse.json({ ok: false, error: 'sessionId is required' }, { status: 400 })
  }

  const payload: PortalCompletedPayload = {
    sessionId: body.sessionId,
    userId: body.userId ?? null,
    email: body.email ?? null,
    chakraSelected: body.chakraSelected ?? null,
    archetypeSelected: body.archetypeSelected ?? null,
    tarotCard: body.tarotCard ?? null,
    tarotTheme: body.tarotTheme ?? null,
    intention: body.intention ?? null,
    dob: body.dob ?? null,
    timeOfBirth: body.timeOfBirth ?? null,
    placeOfBirth: body.placeOfBirth ?? null,
    sunSign: body.sunSign ?? null,
    moonSign: body.moonSign ?? null,
    risingSign: body.risingSign ?? null,
    profileResult: body.profileResult ?? null,
    nervousSystemScore: body.nervousSystemScore ?? null,
    relationshipScore: body.relationshipScore ?? null,
    childhoodScore: body.childhoodScore ?? null,
    financialScore: body.financialScore ?? null,
    bookingScheduledEvent: body.bookingScheduledEvent ?? null,
    timestamp: new Date().toISOString(),
  }

  const webhookUrl = process.env.N8N_PORTAL_WEBHOOK_URL

  try {
    const { prisma } = await import('@aumveda/db')
    await prisma.event.create({
      data: {
        eventName: 'portal.n8n_dispatch',
        userId: payload.userId ?? undefined,
        payload: JSON.parse(JSON.stringify(payload)),
        source: 'server',
      },
    })
  } catch (err) {
    console.error('[n8n/portal-completed] Failed to log dispatch event:', err)
  }

  if (!webhookUrl) {
    console.warn('[n8n/portal-completed] N8N_PORTAL_WEBHOOK_URL not configured — payload logged only, not dispatched')
    return NextResponse.json({ ok: true, dispatched: false, reason: 'no_webhook_configured' })
  }

  const dispatched = await dispatchWithRetry(webhookUrl, payload)
  return NextResponse.json({ ok: true, dispatched })
}
