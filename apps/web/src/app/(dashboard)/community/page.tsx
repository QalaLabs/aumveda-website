import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Topbar from '../_components/Topbar'
import CircleRsvpButton from './_components/CircleRsvpButton'
import ChallengeCard from './_components/ChallengeCard'
import UpgradeButton from './_components/UpgradeButton'
import OnboardingChecklist from '@/components/community/OnboardingChecklist'

export const metadata = { title: 'Community | AUMVEDA' }

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  const session = await requireSession()
  const userId = session.user.id

  let communityMember = null as {
    tier: string
    joinedAt: Date
    circlesAttended: number
    challengesCompleted: number
  } | null
  let subscription = null as { plan: string; status: string } | null
  let upcomingCircles = [] as {
    id: string
    host: string
    topic: string
    scheduledAt: Date
    zoomLink: string
  }[]
  let challenges = [] as {
    id: string
    title: string
    durationDays: number
    profileTargets: string[]
    chakraTargets: string[]
    participations: { daysCompleted: number; completedAt: Date | null }[]
  }[]
  let todayDose = null as { title: string; promptText: string; durationSec: number } | null

  try {
    ;[communityMember, subscription, upcomingCircles, challenges, todayDose] = await Promise.all([
      prisma.communityMember.findUnique({
        where: { userId },
        select: { tier: true, joinedAt: true, circlesAttended: true, challengesCompleted: true },
      }),
      prisma.subscription.findUnique({
        where: { userId },
        select: { plan: true, status: true },
      }),
      prisma.liveCircle.findMany({
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: 'asc' },
        take: 6,
      }),
      prisma.challenge.findMany({
        orderBy: { startDate: 'desc' },
        take: 6,
        include: {
          participations: {
            where: { userId },
            select: { daysCompleted: true, completedAt: true },
          },
        },
      }),
      prisma.dailyDose.findFirst({
        where: { isActive: true, publishDate: { lte: new Date() } },
        orderBy: { publishDate: 'desc' },
        select: { title: true, promptText: true, durationSec: true },
      }),
    ])
  } catch (err) {
    console.error('[CommunityPage] failed to load community data', err)
  }

  const tier = subscription?.status === 'active' ? subscription.plan || 'paid' : communityMember?.tier ?? 'free'
  const isFreeTier = tier === 'free'

  const isNewMember = communityMember
    ? Date.now() - new Date(communityMember.joinedAt).getTime() < 7 * 86_400_000
    : true

  return (
    <>
      <Topbar />
      <main className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[720px] mx-auto px-6 py-10 md:py-14 space-y-14 pb-24">
          {/* Arrival */}
          <header className="space-y-2">
            <p className="font-body text-sm text-[hsl(var(--av-mute))]">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] text-balance">
              Community
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[46ch] leading-relaxed">
              Circles, challenges, and daily practice — shared with others on the same path.
            </p>
          </header>

          {/* Tier banner */}
          <section
            className={`rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 ${
              isFreeTier
                ? 'border border-[hsl(var(--av-stone))] bg-white/60'
                : 'bg-[hsl(var(--av-night))]'
            }`}
          >
            <div className="space-y-1.5">
              <p
                className={`font-body text-[11px] uppercase tracking-[0.22em] ${
                  isFreeTier ? 'text-[hsl(var(--av-gold))]' : 'text-[hsl(var(--av-gold-soft))]'
                }`}
              >
                Your membership
              </p>
              <h2
                className={`font-serif text-2xl capitalize ${
                  isFreeTier ? 'text-[hsl(var(--av-night))]' : 'text-[hsl(var(--av-parchment))]'
                }`}
              >
                {tier} tier
              </h2>
              <p
                className={`font-body text-sm leading-relaxed max-w-[42ch] ${
                  isFreeTier ? 'text-[hsl(var(--av-mute))]' : 'text-[hsl(var(--av-parchment)/0.75)]'
                }`}
              >
                {isFreeTier
                  ? 'Free members get today’s dose and limited circles. Upgrade for full access to every circle and challenge.'
                  : 'You have full access to every circle, challenge, and recorded practice.'}
              </p>
            </div>
            {isFreeTier ? <UpgradeButton /> : null}
          </section>

          {/* Onboarding checklist for new members */}
          {isNewMember ? <OnboardingChecklist /> : null}

          {/* Today's Daily Dose summary */}
          <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Today&apos;s Daily Dose
            </p>
            {todayDose ? (
              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-[hsl(var(--av-night))] text-balance max-w-[18ch]">
                  {todayDose.title}
                </h2>
                <p className="font-body text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                  {todayDose.promptText}
                </p>
                <p className="font-mono text-sm tabular text-[hsl(var(--av-mute))]">
                  {Math.max(1, Math.round(todayDose.durationSec / 60))} minutes
                </p>
              </div>
            ) : (
              <p className="font-body text-[hsl(var(--av-mute))]">
                No dose has been published yet today.
              </p>
            )}
          </section>

          {/* Reel of the day — placeholder */}
          <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Reel of the day
            </p>
            {/* TODO: wire this to the Reel model (see packages/db/prisma/schema.prisma)
                once video playback / Mux integration for the community feed is built.
                Pick the day's featured reel (e.g. published, most recent) and render
                a player here instead of this placeholder. */}
            <div className="aspect-video w-full max-w-[420px] rounded-3xl border border-dashed border-[hsl(var(--av-stone))] bg-white/40 flex flex-col items-center justify-center gap-2 text-center px-6">
              <span className="font-body text-xs uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                TODO
              </span>
              <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                Reel playback is not wired up yet.
              </p>
            </div>
          </section>

          {/* Upcoming live circles */}
          <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Upcoming live circles
            </p>
            {upcomingCircles.length ? (
              <ul className="space-y-0 divide-y divide-[hsl(var(--av-stone))]">
                {upcomingCircles.map((circle) => (
                  <li key={circle.id} className="py-5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-serif text-xl text-[hsl(var(--av-night))] truncate">
                        {circle.topic}
                      </p>
                      <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                        {new Date(circle.scheduledAt).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' · with '}
                        {circle.host}
                      </p>
                    </div>
                    <CircleRsvpButton circleId={circle.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-[hsl(var(--av-mute))]">
                No upcoming circles are scheduled right now.
              </p>
            )}
          </section>

          {/* Healing challenges */}
          <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Healing challenges
            </p>
            {challenges.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    durationDays={challenge.durationDays}
                    profileTargets={challenge.profileTargets}
                    chakraTargets={challenge.chakraTargets}
                    participation={
                      challenge.participations[0]
                        ? {
                            daysCompleted: challenge.participations[0].daysCompleted,
                            completedAt: challenge.participations[0].completedAt
                              ? challenge.participations[0].completedAt.toISOString()
                              : null,
                          }
                        : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="font-body text-[hsl(var(--av-mute))]">
                No challenges are open right now.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
