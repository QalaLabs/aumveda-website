import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'

const referenceModels: Record<string, any> = {
  'chakra-reveals': prisma.chakraReveal,
  'archetype-reveals': prisma.archetypeReveal,
  'tarot-themes': prisma.tarotTheme,
  'chart-predictions': prisma.chartPrediction,
  'pattern-questions': prisma.patternQuestion,
  'pattern-scoring': prisma.patternScoring,
  'pattern-profiles': prisma.patternProfile,
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const table = searchParams.get('table')

  if (!table || !referenceModels[table]) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing table param' }, { status: 400 })
  }

  const data = await referenceModels[table].findMany()
  return NextResponse.json({ ok: true, data })
}
