import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const schema = z.object({
  userId: z.string().optional().nullable(),
  eventName: z.string().min(1),
  payload: z.any().optional(),
  source: z.string().default('client'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { userId, eventName, payload, source } = parsed.data

    // Save event to Database for audit trail / reporting
    const event = await prisma.event.create({
      data: {
        userId: userId || null,
        eventName,
        payload: payload || {},
        source,
      },
    })

    // Task 5.3: Simulating WhatsApp re-engagement triggers via n8n for drop-offs at Steps 2-5
    if (eventName === 'portal.dropoff') {
      const step = payload?.step
      const email = payload?.email
      const sessionId = payload?.sessionId

      if (step >= 2 && step <= 5) {
        console.log(
          `[Re-engagement Engine] Queuing WhatsApp re-engagement alert via n8n in 1 hour for lead: ${
            email || 'Anonymous'
          } (Session: ${sessionId}) dropped at Step ${step}`
        )
        // In production, we'd trigger a webhook to n8n here:
        // await fetch(process.env.N8N_WHATSAPP_WEBHOOK, { method: 'POST', body: JSON.stringify({ email, step, sessionId }) })
      }
    }

    return NextResponse.json({ ok: true, eventId: event.eventId })
  } catch (error: any) {
    console.error('ANALYTICS TRACK API ERROR:', error)
    return NextResponse.json({ error: 'Failed to record tracking event' }, { status: 500 })
  }
}
