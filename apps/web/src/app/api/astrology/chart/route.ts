import { NextRequest, NextResponse } from 'next/server'

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

interface ChartRequestBody {
  dob: string
  timeOfBirth?: string | null
  lat: number
  lng: number
}

interface ChartResult {
  sunSign: string
  moonSign: string
  risingSign: string | null
  source: 'prokerala' | 'fallback'
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getProkeralaToken(): Promise<string | null> {
  const clientId = process.env.PROKERALA_CLIENT_ID
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const res = await fetch('https://api.prokerala.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) throw new Error(`Prokerala token request failed: ${res.status}`)

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3000) * 1000 - 30_000,
  }
  return cachedToken.token
}

/** Calls the real Prokerala Astrology API. Server-side only — credentials never reach the client. */
async function fetchFromProkerala(body: ChartRequestBody): Promise<ChartResult> {
  const token = await getProkeralaToken()
  if (!token) throw new Error('Prokerala credentials not configured')

  const datetime = `${body.dob}T${body.timeOfBirth || '12:00'}:00+05:30`
  const params = new URLSearchParams({
    ayanamsa: '1',
    coordinates: `${body.lat},${body.lng}`,
    datetime,
  })

  const res = await fetch(`https://api.prokerala.com/v2/astrology/planet-position?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    // Prokerala responses for a fixed birth chart never change — safe to cache at the edge.
    next: { revalidate: 60 * 60 * 24 * 30 },
  })

  if (!res.ok) throw new Error(`Prokerala chart request failed: ${res.status}`)

  const data = await res.json()
  const planets: Array<{ name: string; rasi?: { name: string } }> = data?.data?.planet_positions ?? []

  const findSign = (planetName: string) =>
    planets.find((p) => p.name?.toLowerCase() === planetName)?.rasi?.name ?? null

  const sunSign = findSign('sun')
  const moonSign = findSign('moon')
  const risingSign = body.timeOfBirth ? findSign('ascendant') : null

  if (!sunSign || !moonSign) throw new Error('Prokerala response missing expected planet data')

  return { sunSign, moonSign, risingSign, source: 'prokerala' }
}

function mockChart(body: ChartRequestBody): ChartResult {
  // Deterministic-per-birth-detail placeholder used only when Prokerala credentials are absent
  // or the live call fails. Never silently presented as real astrology — `source: 'fallback'` is
  // surfaced to the client so the UI can label it honestly.
  const seed = `${body.dob}${body.lat}${body.lng}`.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return {
    sunSign: SIGNS[seed % 12],
    moonSign: SIGNS[(seed * 7) % 12],
    risingSign: body.timeOfBirth ? SIGNS[(seed * 13) % 12] : null,
    source: 'fallback',
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChartRequestBody

    if (!body.dob || typeof body.lat !== 'number' || typeof body.lng !== 'number') {
      return NextResponse.json({ ok: false, error: 'dob, lat and lng are required' }, { status: 400 })
    }

    try {
      const result = await fetchFromProkerala(body)
      return NextResponse.json({ ok: true, data: result })
    } catch (prokeralaError) {
      console.error('[astrology/chart] Prokerala call failed, using fallback:', prokeralaError)
      return NextResponse.json({ ok: true, data: mockChart(body) })
    }
  } catch (error) {
    console.error('[astrology/chart] Fatal error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to calculate chart' }, { status: 500 })
  }
}
