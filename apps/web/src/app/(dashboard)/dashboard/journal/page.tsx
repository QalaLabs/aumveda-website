import { requireSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import Topbar from '../../_components/Topbar'
import Link from 'next/link'
import JournalSearchBar from './_components/JournalSearchBar'

export const metadata = { title: 'Journal | AUMVEDA' }

const MOOD_LABEL: Record<number, string> = {
  5: 'Great',
  4: 'Good',
  3: 'Okay',
  2: 'Low',
  1: 'Difficult',
}

export default async function JournalListPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await requireSession()
  const search = searchParams.search || ''

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
          { tags: { has: search.toLowerCase().replace(/\s+/g, '-') } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, mood: true, body: true, tags: true, createdAt: true },
  })

  return (
    <>
      <Topbar title="Journal" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-10">
          <header className="space-y-2">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Journal
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              How do I feel?
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[50ch] leading-relaxed">
              A quiet place to notice what is present.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <JournalSearchBar />
            <Link
              href="/dashboard/journal/new"
              className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            >
              New entry
            </Link>
          </div>

          {journals.length === 0 ? (
            <section
              aria-labelledby="journal-empty-heading"
              className="border-t border-[hsl(var(--av-stone))] pt-12 pb-4 text-center space-y-5"
            >
              <h2
                id="journal-empty-heading"
                className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance"
              >
                {search ? 'Nothing matched' : 'Begin with a few lines'}
              </h2>
              <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[40ch] mx-auto leading-relaxed">
                {search
                  ? 'Try a different word, or clear the search to see all entries.'
                  : 'Writing even briefly can soften what you carry. There is no right way—only honesty.'}
              </p>
              {!search && (
                <Link
                  href="/dashboard/journal/new"
                  className="inline-flex h-12 min-h-[44px] items-center justify-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]"
                >
                  Write your first entry
                </Link>
              )}
            </section>
          ) : (
            <section aria-label="Journal entries">
              <ul className="divide-y divide-[hsl(var(--av-stone))] border-t border-b border-[hsl(var(--av-stone))]">
                {journals.map((j) => (
                  <li key={j.id}>
                    <Link
                      href={`/dashboard/journal/${j.id}`}
                      className="group flex items-start gap-4 py-5 px-1 -mx-1 transition-colors duration-[var(--duration-ui)] hover:bg-[hsl(var(--av-stone)/0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
                    >
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h2 className="font-serif text-lg text-[hsl(var(--av-night))] truncate group-hover:text-[hsl(var(--av-ink))]">
                            {j.title ?? 'Untitled entry'}
                          </h2>
                          <time
                            dateTime={new Date(j.createdAt).toISOString()}
                            className="font-body text-xs text-[hsl(var(--av-mute))] flex-shrink-0 tabular"
                          >
                            {new Date(j.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </time>
                        </div>
                        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed line-clamp-2">
                          {j.mood != null && (
                            <span className="text-[hsl(var(--av-ink-text))]">
                              {MOOD_LABEL[j.mood] ?? ''}
                            </span>
                          )}
                          {j.mood != null && j.body ? ' · ' : ''}
                          {j.body
                            ? j.body.slice(0, 100) + (j.body.length > 100 ? '…' : '')
                            : ''}
                        </p>
                        {(j.tags as string[])?.length > 0 && (
                          <p className="font-body text-xs text-[hsl(var(--av-mute))] pt-1">
                            {(j.tags as string[])
                              .slice(0, 3)
                              .map((tag) => `#${tag}`)
                              .join('  ')}
                          </p>
                        )}
                      </div>
                      <span
                        aria-hidden
                        className="font-body text-[hsl(var(--av-mute))] mt-1 group-hover:text-[hsl(var(--av-gold))] transition-colors"
                      >
                        →
                      </span>
                    </Link>
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
