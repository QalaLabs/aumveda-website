import { requireSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../_components/Topbar'
import TodayDoseCard from './_components/TodayDoseCard'
import CosmicNoteCard, { QuietGrounding } from './_components/CosmicNoteCard'

export const metadata = { title: 'Your Sanctuary | AUMVEDA' }

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

  return (
    <>
      <Topbar />
      <main className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[720px] mx-auto px-6 py-10 md:py-14 space-y-14 pb-24">
          {/* Arrival */}
          <header className="space-y-2">
            <p className="font-body text-sm text-[hsl(var(--av-mute))]">{dateLabel}</p>
            <h1 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] text-balance">
              Welcome back, {firstName}.
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[40ch] leading-relaxed">
              Your private healing space. One practice. Soft pace.
            </p>
          </header>

          {/* Cosmic Weather — emotional anchor */}
          <CosmicNoteCard note={cosmicNote} />

          {/* Grounding */}
          <QuietGrounding checkInDone={!!todayCheckIn?.completedAt} />

          {/* Today’s Dose — hero */}
          {todayDose ? (
            <TodayDoseCard dose={todayDose} />
          ) : (
            <section className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-12">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Today&apos;s practice
              </p>
              <h2 className="font-serif text-3xl text-[hsl(var(--av-night))] text-balance">
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

          {/* Reflection + secondary */}
          <section className="space-y-0 divide-y divide-[hsl(var(--av-stone))] border-t border-[hsl(var(--av-stone))]">
            <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-body text-sm text-[hsl(var(--av-mute))]">Reflection</p>
                <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-0.5">
                  {recentJournals[0]
                    ? recentJournals[0].title || 'Continue reflecting'
                    : 'How do you feel?'}
                </p>
              </div>
              <Link
                href={
                  recentJournals[0]
                    ? `/dashboard/journal/${recentJournals[0].id}`
                    : '/dashboard/journal/new'
                }
                className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
              >
                {recentJournals[0] ? 'Open' : 'Write'}
              </Link>
            </div>

            {nextAppointment ? (
              <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">Next session</p>
                  <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-0.5">
                    {new Date(nextAppointment.bookingDatetime).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {nextAppointment.practitioner ? (
                    <p className="font-body text-sm text-[hsl(var(--av-mute))] capitalize mt-0.5">
                      with {nextAppointment.practitioner}
                    </p>
                  ) : null}
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
                    View sessions
                  </Link>
                )}
              </div>
            ) : (
              <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">Sessions</p>
                  <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-0.5">
                    Held when you are ready
                  </p>
                </div>
                <Link
                  href="/dashboard/appointments"
                  className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
                >
                  Open
                </Link>
              </div>
            )}

            <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-body text-sm text-[hsl(var(--av-mute))]">Practice</p>
                <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-0.5">
                  Guidance between sessions
                </p>
              </div>
              <Link
                href="/dashboard/homework"
                className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
              >
                Open
              </Link>
            </div>

            <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-body text-sm text-[hsl(var(--av-mute))]">Journey</p>
                <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-0.5">
                  Your living story
                </p>
              </div>
              <Link
                href="/dashboard/journey"
                className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))]"
              >
                Open
              </Link>
            </div>
          </section>

          {/* Belonging / hope */}
          <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] text-balance leading-snug max-w-[28ch] pt-4">
            You belong here. Return tomorrow — the space will wait.
          </p>
        </div>
      </main>
    </>
  )
}
