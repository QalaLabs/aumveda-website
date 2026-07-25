import { requireSession } from '@/lib/session'
import { notFound } from 'next/navigation'
import { prisma } from '@aumveda/db'
import Topbar from '../../../_components/Topbar'
import JournalEditor from '../_components/JournalEditor'
import Link from 'next/link'

export const metadata = { title: 'Journal Entry | AUMVEDA' }

export default async function JournalDetailPage({ params }: { params: { id: string } }) {
  const session = await requireSession()

  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const journal = await prisma.journal.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      title: true,
      body: true,
      mood: true,
      tags: true,
      voiceNoteUrl: true,
      aiReflection: true,
      practitionerVisible: true,
      createdAt: true,
    },
  })
  if (!journal) notFound()

  return (
    <>
      <Topbar title={journal.title ?? 'Journal Entry'} />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-8 md:py-12 max-w-2xl mx-auto space-y-6">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link
              href="/dashboard/journal"
              className="inline-flex h-11 min-h-[44px] items-center font-body text-sm text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
            >
              ← Journal
            </Link>
            <span className="text-[hsl(var(--av-stone))]" aria-hidden>
              /
            </span>
            <time
              dateTime={new Date(journal.createdAt).toISOString()}
              className="font-body text-sm text-[hsl(var(--av-mute))]"
            >
              {new Date(journal.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </nav>
          <div className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-6 md:p-8">
            <JournalEditor
              initialData={{
                id: journal.id,
                title: journal.title,
                body: journal.body,
                mood: journal.mood,
                tags: journal.tags as string[],
                voiceNoteUrl: journal.voiceNoteUrl,
                aiReflection: journal.aiReflection,
                practitionerVisible: journal.practitionerVisible,
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}
