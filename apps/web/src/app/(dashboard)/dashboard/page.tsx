import { requireSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../_components/Topbar'
import TodayDoseCard from './_components/TodayDoseCard'
import CosmicNoteCard, { StreakSummary } from './_components/CosmicNoteCard'

export const metadata = { title: 'Your Practice | AUMVEDA' }

const PROFILE_LABEL: Record<string, string> = {
  anxious_achiever: 'Anxious Achiever',
  wounded_warrior: 'Wounded Warrior',
  frozen_heart: 'Frozen Heart',
  lost_soul: 'Lost Soul',
  silent_sufferer: 'Silent Sufferer',
  awakening_one: 'Awakening One',
}

export default async function DashboardPage() {
  const session = await requireSession()
  const userId = session.user.id

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let profile = null as {
    progress: number | null
    streakDays: number | null
    onboardingDone: boolean
  } | null
  let todayDose = null as {
    id: number
    title: string
    durationSec: number
    promptText: string
  } | null
  let portalData = null as { profileResult: string | null; chakraSelected: string | null } | null
  let user = null as { name: string | null } | null
  let nextAppointment = null as {
    bookingDatetime: Date
    practitioner?: string | null
    zoomLink?: string | null
  } | null
  let recentJournals = [] as { id: number; title: string | null; createdAt: Date }[]
  let cosmicNote = null as { title: string; body: string; weekOf: Date } | null
  let todayCheckIn = null as { completedAt: Date | null } | null

  try {
    ;[
      profile,
      todayDose,
      portalData,
      user,
      nextAppointment,
      recentJournals,
      cosmicNote,
      todayCheckIn,
    ] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        select: { progress: true, streakDays: true, onboardingDone: true },
      }),
      prisma.dailyDose.findFirst({
        where: { isActive: true, publishDate: { lte: new Date() } },
        orderBy: { publishDate: 'desc' },
        select: { id: true, title: true, durationSec: true, promptText: true },
      }),
      prisma.userPortalData.findUnique({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      }),
      prisma.booking.findFirst({
        where: {
          userId,
          bookingDatetime: { gte: new Date() },
          status: { in: ['pending', 'confirmed'] },
        },
        orderBy: { bookingDatetime: 'asc' },
      }),
      prisma.journal.findMany({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.cosmicNote.findFirst({
        where: { isPublished: true },
        orderBy: [{ publishedAt: 'desc' }, { weekOf: 'desc' }],
        select: { title: true, body: true, weekOf: true },
      }),
      prisma.dailyCheckIn.findUnique({
        where: { userId_date: { userId, date: today } },
        select: { completedAt: true },
      }),
    ])
  } catch {
    // Local preview without DB — show empty sanctuary shell
    profile = { progress: 42, streakDays: 3, onboardingDone: true }
    user = { name: session.user.name ?? 'Dev Client' }
    cosmicNote = {
      title: "This Week's Cosmic Weather",
      body: 'A quiet week for nervous-system softness. Lean into breath, journaling, and one small daily dose.',
      weekOf: today,
    }
  }

  if (profile && !profile.onboardingDone) {
    redirect('/onboarding/step-1')
  }

  const firstName = user?.name?.split(' ')[0] || session.user.name?.split(' ')[0] || 'friend'
  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const profileLabel = PROFILE_LABEL[portalData?.profileResult || ''] || null
  const chakraLabel = portalData?.chakraSelected
    ? portalData.chakraSelected.replace(/_/g, ' ')
    : null

  return (
    <>
      <Topbar />
      <main className="min-h-screen bg-[hsl(var(--av-parchment))]">
        <div className="max-w-[720px] mx-auto px-6 py-10 md:py-14 space-y-10">
          <header className="space-y-1">
            <p className="font-body text-sm text-[hsl(var(--av-mute))]">{dateLabel}</p>
            <h1 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))]">
              {firstName}, your practice is ready.
            </h1>
          </header>

          <CosmicNoteCard note={cosmicNote} />

          <StreakSummary
            streakDays={profile?.streakDays ?? 0}
            checkInDone={!!todayCheckIn?.completedAt}
            progress={profile?.progress ?? 0}
          />

          {todayDose ? (
            <TodayDoseCard dose={todayDose} />
          ) : (
            <section className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-8 md:p-10 space-y-4">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Today&apos;s practice
              </p>
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                Your first dose arrives after the portal.
              </h2>
              <p className="font-body text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                Complete your healing profile so Archana and Sejal can prepare a practice shaped for
                you.
              </p>
              <Link
                href="/step-1"
                className="inline-flex h-12 items-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium"
              >
                Begin Your Journey
              </Link>
            </section>
          )}

          <section className="space-y-6 border-t border-[hsl(var(--av-stone))] pt-10">
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]">
              Alongside
            </p>

            <div className="space-y-0 divide-y divide-[hsl(var(--av-stone))]">
              {nextAppointment ? (
                <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-body text-sm text-[hsl(var(--av-mute))]">Next session</p>
                    <p className="font-serif text-lg text-[hsl(var(--av-night))] mt-0.5">
                      {new Date(nextAppointment.bookingDatetime).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="font-body text-sm text-[hsl(var(--av-mute))] capitalize mt-0.5">
                      with {nextAppointment.practitioner}
                    </p>
                  </div>
                  {nextAppointment.zoomLink ? (
                    <a
                      href={nextAppointment.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center px-5 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
                    >
                      Join
                    </a>
                  ) : (
                    <Link
                      href="/dashboard/appointments"
                      className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
                    >
                      View appointments
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-body text-sm text-[hsl(var(--av-mute))]">Discovery Call</p>
                    <p className="font-serif text-lg text-[hsl(var(--av-night))] mt-0.5">
                      Ready when you are
                    </p>
                  </div>
                  <Link
                    href="/dashboard/appointments"
                    className="inline-flex h-10 items-center px-5 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
                  >
                    Book
                  </Link>
                </div>
              )}

              <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">Homework</p>
                  <p className="font-serif text-lg text-[hsl(var(--av-night))] mt-0.5">
                    Between sessions
                  </p>
                </div>
                <Link
                  href="/dashboard/homework"
                  className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
                >
                  Open
                </Link>
              </div>

              <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">Journal</p>
                  <p className="font-serif text-lg text-[hsl(var(--av-night))] mt-0.5">
                    {recentJournals[0]
                      ? recentJournals[0].title || 'Continue reflecting'
                      : 'How do you feel?'}
                  </p>
                </div>
                <Link
                  href={
                    recentJournals[0]
                      ? `/dashboard/journal/${recentJournals[0].id}`
                      : '/dashboard/journal'
                  }
                  className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
                >
                  {recentJournals[0] ? 'Open' : 'Write'}
                </Link>
              </div>

              {(profileLabel || chakraLabel || (profile?.streakDays ?? 0) > 0) && (
                <div className="py-5 space-y-3">
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">Your map</p>
                  <ul className="flex flex-wrap gap-2">
                    {profileLabel && (
                      <li className="font-body text-xs px-3 py-1.5 rounded-full bg-[hsl(40_40%_97%)] border border-[hsl(var(--av-stone))] text-[hsl(var(--av-night))]">
                        {profileLabel}
                      </li>
                    )}
                    {chakraLabel && (
                      <li className="font-body text-xs px-3 py-1.5 rounded-full bg-[hsl(40_40%_97%)] border border-[hsl(var(--av-stone))] text-[hsl(var(--av-night))] capitalize">
                        {chakraLabel}
                      </li>
                    )}
                    {(profile?.streakDays ?? 0) > 0 && (
                      <li className="font-body text-xs px-3 py-1.5 rounded-full bg-[hsl(40_40%_97%)] border border-[hsl(var(--av-stone))] text-[hsl(var(--av-night))] tabular">
                        {profile?.streakDays} day streak
                      </li>
                    )}
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/dashboard/journey"
                      className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
                    >
                      My journey
                    </Link>
                    <Link
                      href="/dashboard/progress"
                      className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
                    >
                      See progress
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
