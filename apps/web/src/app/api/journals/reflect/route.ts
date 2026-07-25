import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { body, journalId } = await req.json()
    if (!body || body.trim().length < 5) {
      return NextResponse.json({ error: 'Write a longer entry to generate an AI reflection.' }, { status: 400 })
    }

    let reflectionText = ''

    // Attempt to connect to AHI Python microservice
    try {
      const response = await fetch('http://localhost:8000/ahi/pre-session-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: session.user.id,
          session_notes: [{ key_themes: body, practices: 'Reflection trigger' }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        reflectionText = data.brief || ''
      }
    } catch (e) {
      console.log('FastAPI AHI service offline, executing premium local fallback...')
    }

    // Local Rules-based Somatic NLP Fallback
    if (!reflectionText) {
      const text = body.toLowerCase()
      let tips: string[] = []

      if (text.includes('anxious') || text.includes('stress') || text.includes('scared') || text.includes('fear')) {
        tips.push('Nervous system state: Sympathetic arousal. Practice exhaling twice as long as you inhale (4:8 breath) to activate your vagus nerve.')
      }
      if (text.includes('tired') || text.includes('heavy') || text.includes('sad') || text.includes('grief')) {
        tips.push('Nervous system state: Dorsal vagal shutdown. Practice light hand chest tapping and gentle neck stretches to re-mobilize energy.')
      }
      if (text.includes('neck') || text.includes('shoulder') || text.includes('back') || text.includes('pain')) {
        tips.push('Physical tension is stored in your axial motor muscles. Do 3 cycles of rolling shoulder shrugs and gentle jaw release exercises.')
      }
      if (text.includes('food') || text.includes('eat') || text.includes('stomach') || text.includes('gut')) {
        tips.push('Somatic block in the Solar Plexus (Manipura). Rub your abdomen clockwise 10 times to stimulate digestion and center personal boundaries.')
      }

      const defaultTips = [
        'Somatic reflection: Center your attention on your breathing. Inhale safety, exhale tension.',
        'Observe where you hold tightness right now. Soften your jaw, drop your shoulders, and breathe into your belly.',
        'Integrate this reflection by drinking a glass of warm water and taking a 5-minute silent walking practice.'
      ]

      reflectionText = tips.length > 0
        ? tips.join('\n\n')
        : defaultTips.join('\n\n')
    }

    // If journalId is passed, update it immediately in database
    if (journalId) {
      const id = parseInt(journalId)
      if (!isNaN(id)) {
        await prisma.journal.update({
          where: { id, userId: session.user.id },
          data: { aiReflection: reflectionText },
        })
      }
    }

    return NextResponse.json({ success: true, reflection: reflectionText })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
