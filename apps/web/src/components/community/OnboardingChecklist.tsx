'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  label: string
  description: string
}

const ITEMS: ChecklistItem[] = [
  {
    id: 'welcome',
    label: 'Welcome to the circle',
    description: 'You have joined the AUMVEDA community — a space for shared healing.',
  },
  {
    id: 'daily-dose',
    label: 'Meet your Daily Dose',
    description: 'A short daily practice, chosen for where you are right now.',
  },
  {
    id: 'first-circle',
    label: 'Join your first Live Circle',
    description: 'RSVP to an upcoming session and practice alongside others.',
  },
  {
    id: 'challenge-enroll',
    label: 'Enroll in a healing challenge',
    description: 'Commit to a multi-day journey with a clear focus.',
  },
  {
    id: 'upgrade-offer',
    label: 'Explore membership',
    description: 'See what unlocks with a paid membership, whenever you are ready.',
  },
]

/**
 * 7-day community onboarding checklist. Component-local state only — no
 * persistence layer exists for this yet, so progress resets on reload.
 * Shown to members within their first 7 days (see CommunityMember.joinedAt
 * check in the community page).
 */
export default function OnboardingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const doneCount = Object.values(checked).filter(Boolean).length
  const total = ITEMS.length
  const percent = Math.round((doneCount / total) * 100)

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="rounded-3xl border border-[hsl(var(--av-stone))] bg-white/60 p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Your first 7 days
        </p>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-2xl text-[hsl(var(--av-night))]">
            Settling into community
          </h3>
          <span className="font-mono text-sm tabular text-[hsl(var(--av-mute))] flex-shrink-0">
            {doneCount}/{total}
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-[hsl(var(--av-stone))] overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
        >
          <div
            className="h-full rounded-full bg-[hsl(var(--av-gold))] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {ITEMS.map((item) => {
          const isDone = !!checked[item.id]
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={isDone}
                className="w-full flex items-start gap-3 text-left rounded-2xl px-3 py-3 -mx-3 transition-colors hover:bg-[hsl(40_40%_97%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isDone
                      ? 'bg-[hsl(var(--av-night))] border-[hsl(var(--av-night))]'
                      : 'border-[hsl(var(--av-mute))]'
                  }`}
                >
                  {isDone ? (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3 text-[hsl(var(--av-gold-soft))]"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8.5L6.5 12L13 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span className="space-y-0.5">
                  <span
                    className={`block font-body text-sm font-medium ${
                      isDone
                        ? 'text-[hsl(var(--av-mute))] line-through'
                        : 'text-[hsl(var(--av-night))]'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="block font-body text-xs text-[hsl(var(--av-mute))] leading-relaxed">
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
