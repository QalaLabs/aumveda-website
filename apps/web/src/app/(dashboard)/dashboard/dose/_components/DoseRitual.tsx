'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Phase = 'arrive' | 'practice' | 'reflect' | 'complete'

interface DoseRitualProps {
  dose: {
    id: number
    title: string
    promptText: string
    durationSec: number
    alreadyComplete?: boolean
  }
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function DoseRitual({ dose }: DoseRitualProps) {
  const mins = Math.max(1, Math.round(dose.durationSec / 60))
  const [phase, setPhase] = useState<Phase>(dose.alreadyComplete ? 'complete' : 'arrive')
  const [focus, setFocus] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [breathOn, setBreathOn] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startPractice = () => {
    setFocus(true)
    setPhase('practice')
    setElapsed(0)
    stopTimer()
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= dose.durationSec) {
          stopTimer()
          setPhase('reflect')
          return dose.durationSec
        }
        return e + 1
      })
    }, 1000)
  }

  const exitFocus = () => {
    stopTimer()
    setFocus(false)
    if (phase === 'practice') setPhase('arrive')
  }

  const markComplete = async () => {
    setCompleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/daily-dose/${dose.id}/complete`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not save completion.')
        return
      }
      setPhase('complete')
      setFocus(false)
      stopTimer()
    } catch {
      setError('Could not save. Try again when ready.')
    } finally {
      setCompleting(false)
    }
  }

  const shell = (
    <div
      className={
        focus
          ? 'fixed inset-0 z-50 bg-[hsl(var(--av-night))] text-[hsl(var(--av-parchment))] flex flex-col'
          : 'space-y-10'
      }
    >
      {focus ? (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--av-parchment)/0.12)]">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-gold))]">
            Focus
          </p>
          <button
            type="button"
            onClick={exitFocus}
            className="font-body text-sm text-[hsl(var(--av-parchment)/0.7)] underline underline-offset-4"
          >
            Exit
          </button>
        </div>
      ) : null}

      <div
        className={
          focus
            ? 'flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-12 max-w-[640px] mx-auto w-full'
            : 'space-y-10'
        }
      >
        {!focus ? (
          <header className="space-y-4">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Daily dose
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] leading-tight text-balance">
              {dose.title}
            </h2>
            <p className="font-mono text-sm tabular text-[hsl(var(--av-mute))]">{mins} minutes</p>
            <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              {dose.promptText}
            </p>
          </header>
        ) : (
          <header className="text-center space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight text-balance text-[hsl(var(--av-gold-soft))]">
              {dose.title}
            </h2>
            <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.65)] max-w-[40ch] mx-auto leading-relaxed">
              {dose.promptText}
            </p>
          </header>
        )}

        {/* Breathing orb */}
        {(phase === 'practice' || (focus && phase === 'arrive')) && (
          <div className="flex flex-col items-center gap-6" aria-live="polite">
            <div
              className={`w-28 h-28 rounded-full border border-[hsl(var(--av-gold)/0.45)] ${
                breathOn && !reducedMotion ? 'animate-av-breathe' : ''
              }`}
              style={{
                background: focus
                  ? 'hsl(var(--av-gold) / 0.12)'
                  : 'hsl(var(--av-gold) / 0.08)',
              }}
              aria-hidden
            />
            <p
              className={`font-body text-sm ${
                focus ? 'text-[hsl(var(--av-parchment)/0.7)]' : 'text-[hsl(var(--av-mute))]'
              }`}
            >
              {phase === 'practice' ? 'Breathe with the rhythm. No rush.' : 'When ready, begin.'}
            </p>
          </div>
        )}

        {phase === 'arrive' && !dose.alreadyComplete && (
          <div
            className={
              focus
                ? 'space-y-6 text-center'
                : 'rounded-sm bg-[hsl(var(--av-night))] p-8 md:p-10 space-y-6 text-[hsl(var(--av-parchment))]'
            }
          >
            <p
              className={`font-body text-sm leading-relaxed max-w-[48ch] ${
                focus ? 'mx-auto text-[hsl(var(--av-parchment)/0.7)]' : 'text-[hsl(var(--av-parchment)/0.7)]'
              }`}
            >
              Press play when you are ready. Everything else can wait. Presence only.
            </p>
            <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <button
                type="button"
                onClick={startPractice}
                aria-label="Begin today's practice"
                className="w-14 h-14 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] flex items-center justify-center transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold-soft))]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
              {!focus ? (
                <button
                  type="button"
                  onClick={() => {
                    setFocus(true)
                  }}
                  className="font-body text-sm text-[hsl(var(--av-gold-soft))] underline underline-offset-4"
                >
                  Enter quiet space first
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setBreathOn((b) => !b)}
              className="font-body text-xs text-[hsl(var(--av-parchment)/0.5)] underline underline-offset-4"
            >
              {breathOn ? 'Still the breath cue' : 'Show breath cue'}
            </button>
          </div>
        )}

        {phase === 'practice' && (
          <div className="text-center space-y-4">
            <p
              className={`font-mono text-2xl tabular ${
                focus ? 'text-[hsl(var(--av-gold-soft))]' : 'text-[hsl(var(--av-night))]'
              }`}
            >
              {formatTime(elapsed)} / {formatTime(dose.durationSec)}
            </p>
            <button
              type="button"
              onClick={() => {
                stopTimer()
                setPhase('reflect')
              }}
              className={`font-body text-sm underline underline-offset-4 ${
                focus ? 'text-[hsl(var(--av-parchment)/0.7)]' : 'text-[hsl(var(--av-mute))]'
              }`}
            >
              I am ready to reflect
            </button>
          </div>
        )}

        {phase === 'reflect' && (
          <div
            className={`space-y-6 ${focus ? 'text-center text-[hsl(var(--av-parchment))]' : ''}`}
          >
            <h3
              className={`font-serif text-2xl ${
                focus ? 'text-[hsl(var(--av-gold-soft))]' : 'text-[hsl(var(--av-night))]'
              }`}
            >
              How does the body feel?
            </h3>
            <p
              className={`font-body text-sm leading-relaxed max-w-[48ch] ${
                focus
                  ? 'mx-auto text-[hsl(var(--av-parchment)/0.7)]'
                  : 'text-[hsl(var(--av-mute))]'
              }`}
            >
              No score. No streak pressure. When you feel complete, rest here — then journal if you
              wish.
            </p>
            {error ? (
              <p className="font-body text-sm text-[hsl(var(--av-rose))]" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              disabled={completing}
              onClick={() => void markComplete()}
              className={`inline-flex h-12 items-center px-8 rounded-full font-body text-sm ${
                focus
                  ? 'bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))]'
                  : 'bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))]'
              } disabled:opacity-60`}
            >
              {completing ? 'Holding…' : 'Complete practice'}
            </button>
          </div>
        )}

        {phase === 'complete' && (
          <div className="space-y-6 border-t border-[hsl(var(--av-stone))] pt-10">
            <h3 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] text-balance">
              Soft landing.
            </h3>
            <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
              The practice is held. Carry this quiet into the rest of your day — or write a few lines
              while the feeling is near.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/journal/new"
                className="inline-flex h-11 items-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm"
              >
                Open journal
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center px-6 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm"
              >
                Return home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return shell
}
