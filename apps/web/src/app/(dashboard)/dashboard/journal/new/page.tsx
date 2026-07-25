import { requireSession } from '@/lib/session'
import Topbar from '../../../_components/Topbar'
import JournalEditor from '../_components/JournalEditor'
import Link from 'next/link'

export const metadata = { title: 'New Journal Entry | AUMVEDA' }

export default async function NewJournalPage() {
  await requireSession()

  return (
    <>
      <Topbar title="New Entry" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-8 md:py-12 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/journal"
              className="inline-flex h-11 min-h-[44px] items-center font-body text-sm text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
            >
              ← Back
            </Link>
          </div>
          <header className="space-y-1 border-b border-[hsl(var(--av-stone))] pb-6">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              New entry
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] text-balance">
              How do I feel?
            </h1>
          </header>
          <div className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-6 md:p-8">
            <JournalEditor />
          </div>
        </div>
      </main>
    </>
  )
}
