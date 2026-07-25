import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'

export const metadata = { title: 'My Journey | AUMVEDA' }

const PROFILE_LABEL: Record<string, string> = {
  anxious_achiever: 'Anxious Achiever',
  wounded_warrior: 'Wounded Warrior',
  frozen_heart: 'Frozen Heart',
  lost_soul: 'Lost Soul',
  silent_sufferer: 'Silent Sufferer',
  awakening_one: 'Awakening One',
}

const Q_LABELS: { key: keyof PortalAnswers; label: string }[] = [
  { key: 'q1Answer', label: 'Sleep' },
  { key: 'q2Answer', label: 'Mood' },
  { key: 'q3Answer', label: 'Stress response' },
  { key: 'q4Answer', label: 'Relationships' },
  { key: 'q5Answer', label: 'Money' },
  { key: 'q6Answer', label: 'Parents' },
  { key: 'q7Answer', label: 'Childhood' },
]

type PortalAnswers = {
  q1Answer: string | null
  q2Answer: string | null
  q3Answer: string | null
  q4Answer: string | null
  q5Answer: string | null
  q6Answer: string | null
  q7Answer: string | null
}

function JourneyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-5 space-y-1.5">
      <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
        {label}
      </p>
      <p className="font-serif text-lg md:text-xl text-[hsl(var(--av-night))] leading-snug whitespace-pre-wrap">
        {value}
      </p>
    </div>
  )
}

export default async function JourneyPage() {
  const session = await requireSession()
  const userId = session.user.id

  let portalData = null as Awaited<
    ReturnType<typeof prisma.userPortalData.findUnique>
  >
  try {
    portalData = await prisma.userPortalData.findUnique({ where: { userId } })
  } catch {
    portalData = null
  }

  const intention = portalData?.intentionText?.trim() || null
  const why =
    intention ||
    (portalData?.profileResult
      ? `You arrived as ${PROFILE_LABEL[portalData.profileResult] || portalData.profileResult}.`
      : null)

  const currentIdealParts: string[] = []
  if (portalData?.chakraSelected) {
    currentIdealParts.push(
      `Current focus: ${portalData.chakraSelected.replace(/_/g, ' ')} chakra`
    )
  }
  if (portalData?.archetypeSelected) {
    currentIdealParts.push(`Archetype: ${portalData.archetypeSelected}`)
  }
  if (portalData?.tarotCard) {
    currentIdealParts.push(
      `Tarot: ${portalData.tarotCard}${portalData.tarotTheme ? ` · ${portalData.tarotTheme.replace(/_/g, ' ')}` : ''}`
    )
  }
  const currentToIdeal = currentIdealParts.length > 0 ? currentIdealParts.join('\n') : null

  const answeredQs = Q_LABELS.filter((q) => portalData?.[q.key])
  const hasAnything =
    !!why ||
    !!currentToIdeal ||
    answeredQs.length > 0 ||
    !!portalData?.profileResult ||
    !!portalData?.nervousSystemScore

  return (
    <>
      <Topbar title="My Journey" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-10 pb-24">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              My journey
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Why you began
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[52ch] leading-relaxed">
              Your portal answers, held gently — intention, map, and the path from where you were to
              where you are tending toward.
            </p>
          </header>

          {!hasAnything ? (
            <section className="border-t border-[hsl(var(--av-stone))] pt-10 space-y-5 text-center">
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                Your story starts in the portal
              </h2>
              <p className="font-body text-[hsl(var(--av-mute))] max-w-[42ch] mx-auto leading-relaxed">
                Complete the healing profile and your intention, chakra, and pattern answers will
                live here.
              </p>
              <Link
                href="/step-1"
                className="inline-flex h-12 items-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium"
              >
                Begin the portal
              </Link>
            </section>
          ) : (
            <section className="divide-y divide-[hsl(var(--av-stone))] border-t border-[hsl(var(--av-stone))]">
              {why && <JourneyRow label="Why / intention" value={why} />}
              {currentToIdeal && (
                <JourneyRow label="Current → ideal" value={currentToIdeal} />
              )}
              {portalData?.profileResult && (
                <JourneyRow
                  label="Pattern profile"
                  value={
                    PROFILE_LABEL[portalData.profileResult] ||
                    portalData.profileResult.replace(/_/g, ' ')
                  }
                />
              )}
              {(portalData?.nervousSystemScore ||
                portalData?.relationshipScore ||
                portalData?.childhoodScore ||
                portalData?.financialScore) && (
                <div className="py-5 space-y-3">
                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                    Dimension scores
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {[
                      ['Nervous system', portalData.nervousSystemScore],
                      ['Relationship', portalData.relationshipScore],
                      ['Childhood', portalData.childhoodScore],
                      ['Financial', portalData.financialScore],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <li
                          key={label as string}
                          className="font-body text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--av-stone))] text-[hsl(var(--av-night))]"
                        >
                          {label}: {(value as string).replace(/_/g, ' ')}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              {answeredQs.length > 0 && (
                <div className="py-5 space-y-4">
                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                    Pattern answers
                  </p>
                  <ul className="space-y-3">
                    {answeredQs.map(({ key, label }) => (
                      <li key={key} className="font-body text-sm text-[hsl(var(--av-night))]">
                        <span className="text-[hsl(var(--av-mute))]">{label} · </span>
                        {portalData?.[key]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {portalData?.portalCompletedAt && (
                <p className="py-5 font-body text-sm text-[hsl(var(--av-mute))]">
                  Portal completed{' '}
                  {new Date(portalData.portalCompletedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </section>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard/progress"
              className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
            >
              Progress & badges
            </Link>
            <Link
              href="/dashboard"
              className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              Back to practice
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
