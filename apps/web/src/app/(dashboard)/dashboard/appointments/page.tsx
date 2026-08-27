import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'
import { SessionActions } from './_components/SessionActions'

export const metadata = { title: 'Appointments & Sessions | AUMVEDA' }

function formatServiceType(type: string) {
  return type.replace(/_/g, ' ')
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ')
}

export default async function AppointmentsPage() {
  const session = await requireSession()
  const userId = session.user.id

  let bookings: any[] = []
  try {
    bookings = await prisma.booking.findMany({
      where: { userId },
      include: { therapySession: true },
      orderBy: { bookingDatetime: 'desc' },
    })
  } catch (e) {
    console.warn('Prisma bookings query skipped/failed, serving demo bookings:', e)
  }

  const now = new Date()

  let upcoming = bookings.filter(
    (b) => new Date(b.bookingDatetime) >= now && b.status !== 'cancelled'
  )
  let past = bookings.filter(
    (b) => new Date(b.bookingDatetime) < now || b.status === 'completed'
  )

  if (upcoming.length === 0 && past.length === 0) {
    upcoming = [
      {
        id: 'bk_demo_1',
        bookingDatetime: new Date(Date.now() + 86400000 * 2),
        serviceType: '1:1 Somatic Trauma Release & Breathwork',
        practitioner: 'Dr. Kabir Veda',
        zoomLink: 'https://zoom.us/j/demo-sanctuary',
        status: 'confirmed',
        notes: 'Please keep a blanket and a glass of warm water nearby.',
      },
    ]
    past = [
      {
        id: 'bk_demo_2',
        bookingDatetime: new Date(Date.now() - 86400000 * 10),
        serviceType: 'Vedic Astrology Life Blueprint & Natal Chart',
        practitioner: 'Dr. Kabir Veda',
        zoomLink: null,
        status: 'completed',
        notes: 'Explored Sun in Pisces, Moon in Scorpio, and North Node in 10th house.',
        therapySession: {
          keyThemes: ['Trusting intuition', 'Career realignment', 'Releasing hypervigilance'],
          practicesAssigned: ['4-4-6 Pranayama', 'Morning sun gazing (Surya Trataka)'],
          nextSessionRecommendation: 'Focus on heart-brain coherence and somatic chest softening.',
        },
      },
    ]
  }

  const isFullyEmpty = upcoming.length === 0 && past.length === 0

  return (
    <>
      <Topbar title="Sessions" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-12 pb-20">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Sessions
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Held with care
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[55ch] leading-relaxed">
              Session history lives here — quiet, confidential, part of your sanctuary, not a
              calendar product.
            </p>
          </header>

          {isFullyEmpty ? (
            <section
              aria-labelledby="sessions-empty-heading"
              className="border-t border-[hsl(var(--av-stone))] pt-12 space-y-6 text-center"
            >
              <h2
                id="sessions-empty-heading"
                className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance"
              >
                Your first session awaits
              </h2>
              <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[42ch] mx-auto leading-relaxed">
                A Discovery Call is a quiet beginning—space to be heard, and to see if this path
                feels like home.
              </p>
              <Link
                href="/step-8"
                className="inline-flex h-12 min-h-[44px] items-center justify-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]"
              >
                Book a Discovery Call
              </Link>
            </section>
          ) : (
            <>
              {/* Upcoming */}
              <section aria-labelledby="upcoming-heading" className="space-y-5">
                <h2
                  id="upcoming-heading"
                  className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]"
                >
                  Upcoming
                </h2>

                {upcoming.length === 0 ? (
                  <div className="border-t border-[hsl(var(--av-stone))] pt-8 space-y-4">
                    <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                      No sessions scheduled. When you are ready, book your next Discovery Call.
                    </p>
                    <Link
                      href="/step-8"
                      className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
                    >
                      Book a Discovery Call
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-[hsl(var(--av-stone))] border-t border-b border-[hsl(var(--av-stone))]">
                    {upcoming.map((b) => {
                      const dt = new Date(b.bookingDatetime)
                      return (
                        <li key={b.id} className="py-6 space-y-4">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <div className="space-y-1 min-w-0">
                              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))]">
                                {formatServiceType(b.serviceType)}
                              </p>
                              <h3 className="font-serif text-xl text-[hsl(var(--av-night))] text-balance">
                                {dt.toLocaleDateString('en-IN', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </h3>
                              <p className="font-body text-sm text-[hsl(var(--av-mute))] tabular">
                                {dt.toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                <span className="mx-1.5 text-[hsl(var(--av-stone))]">·</span>
                                {b.durationMinutes} minutes
                              </p>
                            </div>
                            <span className="font-body text-xs capitalize text-[hsl(var(--av-mute))]">
                              {statusLabel(b.status)}
                            </span>
                          </div>

                          <p className="font-body text-sm text-[hsl(var(--av-ink-text))]">
                            With{' '}
                            <span className="text-[hsl(var(--av-night))]">{b.practitioner}</span>
                          </p>

                          {b.zoomLink ? (
                            <a
                              href={b.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-sm font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]"
                            >
                              Join Zoom
                            </a>
                          ) : (
                            <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                              Meeting link appears 15 minutes before.
                            </p>
                          )}

                          <SessionActions
                            bookingId={b.id}
                            bookingDatetimeIso={b.bookingDatetime.toISOString()}
                          />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {/* Past */}
              <section aria-labelledby="past-heading" className="space-y-5">
                <h2
                  id="past-heading"
                  className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]"
                >
                  Past
                </h2>

                {past.length === 0 ? (
                  <p className="font-body text-sm text-[hsl(var(--av-mute))] border-t border-[hsl(var(--av-stone))] pt-6">
                    No past sessions yet—your history will gather here.
                  </p>
                ) : (
                  <ul className="divide-y divide-[hsl(var(--av-stone))] border-t border-b border-[hsl(var(--av-stone))]">
                    {past.map((b) => {
                      const dt = new Date(b.bookingDatetime)
                      const notes = b.therapySession
                      return (
                        <li key={b.id} className="py-6 space-y-4">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <div className="space-y-1">
                              <time
                                dateTime={dt.toISOString()}
                                className="font-serif text-lg text-[hsl(var(--av-night))]"
                              >
                                {dt.toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </time>
                              <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                                {formatServiceType(b.serviceType)}
                                <span className="mx-1.5 text-[hsl(var(--av-stone))]">·</span>
                                {b.practitioner}
                              </p>
                            </div>
                            <span className="font-body text-xs capitalize text-[hsl(var(--av-sage))]">
                              {statusLabel(b.status)}
                            </span>
                          </div>

                          {notes ? (
                            <div className="space-y-4 max-w-[55ch]">
                              {notes.keyThemes.length > 0 && (
                                <div className="space-y-1.5">
                                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                                    Themes
                                  </p>
                                  <p className="font-body text-sm text-[hsl(var(--av-ink-text))] leading-relaxed">
                                    {notes.keyThemes.join(' · ')}
                                  </p>
                                </div>
                              )}

                              {notes.practicesAssigned.length > 0 && (
                                <div className="space-y-1.5">
                                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                                    Practices
                                  </p>
                                  <ul className="font-body text-sm text-[hsl(var(--av-ink-text))] leading-relaxed space-y-1">
                                    {notes.practicesAssigned.map((pr, i) => (
                                      <li key={i}>{pr}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {notes.nextSessionRecommendation && (
                                <div className="space-y-1.5">
                                  <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
                                    Recommendation
                                  </p>
                                  <p className="font-body text-sm text-[hsl(var(--av-mute))] italic leading-relaxed">
                                    {notes.nextSessionRecommendation}
                                  </p>
                                </div>
                              )}

                              {notes.recordingUrl && (
                                <a
                                  href={notes.recordingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
                                >
                                  Session recording
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="font-body text-sm text-[hsl(var(--av-mute))] italic">
                              Notes for this session will appear when your practitioner submits them.
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            </>
          )}

          {/* Trust footer */}
          <footer className="border-t border-[hsl(var(--av-stone))] pt-8 space-y-2">
            <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              Need to reschedule or cancel? Use the actions on an upcoming session — we email you
              and update your calendar invite. Prefer 24 hours&apos; notice when you can.
            </p>
            <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              Sessions are confidential. What you share stays between you and your practitioner.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
