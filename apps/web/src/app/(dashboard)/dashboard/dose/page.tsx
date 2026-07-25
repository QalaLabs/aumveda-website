import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'

export const metadata = { title: 'Daily Dose | AUMVEDA' }

export default async function DosePage() {
  const session = await requireSession()
  const userId = session.user.id

  const [todayDose, completions] = await Promise.all([
    prisma.dailyDose.findFirst({
      where: { isActive: true, publishDate: { lte: new Date() } },
      orderBy: { publishDate: 'desc' },
      select: { id: true, title: true, promptText: true, durationSec: true, audioKey: true },
    }),
    prisma.dailyDoseCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
    }),
  ])

  const mins = todayDose ? Math.max(1, Math.round(todayDose.durationSec / 60)) : 0

  return (
    <>
      <Topbar title="Daily Dose" />
      <main className="min-h-screen bg-[hsl(var(--av-parchment))]">
        <div className="max-w-[640px] mx-auto px-6 py-10 md:py-14 space-y-12">
          <Link
            href="/dashboard"
            className="inline-block font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
          >
            Back
          </Link>

          {todayDose ? (
            <article className="space-y-10">
              <header className="space-y-4">
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                  Regulation → action
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] leading-tight text-balance">
                  {todayDose.title}
                </h2>
                <p className="font-mono text-sm tabular text-[hsl(var(--av-mute))]">{mins} minutes</p>
                <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
                  {todayDose.promptText}
                </p>
              </header>

              {/* Practice control — calm, one action */}
              <div className="rounded-2xl bg-[hsl(var(--av-night))] p-8 space-y-6">
                <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.7)]">
                  Press play when you are ready. There is no streak pressure — only presence.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Play today's practice audio"
                    className="w-14 h-14 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] flex items-center justify-center transition-transform duration-100 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold-soft))]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </button>
                  <div>
                    <p className="font-body text-sm text-[hsl(var(--av-parchment))]">Practice audio</p>
                    <p className="font-mono text-xs tabular text-[hsl(var(--av-gold-soft))] mt-0.5">
                      0:00 / {mins}:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[hsl(var(--av-stone))] pt-8 space-y-3">
                <p className="font-serif text-xl text-[hsl(var(--av-night))]">How do you feel?</p>
                <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                  After the practice, a short reflection helps the body remember what regulated feels like.
                </p>
                <Link
                  href="/dashboard/journal/new"
                  className="inline-flex h-11 items-center px-6 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
                >
                  Open journal
                </Link>
              </div>
            </article>
          ) : (
            <section className="space-y-4 py-8">
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">No practice assigned yet</h2>
              <p className="font-body text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                When your Daily Dose is ready, it will appear here — one clear practice, nothing more.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm"
              >
                Return home
              </Link>
            </section>
          )}

          {completions.length > 0 && (
            <section className="border-t border-[hsl(var(--av-stone))] pt-10 space-y-4">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]">
                Recent completions
              </h3>
              <ul className="divide-y divide-[hsl(var(--av-stone))]">
                {completions.map((comp) => (
                  <li
                    key={comp.id}
                    className="py-3 flex justify-between gap-4 font-body text-sm text-[hsl(var(--av-night))]"
                  >
                    <span>Practice completed</span>
                    <span className="font-mono text-xs tabular text-[hsl(var(--av-mute))]">
                      {new Date(comp.completedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
