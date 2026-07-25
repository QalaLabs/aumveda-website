import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'
import DoseRitual from './_components/DoseRitual'

export const metadata = { title: 'Daily Dose | AUMVEDA' }

export default async function DosePage() {
  const session = await requireSession()
  const userId = session.user.id

  let todayDose = null as {
    id: number
    title: string
    promptText: string
    durationSec: number
  } | null
  let completions: { id: number; completedAt: Date; doseId: number }[] = []
  let alreadyComplete = false

  try {
    todayDose = await prisma.dailyDose.findFirst({
      where: { isActive: true, publishDate: { lte: new Date() } },
      orderBy: { publishDate: 'desc' },
      select: { id: true, title: true, promptText: true, durationSec: true },
    })
    completions = await prisma.dailyDoseCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
      select: { id: true, completedAt: true, doseId: true },
    })
    if (todayDose) {
      alreadyComplete = completions.some((c) => c.doseId === todayDose!.id)
    }
  } catch {
    todayDose = null
  }

  return (
    <>
      <Topbar title="Daily Dose" />
      <main className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[640px] mx-auto px-6 py-10 md:py-14 space-y-12 pb-24">
          <Link
            href="/dashboard"
            className="inline-block font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
          >
            Back to sanctuary
          </Link>

          {todayDose ? (
            <DoseRitual
              dose={{
                id: todayDose.id,
                title: todayDose.title,
                promptText: todayDose.promptText,
                durationSec: todayDose.durationSec,
                alreadyComplete,
              }}
            />
          ) : (
            <section className="space-y-4 py-8">
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                No practice assigned yet
              </h2>
              <p className="font-body text-[hsl(var(--av-mute))] leading-relaxed max-w-[50ch]">
                When your Daily Dose is ready, it will appear here — one clear practice, nothing
                more.
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
                Recently held
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
