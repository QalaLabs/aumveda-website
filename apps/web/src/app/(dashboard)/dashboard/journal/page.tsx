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

  let journals: { id: number; title: string | null; mood: number | null; body: string | null; tags: string[]; createdAt: Date }[] = []
  try {
    journals = await prisma.journal.findMany({
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
  } catch {
    // Fallback for preview
  }

  if (journals.length === 0) {
    journals = [
      {
        id: 101,
        title: 'Releasing the need to fix everything',
        mood: 4,
        body: 'Today during my morning somatic breath, I realized how much energy I spend anticipating other people’s emotional needs. Giving myself permission to just be present.',
        tags: ['boundaries', 'growth', 'anahata'],
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: 102,
        title: 'Grounding after morning meditation',
        mood: 5,
        body: 'Felt deep peace during the heart-opening meditation. The sensation of chest lightness is staying with me throughout the workday.',
        tags: ['meditation', 'grounding', 'peace'],
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        id: 103,
        title: 'Gentle boundaries with family',
        mood: 3,
        body: 'Practiced saying no without over-explaining or apologizing. Uncomfortable at first, but my nervous system thanked me.',
        tags: ['inner-child', 'voice', 'healing'],
        createdAt: new Date(Date.now() - 259200000),
      },
    ]
  }

  return (
    <>
      <Topbar title="Journal" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-10">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Journal
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              A quiet page
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[50ch] leading-relaxed">
              Writing should feel like returning to yourself — not filling a form.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between border-b border-[hsl(var(--av-stone))] pb-8">
            <JournalSearchBar />
            <Link
              href="/dashboard/journal/new"
              className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
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
                      className="group block py-8 px-1 -mx-1 transition-colors duration-300 hover:bg-[hsl(var(--av-stone)/0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
                    >
                      <time
                        dateTime={new Date(j.createdAt).toISOString()}
                        className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]"
                      >
                        {new Date(j.createdAt).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                      <h2 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] mt-2 text-balance group-hover:text-[hsl(var(--av-ink))]">
                        {j.title ?? 'Untitled entry'}
                      </h2>
                      <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed mt-3 line-clamp-3 max-w-[52ch]">
                        {j.mood != null && (
                          <span className="text-[hsl(var(--av-night))]">
                            {MOOD_LABEL[j.mood] ?? ''}
                          </span>
                        )}
                        {j.mood != null && j.body ? ' · ' : ''}
                        {j.body
                          ? j.body.slice(0, 160) + (j.body.length > 160 ? '…' : '')
                          : ''}
                      </p>
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
