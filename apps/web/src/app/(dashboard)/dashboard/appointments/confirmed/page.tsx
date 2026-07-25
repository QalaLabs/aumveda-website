import { Suspense } from 'react'
import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../../../_components/Topbar'
import { buildBookingIcs } from '@/lib/ics'

export const metadata = { title: 'Booking confirmed | AUMVEDA' }

const PRACTITIONER_LABEL: Record<string, string> = {
  sejal: 'Sejal Jain',
  archana: 'Archana Jain',
}

function Unavailable({ reason }: { reason: 'missing' | 'forbidden' | 'cancelled' }) {
  const copy =
    reason === 'cancelled'
      ? 'This booking was cancelled. If that was unexpected, contact us and we will help.'
      : reason === 'forbidden'
        ? 'This confirmation belongs to another account. Sign in with the email used at booking.'
        : 'We could not find this confirmation. It may be incomplete or the link may have expired.'

  return (
    <>
      <Topbar title="Confirmation" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[640px] mx-auto px-6 py-14 space-y-6 pb-24">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
            Sessions
          </p>
          <h1 className="font-serif text-3xl text-[hsl(var(--av-night))] text-balance">
            Confirmation unavailable
          </h1>
          <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
            {copy}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard/appointments"
              className="inline-flex h-12 items-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm"
            >
              View sessions
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center px-6 font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              Sanctuary home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

async function ConfirmedInner({
  bookingId,
  emailPending,
}: {
  bookingId: string
  emailPending: boolean
}) {
  const session = await requireSession()
  const userId = session.user.id

  // Owner-only: never leak existence of another user's booking
  const owned = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  })

  if (!owned) {
    const existsElsewhere = await prisma.booking.findFirst({
      where: { id: bookingId },
      select: { id: true },
    })
    return <Unavailable reason={existsElsewhere ? 'forbidden' : 'missing'} />
  }

  if (owned.status === 'cancelled') {
    return <Unavailable reason="cancelled" />
  }

  const practitionerName = PRACTITIONER_LABEL[owned.practitioner] || owned.practitioner
  const whenIst = new Date(owned.bookingDatetime).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  })
  const whenLocal = new Date(owned.bookingDatetime).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const ics = buildBookingIcs({
    uid: owned.id,
    title: `AUMVEDA Discovery Call with ${practitionerName}`,
    description: `Private Discovery Call. Manage via Sessions in your sanctuary.`,
    start: new Date(owned.bookingDatetime),
    durationMinutes: owned.durationMinutes,
    attendeeEmail: session.user.email || 'guest@aumveda.com',
    attendeeName: session.user.name || undefined,
  })
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
  const mailSubject = encodeURIComponent(`Reschedule Discovery Call · ${owned.id}`)
  const mailBody = encodeURIComponent(
    `Hello AUMVEDA,\n\nI would like to reschedule or cancel my Discovery Call (${whenIst}).\nBooking ID: ${owned.id}\n\nThank you.`
  )
  const contactMail = `mailto:sessions@aumveda.com?subject=${mailSubject}&body=${mailBody}`

  return (
    <>
      <Topbar title="Confirmed" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[640px] mx-auto px-6 py-10 md:py-14 space-y-12 pb-24">
          <header className="space-y-4">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Discovery Call
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance leading-tight">
              You are reserved
            </h1>
            {emailPending ? (
              <p
                className="font-body text-base text-[hsl(var(--av-night))] leading-relaxed max-w-[50ch] border border-[hsl(var(--av-gold)/0.4)] bg-[hsl(var(--av-gold)/0.08)] rounded-xl px-4 py-3"
                role="status"
              >
                Your booking is confirmed. The confirmation email could not be sent just now —
                download the calendar invite below, or check Sessions. We will follow up if needed.
              </p>
            ) : (
              <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
                A confirmation email with a calendar invite is on its way
                {session.user.email ? ` to ${session.user.email}` : ''}.
              </p>
            )}
          </header>

          <section className="border-y border-[hsl(var(--av-stone))] py-8 space-y-6">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                With
              </p>
              <p className="font-serif text-2xl text-[hsl(var(--av-night))] mt-1">{practitionerName}</p>
            </div>
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                When · IST
              </p>
              <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-1">{whenIst}</p>
              <p className="font-body text-sm text-[hsl(var(--av-mute))] mt-2">
                Your local clock · {whenLocal}
              </p>
            </div>
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                Duration
              </p>
              <p className="font-body text-base text-[hsl(var(--av-night))] mt-1">
                {owned.durationMinutes} minutes · free · confidential
              </p>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">What happens next</h2>
            <ol className="space-y-5">
              {[
                'Add the calendar invite from your email (or download below).',
                'We send a join link closer to the hour.',
                'Arrive in a quiet private space — your portal profile already informs the call.',
                'Afterward: a clear next step, with no pressure.',
              ].map((line, i) => (
                <li key={line} className="flex gap-4">
                  <span className="font-mono text-sm tabular text-[hsl(var(--av-gold))] pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed">
                    {line}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-3 border-t border-[hsl(var(--av-stone))] pt-8">
            <h2 className="font-serif text-xl text-[hsl(var(--av-night))]">Privacy & changes</h2>
            <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
              What you share stays between you and your practitioner. India-hosted. Cancel or
              reschedule free of charge until 24 hours before — use the link below or reply to your
              confirmation email.
            </p>
          </section>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <a
              href={icsHref}
              download="aumveda-discovery-call.ics"
              className="inline-flex h-12 items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm"
            >
              Download calendar invite
            </a>
            <a
              href={contactMail}
              className="inline-flex h-12 items-center justify-center px-6 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
            >
              Reschedule or cancel
            </a>
            <Link
              href="/dashboard/appointments"
              className="inline-flex h-12 items-center justify-center px-6 font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              View all sessions
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center px-6 font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              Enter sanctuary
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

function ConfirmedFallback() {
  return (
    <>
      <Topbar title="Confirmed" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))]">
        <div className="max-w-[640px] mx-auto px-6 py-16">
          <p className="font-body text-sm text-[hsl(var(--av-mute))]">Loading confirmation…</p>
        </div>
      </main>
    </>
  )
}

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: { bookingId?: string; email?: string }
}) {
  const bookingId = searchParams.bookingId?.trim()
  if (!bookingId) {
    return <Unavailable reason="missing" />
  }

  return (
    <Suspense fallback={<ConfirmedFallback />}>
      <ConfirmedInner bookingId={bookingId} emailPending={searchParams.email === 'pending'} />
    </Suspense>
  )
}
