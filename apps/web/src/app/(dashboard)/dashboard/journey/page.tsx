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

type Milestone = {
  when: string
  label: string
  body: string
}

export default async function JourneyPage() {
  const session = await requireSession()
  const userId = session.user.id

  let portalData = null as Awaited<ReturnType<typeof prisma.userPortalData.findUnique>>
  let recentCompletions: { completedAt: Date; dose: { title: string } }[] = []
  let recentJournals: { createdAt: Date; title: string | null; body: string | null }[] = []

  try {
    ;[portalData, recentCompletions, recentJournals] = await Promise.all([
      prisma.userPortalData.findUnique({ where: { userId } }),
      prisma.dailyDoseCompletion.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: { dose: { select: { title: true } } },
      }),
      prisma.journal.findMany({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { createdAt: true, title: true, body: true },
      }),
    ])
  } catch {
    portalData = null
  }

  const milestones: Milestone[] = []

  if (portalData?.portalCompletedAt || portalData?.intentionText || portalData?.profileResult) {
    const when = portalData.portalCompletedAt
      ? new Date(portalData.portalCompletedAt).toLocaleDateString('en-IN', {
          month: 'short',
          year: 'numeric',
        })
      : 'Beginning'
    milestones.push({
      when,
      label: 'Why I began',
      body:
        portalData.intentionText?.trim() ||
        (portalData.profileResult
          ? `I arrived as ${PROFILE_LABEL[portalData.profileResult] || portalData.profileResult}.`
          : 'I stepped into the portal seeking a softer way home.'),
    })
  }

  if (portalData?.chakraSelected || portalData?.archetypeSelected || portalData?.tarotCard) {
    const parts: string[] = []
    if (portalData.chakraSelected) {
      parts.push(`${portalData.chakraSelected.replace(/_/g, ' ')} chakra`)
    }
    if (portalData.archetypeSelected) parts.push(portalData.archetypeSelected)
    if (portalData.tarotCard) {
      parts.push(
        `${portalData.tarotCard}${
          portalData.tarotTheme ? ` · ${portalData.tarotTheme.replace(/_/g, ' ')}` : ''
        }`
      )
    }
    milestones.push({
      when: 'Map',
      label: 'Where I am',
      body: parts.join(' · '),
    })
  }

  if (portalData?.profileResult) {
    milestones.push({
      when: 'Pattern',
      label: 'What I carry',
      body: PROFILE_LABEL[portalData.profileResult] || portalData.profileResult.replace(/_/g, ' '),
    })
  }

  for (const c of recentCompletions) {
    milestones.push({
      when: new Date(c.completedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      label: 'Practice',
      body: c.dose.title,
    })
  }

  for (const j of recentJournals) {
    milestones.push({
      when: new Date(j.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      label: 'Reflection',
      body: j.title || (j.body ? j.body.slice(0, 120) + (j.body.length > 120 ? '…' : '') : 'A quiet entry'),
    })
  }

  const hasAnything = milestones.length > 0

  return (
    <>
      <Topbar title="My Journey" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-12 pb-24">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              My journey
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              A living story
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[52ch] leading-relaxed">
              Milestones from your portal, practices, and reflections — not a form dump. Your path,
              held in time.
            </p>
          </header>

          {!hasAnything ? (
            <section className="border-t border-[hsl(var(--av-stone))] pt-10 space-y-5 text-center">
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                Your story starts in the portal
              </h2>
              <p className="font-body text-[hsl(var(--av-mute))] max-w-[42ch] mx-auto leading-relaxed">
                Complete the healing profile and your intention, map, and early practices will live
                here as a timeline.
              </p>
              <Link
                href="/step-1"
                className="inline-flex h-12 items-center px-8 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-base font-medium"
              >
                Begin the portal
              </Link>
            </section>
          ) : (
            <ol className="relative border-l border-[hsl(var(--av-stone))] ml-2 space-y-0">
              {milestones.map((m, i) => (
                <li key={`${m.label}-${m.when}-${i}`} className="relative pl-8 py-6">
                  <span
                    className="absolute left-[-5px] top-8 w-2.5 h-2.5 rounded-full bg-[hsl(var(--av-gold))]"
                    aria-hidden
                  />
                  <p className="font-mono text-xs tabular text-[hsl(var(--av-mute))]">{m.when}</p>
                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))] mt-2">
                    {m.label}
                  </p>
                  <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] mt-2 leading-snug text-balance max-w-[36ch]">
                    {m.body}
                  </p>
                </li>
              ))}
            </ol>
          )}

          <div className="flex flex-wrap gap-4 pt-2 border-t border-[hsl(var(--av-stone))]">
            <Link
              href="/dashboard/progress"
              className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
            >
              Who I am becoming
            </Link>
            <Link
              href="/dashboard"
              className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              Back to sanctuary
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
