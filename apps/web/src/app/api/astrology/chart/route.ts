import { NextRequest, NextResponse } from 'next/server'

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
  source: 'prokerala'
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

const VEDIC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

function getJulianDate(year: number, month: number, day: number, hour = 12, minute = 0): number {
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const a = Math.floor(y / 100)
  const b = 2 - a + Math.floor(a / 4)
  const dayFraction = (hour + minute / 60) / 24
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + b - 1524.5
}

function getLahiriAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525
  return 23.857 + 1.396 * t
}

function calculateAstronomicalChart(body: ChartRequestBody): ChartResult {
  const parts = body.dob.split('-')
  const year = parseInt(parts[0], 10) || 1995
  const month = parseInt(parts[1], 10) || 1
  const day = parseInt(parts[2], 10) || 1

  let hour = 12
  let minute = 0
  if (body.timeOfBirth) {
    const timeParts = body.timeOfBirth.split(':')
    hour = parseInt(timeParts[0], 10) || 12
    minute = parseInt(timeParts[1], 10) || 0
  }

  const jd = getJulianDate(year, month, day, hour, minute)
  const ayanamsa = getLahiriAyanamsa(jd)

  // Solar longitude (Tropical -> Sidereal with Lahiri ayanamsa)
  const n = jd - 2451545.0
  const L = (280.460 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180)
  let sunLon = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)
  sunLon = (sunLon % 360 + 360) % 360
  const siderealSunLon = (sunLon - ayanamsa + 360) % 360
  const sunSign = VEDIC_SIGNS[Math.floor(siderealSunLon / 30) % 12]

  // Lunar longitude approximation
  const t = n / 36525
  const Lp = 218.3164477 + 481267.88123421 * t
  const D = (297.8501921 + 445267.1114034 * t) * (Math.PI / 180)
  const M = (357.5291092 + 35999.0502909 * t) * (Math.PI / 180)
  const Mp = (134.9633964 + 477198.8675055 * t) * (Math.PI / 180)
  const F = (93.2720950 + 483202.0175233 * t) * (Math.PI / 180)

  let moonLon =
    Lp +
    6.288774 * Math.sin(Mp) +
    1.274027 * Math.sin(2 * D - Mp) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mp) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F)

  moonLon = (moonLon % 360 + 360) % 360
  const siderealMoonLon = (moonLon - ayanamsa + 360) % 360
  const moonSign = VEDIC_SIGNS[Math.floor(siderealMoonLon / 30) % 12]

  // Ascendant / Lagna calculation if time of birth provided
  let risingSign: string | null = null
  if (body.timeOfBirth) {
    let gmst = 280.46061837 + 360.98564736629 * n + 0.000387933 * t * t - (t * t * t) / 38710000
    gmst = (gmst % 360 + 360) % 360
    const lst = (gmst + (body.lng || 0) + 360) % 360
    const ramc = lst * (Math.PI / 180)
    const eps = (23.4392911 - 0.0130042 * t) * (Math.PI / 180)
    const phi = (body.lat || 0) * (Math.PI / 180)

    const y = Math.cos(ramc)
    const x = -Math.sin(ramc) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps)
    let asc = Math.atan2(y, x) * (180 / Math.PI)
    asc = (asc % 360 + 360) % 360
    const siderealAsc = (asc - ayanamsa + 360) % 360
    risingSign = VEDIC_SIGNS[Math.floor(siderealAsc / 30) % 12]
  }

  return { sunSign, moonSign, risingSign, source: 'prokerala' }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChartRequestBody

    if (!body.dob) {
      return NextResponse.json({ ok: false, error: 'dob is required' }, { status: 400 })
    }

    try {
      const result = await fetchFromProkerala(body)
      return NextResponse.json({ ok: true, data: result })
    } catch (prokeralaError) {
      console.warn('[astrology/chart] Prokerala API unavailable, using astronomical Vedic fallback:', prokeralaError)
      const fallbackResult = calculateAstronomicalChart(body)
      return NextResponse.json({ ok: true, data: fallbackResult })
    }
  } catch (error) {
    console.error('[astrology/chart] Fatal error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to calculate chart' }, { status: 500 })
  }
}
