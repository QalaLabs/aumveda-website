import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'

const AYUSH_BASE_NOTICE =
  'Aumveda Base Insights and daily practices represent traditional yogic, somatic, and polyvagal wellness education rooted in AYUSH principles. They do not constitute clinical psychiatric or medical diagnosis, prescription, or treatment.'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const userId = body.userId || session?.user?.id || 'guest_portal_seeker'
    const portalData = body.portalData || {}
    const telemetry = body.telemetry || { dwell_times_ms: {}, hesitation_count: 0, backtrack_steps: [] }
    const astrologyContext = body.astrologyContext || {}

    // If user is authenticated and no astrology context provided, pull birth chart details from DB
    if (session?.user?.id && !astrologyContext.moon_sign) {
      try {
        const userDb = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            moonSign: true,
            sunSign: true,
            risingSign: true,
            dominantChakra: true,
          },
        })
        if (userDb) {
          astrologyContext.moon_sign = userDb.moonSign || 'Aries'
          astrologyContext.sun_sign = userDb.sunSign || 'Leo'
          astrologyContext.rising_sign = userDb.risingSign || 'Capricorn'
        }
      } catch (dbErr) {
        console.warn('Could not read user astrological metadata:', dbErr)
      }
    }

    const payload = {
      user_id: userId,
      portal_data: {
        chakra_selected: portalData.chakraSelected || portalData.chakra || 'Solar Plexus',
        archetype_selected: portalData.archetypeSelected || portalData.archetype || 'The Anxious Achiever',
        tarot_card: portalData.tarotCard || 'The Hermit',
        tarot_theme: portalData.tarotTheme || 'Introspection',
        intention_text: portalData.intentionText || 'Restoring nervous system balance and authentic clarity',
        answers: portalData.answers || {},
        scores: portalData.scores || {},
        profile_result: portalData.profileResult || 'anxious_achiever',
      },
      telemetry: {
        dwell_times_ms: telemetry.dwell_times_ms || telemetry.dwellTimes || {},
        hesitation_count: telemetry.hesitation_count || telemetry.hesitations || 0,
        backtrack_steps: telemetry.backtrack_steps || telemetry.backtracks || [],
        total_assessment_duration_sec: telemetry.total_assessment_duration_sec || telemetry.durationSec || 180,
      },
      astrology_context: {
        moon_sign: astrologyContext.moon_sign || 'Aries',
        sun_sign: astrologyContext.sun_sign || 'Leo',
        rising_sign: astrologyContext.rising_sign || 'Capricorn',
        current_mahadasha: astrologyContext.current_mahadasha || 'Saturn',
        current_antardasha: astrologyContext.current_antardasha || 'Rahu',
      },
    }

    const ahiUrl = process.env.AHI_URL || 'http://localhost:8000'
    let reportData = null

    try {
      const ahiResponse = await fetch(`${ahiUrl}/ahi/diagnostic-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10s timeout
      })

      if (ahiResponse.ok) {
        reportData = await ahiResponse.json()
      } else {
        console.warn(`AHI returned status ${ahiResponse.status}, activating local synthesis fallback...`)
      }
    } catch (netErr) {
      console.warn('AHI microservice connection failed, activating Next.js local synthesis fallback:', netErr)
    }

    // Local Synthesis Fallback if AHI is offline
    if (!reportData) {
      const answers = payload.portal_data.answers as Record<string, any>
      const dwellTimes = payload.telemetry.dwell_times_ms as Record<string, number>
      const mood = String(answers.q1_mood || answers.mood || 'Stable').toLowerCase()
      const stress = String(answers.q2_stress_response || answers.stress_response || 'Shutdown').toLowerCase()
      const isConflicted =
        (mood.includes('stable') || mood.includes('good')) &&
        (stress.includes('shutdown') || stress.includes('freeze') || stress.includes('hyperarousal'))

      const longDwells = Object.entries(dwellTimes).filter(([_, ms]) => ms >= 8000)

      reportData = {
        user_id: userId,
        ambiguity_detected: isConflicted || longDwells.length > 0,
        conflict_score: isConflicted ? 0.78 : 0.35,
        primary_dissonance_theme: isConflicted
          ? 'Intellectualized Composure Masking Autonomic Freeze'
          : 'Grounded Alignment with Subtle Relational Hesitation',
        subconscious_conflicts: isConflicted
          ? [
              {
                domain: 'Conscious Composure vs Autonomic Reality',
                conscious_assertion: `Rated mood as '${mood.charAt(0).toUpperCase() + mood.slice(1)}'`,
                somatic_reality: `Nervous system indicator reveals '${stress.charAt(0).toUpperCase() + stress.slice(1)}' response`,
                hesitation_indicator: 'Cognitive effort expended to present stability despite internal depletion',
                clarification:
                  'Your prefrontal cortex has learned to articulate calmness to maintain safety, while your body holds an unexpressed survival load.',
              },
            ]
          : [
              {
                domain: 'Pacing vs Output',
                conscious_assertion: 'Seeking sustainable vitality',
                somatic_reality: 'Nervous system desires deep parasympathetic deceleration',
                hesitation_indicator: 'Brief hesitation around personal boundaries',
                clarification: 'Your body is asking for somatic permission to soften before making further commitments.',
              },
            ],
        dwell_time_insights: longDwells.map(
          ([k, ms]) =>
            `Elevated latency (${(ms / 1000).toFixed(1)}s) on '${k}' reflects subconscious cognitive filtering and protective resistance.`
        ),
        ayush_base_insights:
          'Your bio-energetic assessment demonstrates a classic high-functioning adaptation: strong mental discipline paired with somatic nervous exhaustion. Under AYUSH wellness principles, healing begins by down-regulating the sympathetic nervous branch and establishing somatic safety through breath and sound.',
        recommended_bucket: isConflicted ? 'Vagus Nerve Reset' : 'Somatic Tremoring',
        recommended_modality: isConflicted ? 'vagus_nerve_reset' : 'somatic_tremoring',
        curated_starter_exercise: {
          title: '3-Min Suboccipital Eye Gaze Reset',
          slug: 'vagus-reset-ocular-suboccipital-3min',
          modality: 'vagus_nerve_reset',
          duration_minutes: 3,
          frequency: {
            frequency_hz: 432,
            frequency_name: '432 Hz Alpha Wave Resonance',
            duration_seconds: 180,
          },
          instruction:
            'Interlace fingers behind the occiput at base of skull. Gaze with eyes only to far right for 60 seconds until a yawn or involuntary sigh occurs.',
          affirmation: 'My nervous system recognizes true safety; I can gently re-enter the room.',
          cbt_reframe: 'Numbness is not failure; it is my dorsal vagal system attempting to shield me from overwhelm.',
          micro_habit: 'Gently trace the outer rim of your earlobes in circular motions for 30 seconds.',
        },
        practitioner_brief_cue:
          'Seeker presents with cognitive masking. Prioritize suboccipital release and gentle grounding before cognitive inquiry.',
        compliance_disclaimer: AYUSH_BASE_NOTICE,
      }
    }

    // Persist diagnostic synthesis summary to UserPortalData if user is logged in
    if (session?.user?.id) {
      try {
        await prisma.userPortalData.upsert({
          where: { userId: session.user.id },
          update: {
            profileResult: reportData.primary_dissonance_theme,
            portalCompletedAt: new Date(),
          },
          create: {
            userId: session.user.id,
            chakraSelected: payload.portal_data.chakra_selected,
            archetypeSelected: payload.portal_data.archetype_selected,
            tarotCard: payload.portal_data.tarot_card,
            tarotTheme: payload.portal_data.tarot_theme,
            intentionText: payload.portal_data.intention_text,
            profileResult: reportData.primary_dissonance_theme,
            portalCompletedAt: new Date(),
          },
        })
      } catch (saveErr) {
        console.warn('Could not persist diagnostic summary to user_portal_data:', saveErr)
      }
    }

    return NextResponse.json({
      success: true,
      report: reportData,
    })
  } catch (error: any) {
    console.error('Error generating diagnostic report:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate diagnostic report',
        details: error?.message || String(error),
      },
      { status: 500 }
    )
  }
}
