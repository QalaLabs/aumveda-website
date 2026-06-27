import { NextRequest, NextResponse } from 'next/server'

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dob, timeOfBirth, lat, lng } = body

    // In production: call Prokerala Astrology API here
    // const response = await fetch('https://api.prokerala.com/astrology/chart', { ... })
    // For now, return random signs as placeholder
    await new Promise(r => setTimeout(r, 500))

    const result = {
      sunSign: SIGNS[Math.floor(Math.random() * 12)],
      moonSign: SIGNS[Math.floor(Math.random() * 12)],
      risingSign: timeOfBirth ? SIGNS[Math.floor(Math.random() * 12)] : null,
    }

    return NextResponse.json({ ok: true, data: result })
  } catch (error) {
    console.error('Astrology API error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to calculate chart' }, { status: 500 })
  }
}
