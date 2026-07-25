'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'

const EMOTION_OPTIONS = [
  'calm',
  'hopeful',
  'anxious',
  'tired',
  'grateful',
  'tender',
  'angry',
  'restless',
  'peaceful',
  'heavy',
]

type CheckInForm = {
  consciousThoughts: string
  gratitude: string
  affirmationsDone: boolean
  routinesDone: boolean
  habitNote: string
  beliefNote: string
  journalNote: string
  emotions: string[]
  oneChange: string
  appreciation: string
}

const emptyForm: CheckInForm = {
  consciousThoughts: '',
  gratitude: '',
  affirmationsDone: false,
  routinesDone: false,
  habitNote: '',
  beliefNote: '',
  journalNote: '',
  emotions: [],
  oneChange: '',
  appreciation: '',
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="font-serif text-lg text-[hsl(var(--av-night))]">{label}</span>
      {hint && (
        <span className="block font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
          {hint}
        </span>
      )}
      {children}
    </label>
  )
}

const inputClass =
  'w-full min-h-[44px] rounded-xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] px-4 py-3 font-body text-base text-[hsl(var(--av-night))] placeholder:text-[hsl(var(--av-mute))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'
const textareaClass = `${inputClass} min-h-[96px] resize-y`

export default function CheckInPage() {
  const [form, setForm] = useState<CheckInForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [streakDays, setStreakDays] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/check-in')
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return
        setStreakDays(d.streakDays ?? 0)
        if (d.checkIn) {
          setCompleted(!!d.checkIn.completedAt)
          setForm({
            consciousThoughts: d.checkIn.consciousThoughts ?? '',
            gratitude: d.checkIn.gratitude ?? '',
            affirmationsDone: !!d.checkIn.affirmationsDone,
            routinesDone: !!d.checkIn.routinesDone,
            habitNote: d.checkIn.habitNote ?? '',
            beliefNote: d.checkIn.beliefNote ?? '',
            journalNote: d.checkIn.journalNote ?? '',
            emotions: d.checkIn.emotions ?? [],
            oneChange: d.checkIn.oneChange ?? '',
            appreciation: d.checkIn.appreciation ?? '',
          })
        }
      })
      .catch(() => setError("Could not load today's check-in."))
      .finally(() => setLoading(false))
  }, [])

  function toggleEmotion(emotion: string) {
    setForm((prev) => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter((e) => e !== emotion)
        : [...prev.emotions, emotion],
    }))
  }

  async function save(complete: boolean) {
    setSaving(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch('/api/dashboard/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, complete }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong.')
        return
      }
      setStreakDays(data.streakDays ?? streakDays)
      if (complete || data.checkIn?.completedAt) setCompleted(true)
      setSavedMsg(complete ? 'Check-in complete. Softly done.' : 'Draft saved.')
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Topbar title="Check-in" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="px-4 lg:px-8 py-10 md:py-14 max-w-xl mx-auto space-y-10 pb-24">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Daily ritual · under 5 min
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Arrive as you are
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
              A quiet check-in with yourself. No performance — only presence.
              {streakDays > 0 && (
                <span className="block mt-2 text-[hsl(var(--av-night))]">
                  {streakDays}-day streak
                </span>
              )}
            </p>
            {completed && (
              <p className="font-body text-sm text-[hsl(var(--av-gold))]">
                Today's ritual is complete. You can still revise below.
              </p>
            )}
          </header>

          {loading ? (
            <div className="h-40 rounded-2xl bg-[hsl(40_40%_97%)] animate-pulse" />
          ) : (
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault()
                void save(true)
              }}
            >
              <Field label="Conscious thoughts" hint="What is on your mind right now?">
                <textarea
                  className={textareaClass}
                  value={form.consciousThoughts}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, consciousThoughts: e.target.value }))
                  }
                  rows={3}
                />
              </Field>

              <Field label="Gratitude" hint="Name one thing you are grateful for.">
                <textarea
                  className={textareaClass}
                  value={form.gratitude}
                  onChange={(e) => setForm((f) => ({ ...f, gratitude: e.target.value }))}
                  rows={2}
                />
              </Field>

              <div className="space-y-4 border-t border-[hsl(var(--av-stone))] pt-8">
                <p className="font-serif text-lg text-[hsl(var(--av-night))]">Tick what you held</p>
                <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.affirmationsDone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, affirmationsDone: e.target.checked }))
                    }
                    className="h-5 w-5 rounded border-[hsl(var(--av-stone))] accent-[hsl(var(--av-gold))]"
                  />
                  <span className="font-body text-base text-[hsl(var(--av-night))]">
                    Affirmations
                  </span>
                </label>
                <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.routinesDone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, routinesDone: e.target.checked }))
                    }
                    className="h-5 w-5 rounded border-[hsl(var(--av-stone))] accent-[hsl(var(--av-gold))]"
                  />
                  <span className="font-body text-base text-[hsl(var(--av-night))]">
                    Morning / evening routine
                  </span>
                </label>
              </div>

              <Field label="Habit" hint="One habit you tended — or gently skipped.">
                <input
                  className={inputClass}
                  value={form.habitNote}
                  onChange={(e) => setForm((f) => ({ ...f, habitNote: e.target.value }))}
                />
              </Field>

              <Field label="Belief" hint="A belief you are practicing or questioning.">
                <input
                  className={inputClass}
                  value={form.beliefNote}
                  onChange={(e) => setForm((f) => ({ ...f, beliefNote: e.target.value }))}
                />
              </Field>

              <Field label="Journal whisper" hint="A short line — not a full entry.">
                <textarea
                  className={textareaClass}
                  value={form.journalNote}
                  onChange={(e) => setForm((f) => ({ ...f, journalNote: e.target.value }))}
                  rows={2}
                />
              </Field>

              <div className="space-y-3">
                <p className="font-serif text-lg text-[hsl(var(--av-night))]">Emotions</p>
                <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                  Tap what fits. More than one is welcome.
                </p>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_OPTIONS.map((emotion) => {
                    const on = form.emotions.includes(emotion)
                    return (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => toggleEmotion(emotion)}
                        className={`min-h-[40px] px-4 rounded-full font-body text-sm capitalize transition-colors ${
                          on
                            ? 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))]'
                            : 'border border-[hsl(var(--av-stone))] text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]'
                        }`}
                      >
                        {emotion}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Field label="One change" hint="One small shift you choose today.">
                <input
                  className={inputClass}
                  value={form.oneChange}
                  onChange={(e) => setForm((f) => ({ ...f, oneChange: e.target.value }))}
                />
              </Field>

              <Field label="Appreciation" hint="Who or what do you appreciate?">
                <textarea
                  className={textareaClass}
                  value={form.appreciation}
                  onChange={(e) => setForm((f) => ({ ...f, appreciation: e.target.value }))}
                  rows={2}
                />
              </Field>

              {error && (
                <p className="font-body text-sm text-[hsl(var(--av-rose))]" role="alert">
                  {error}
                </p>
              )}
              {savedMsg && (
                <p className="font-body text-sm text-[hsl(var(--av-night))]" role="status">
                  {savedMsg}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 min-h-[44px] items-center justify-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium disabled:opacity-60"
                >
                  {saving ? 'Saving…' : completed ? 'Update & keep' : 'Complete check-in'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save(false)}
                  className="inline-flex h-12 min-h-[44px] items-center justify-center px-6 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm disabled:opacity-60"
                >
                  Save draft
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 min-h-[44px] items-center justify-center px-4 font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
                >
                  Back to practice
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
