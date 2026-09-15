import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const telemetrySchema = z.object({
  sessionId: z.string().min(1),
  stepNumber: z.number().int().min(1).max(8),
  rageClicksCount: z.number().int().nonnegative().default(0),
  deadClicksCount: z.number().int().nonnegative().default(0),
  hesitationDwellMs: z.number().int().nonnegative().default(0),
  cursorVelocityAvg: z.number().nullable().optional(),
  userId: z.string().nullable().optional(),
  payload: z.record(z.unknown()).optional(),
})

/**
 * Infer nervous system state from behavioral biomarkers:
 * - HYPERAROUSAL: High rage clicks or erratic click bursts (sympathetic arousal).
 * - SHUTDOWN: High dead clicks or prolonged motionless hesitation (dorsal vagal freeze).
 * - REGULATED: Balanced rhythmic movement and normal pacing (ventral vagal).
 */
function inferNervousSystemState(metrics: {
  rageClicksCount: number
  deadClicksCount: number
  hesitationDwellMs: number
  cursorVelocityAvg?: number | null
}): 'HYPERAROUSAL' | 'SHUTDOWN' | 'REGULATED' {
  const { rageClicksCount, deadClicksCount, hesitationDwellMs, cursorVelocityAvg } = metrics

  if (rageClicksCount >= 2 || (rageClicksCount >= 1 && (cursorVelocityAvg ?? 0) > 1.2)) {
    return 'HYPERAROUSAL'
  }

  if (deadClicksCount >= 3 || (hesitationDwellMs > 15000 && (cursorVelocityAvg ?? 0) < 0.2)) {
    return 'SHUTDOWN'
  }

  return 'REGULATED'
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      const text = await req.text()
      try {
        body = JSON.parse(text)
      } catch {
        return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 })
      }
    } else {
      body = await req.json()
    }

    const parsed = telemetrySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid telemetry payload' },
        { status: 400 },
      )
    }

    const data = parsed.data
    const inferredState = inferNervousSystemState({
      rageClicksCount: data.rageClicksCount,
      deadClicksCount: data.deadClicksCount,
      hesitationDwellMs: data.hesitationDwellMs,
      cursorVelocityAvg: data.cursorVelocityAvg,
    })

    // Store in database
    let record: any = null
    try {
      record = await prisma.interactionTelemetry.create({
        data: {
          sessionId: data.sessionId,
          stepNumber: data.stepNumber,
          rageClicksCount: data.rageClicksCount,
          deadClicksCount: data.deadClicksCount,
          hesitationDwellMs: data.hesitationDwellMs,
          cursorVelocityAvg: data.cursorVelocityAvg ?? null,
          inferredState,
          userId: data.userId || null,
          payload: (data.payload as any) || undefined,
        },
      })
    } catch (dbErr) {
      console.warn('Could not store interaction telemetry in database:', dbErr)
    }

    return NextResponse.json({
      ok: true,
      inferredState,
      telemetryId: record?.id ?? null,
    })
  } catch (error: any) {
    console.error('TELEMETRY INGESTION ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
