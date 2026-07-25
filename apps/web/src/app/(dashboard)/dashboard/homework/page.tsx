'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'

type HomeworkItem = {
  id: string
  title: string
  description: string | null
  status: string
  assignedAt: string
  dueAt: string | null
  submissionText: string | null
  submissionUrl: string | null
  submittedAt: string | null
  reviewNote: string | null
  reviewedAt: string | null
}

const STATUS_ORDER = ['assigned', 'submitted', 'reviewed'] as const

const STATUS_LABEL: Record<string, string> = {
  assigned: 'Offered',
  submitted: 'Shared',
  reviewed: 'Received',
}

export default function HomeworkPage() {
  const [items, setItems] = useState<HomeworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/homework')
      const data = await res.json()
      if (data.success) setItems(data.items ?? [])
    } catch {
      setError('Could not load practice.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function submit(id: string) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          submissionText: text || null,
          submissionUrl: url || null,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not share.')
        return
      }
      setActiveId(null)
      setText('')
      setUrl('')
      await load()
    } catch {
      setError('Could not share. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const byStatus = STATUS_ORDER.map((status) => ({
    status,
    items: items.filter((i) => i.status === status),
  }))

  return (
    <>
      <Topbar title="Practice" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-2xl mx-auto space-y-12 pb-24">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Between sessions
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Your practice
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[50ch] leading-relaxed">
              Guidance from your healers — integration, not assignment. Share a reflection when you
              are ready.
            </p>
          </header>

          {error && (
            <p className="font-body text-sm text-[hsl(var(--av-rose))]" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <div className="h-32 rounded-sm bg-[hsl(var(--av-stone)/0.35)] animate-pulse" />
          ) : items.length === 0 ? (
            <section className="border-t border-[hsl(var(--av-stone))] pt-10 space-y-4 text-center">
              <h2 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                Nothing offered yet
              </h2>
              <p className="font-body text-[hsl(var(--av-mute))] max-w-[40ch] mx-auto leading-relaxed">
                After your next session, practices will appear here. Until then, your daily check-in
                is enough.
              </p>
              <Link
                href="/dashboard/check-in"
                className="inline-flex h-12 items-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm"
              >
                Today&apos;s check-in
              </Link>
            </section>
          ) : (
            <div className="space-y-12">
              {byStatus.map(
                ({ status, items: group }) =>
                  group.length > 0 && (
                    <section key={status} className="space-y-5">
                      <h2 className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]">
                        {STATUS_LABEL[status]}
                      </h2>
                      <ul className="divide-y divide-[hsl(var(--av-stone))] border-t border-[hsl(var(--av-stone))]">
                        {group.map((item) => (
                          <li key={item.id} className="py-6 space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-serif text-xl text-[hsl(var(--av-night))]">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                              {item.dueAt && (
                                <p className="font-body text-xs text-[hsl(var(--av-mute))]">
                                  Hold by{' '}
                                  {new Date(item.dueAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </p>
                              )}
                            </div>

                            {item.status === 'assigned' && (
                              <div className="space-y-3">
                                {activeId === item.id ? (
                                  <div className="space-y-3 border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-5">
                                    <textarea
                                      placeholder="Your reflection…"
                                      value={text}
                                      onChange={(e) => setText(e.target.value)}
                                      rows={3}
                                      className="w-full rounded-sm border border-[hsl(var(--av-stone))] bg-transparent px-3 py-2 font-body text-sm text-[hsl(var(--av-night))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                                    />
                                    <input
                                      type="url"
                                      placeholder="Or a link (optional)"
                                      value={url}
                                      onChange={(e) => setUrl(e.target.value)}
                                      className="w-full min-h-[44px] rounded-sm border border-[hsl(var(--av-stone))] bg-transparent px-3 py-2 font-body text-sm text-[hsl(var(--av-night))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                                    />
                                    <div className="flex gap-3">
                                      <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => void submit(item.id)}
                                        className="inline-flex h-11 items-center px-5 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium disabled:opacity-60"
                                      >
                                        {submitting ? 'Sharing…' : 'Share reflection'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveId(null)
                                          setText('')
                                          setUrl('')
                                        }}
                                        className="font-body text-sm text-[hsl(var(--av-mute))]"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveId(item.id)
                                      setText('')
                                      setUrl('')
                                    }}
                                    className="inline-flex h-10 items-center px-5 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
                                  >
                                    Offer response
                                  </button>
                                )}
                              </div>
                            )}

                            {(item.submissionText || item.submissionUrl) && (
                              <div className="space-y-1 font-body text-sm text-[hsl(var(--av-mute))]">
                                {item.submissionText && <p>{item.submissionText}</p>}
                                {item.submissionUrl && (
                                  <a
                                    href={item.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 text-[hsl(var(--av-night))]"
                                  >
                                    {item.submissionUrl}
                                  </a>
                                )}
                              </div>
                            )}

                            {item.reviewNote && (
                              <p className="font-body text-sm text-[hsl(var(--av-night))] border-l-2 border-[hsl(var(--av-gold))] pl-4 leading-relaxed">
                                {item.reviewNote}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
