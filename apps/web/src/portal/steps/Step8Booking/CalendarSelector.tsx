'use client'

import { useMemo, useState } from 'react'

interface CalendarSelectorProps {
  onChange: (datetime: string) => void
  practitionerName?: string
  /** Duration shown in summary */
  durationMinutes?: number
}

/** IST wall-clock slots offered for Discovery Calls */
const TIME_SLOTS = [
  { label: '09:00 AM', h: 9, m: 0 },
  { label: '10:30 AM', h: 10, m: 30 },
  { label: '12:00 PM', h: 12, m: 0 },
  { label: '02:30 PM', h: 14, m: 30 },
  { label: '04:00 PM', h: 16, m: 0 },
  { label: '05:30 PM', h: 17, m: 30 },
] as const

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Convert an IST calendar day + wall time into ISO UTC */
function istToIso(year: number, month: number, day: number, h: number, m: number): string {
  return new Date(
    `${year}-${pad(month)}-${pad(day)}T${pad(h)}:${pad(m)}:00+05:30`
  ).toISOString()
}

function getUpcomingIstDays(): { y: number; mo: number; d: number; date: Date }[] {
  const days: { y: number; mo: number; d: number; date: Date }[] = []
  // Walk forward using UTC noon anchors to avoid DST weirdness; label via IST parts
  const cursor = new Date()
  // If past last slot today in IST, start tomorrow
  const istNow = new Date(
    cursor.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  )
  if (istNow.getHours() >= 18) {
    cursor.setDate(cursor.getDate() + 1)
  }

  let guard = 0
  while (days.length < 7 && guard < 20) {
    guard++
    const istParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).formatToParts(cursor)

    const get = (t: string) => istParts.find((p) => p.type === t)?.value || ''
    const weekday = get('weekday')
    const y = Number(get('year'))
    const mo = Number(get('month'))
    const d = Number(get('day'))

    // Skip Sunday (weekday short may be Sun)
    if (weekday !== 'Sun') {
      days.push({ y, mo, d, date: new Date(`${y}-${pad(mo)}-${pad(d)}T12:00:00+05:30`) })
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function isSlotPast(y: number, mo: number, d: number, h: number, m: number): boolean {
  const slot = new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(m)}:00+05:30`)
  return slot.getTime() <= Date.now() + 30 * 60_000 // 30m buffer
}

/** Calm scheduling — slots defined in IST, local equivalent shown */
export function CalendarSelector({
  onChange,
  practitionerName,
  durationMinutes = 15,
}: CalendarSelectorProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<(typeof TIME_SLOTS)[number] | null>(null)

  const days = useMemo(() => getUpcomingIstDays(), [])
  const userTz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'local'
  const isIst = userTz === 'Asia/Kolkata' || userTz === 'Asia/Calcutta'

  const handleSelectDay = (idx: number) => {
    setSelectedDayIdx(idx)
    setSelectedSlot(null)
    onChange('')
  }

  const handleSelectTime = (slot: (typeof TIME_SLOTS)[number]) => {
    if (selectedDayIdx === null) return
    const day = days[selectedDayIdx]
    if (isSlotPast(day.y, day.mo, day.d, slot.h, slot.m)) return
    setSelectedSlot(slot)
    onChange(istToIso(day.y, day.mo, day.d, slot.h, slot.m))
  }

  const selectedIso =
    selectedDayIdx !== null && selectedSlot
      ? istToIso(
          days[selectedDayIdx].y,
          days[selectedDayIdx].mo,
          days[selectedDayIdx].d,
          selectedSlot.h,
          selectedSlot.m
        )
      : null

  const localLabel = selectedIso
    ? new Date(selectedIso).toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null

  const istLabel = selectedIso
    ? new Date(selectedIso).toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
        timeZoneName: 'short',
      })
    : null

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Choose a time
        </p>
        {practitionerName && (
          <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.65)]">
            with {practitionerName} · {durationMinutes} minutes
          </p>
        )}
        <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.45)] leading-relaxed max-w-[42ch] mx-auto">
          Slots are offered in IST (India Standard Time). Your device: {userTz.replace(/_/g, ' ')}
          {!isIst && ' — we show your local equivalent after you pick.'}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" role="listbox" aria-label="Available days">
        {days.map((day, idx) => {
          const isSelected = selectedDayIdx === idx
          return (
            <button
              key={`${day.y}-${day.mo}-${day.d}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelectDay(idx)}
              className={`flex flex-col items-center justify-center min-h-[64px] p-2 rounded-xl border transition-colors duration-150 ${
                isSelected
                  ? 'bg-[hsl(var(--av-gold)/0.15)] border-[hsl(var(--av-gold))] text-[hsl(var(--av-gold-soft))]'
                  : 'border-[hsl(var(--av-parchment)/0.12)] text-[hsl(var(--av-parchment)/0.55)] hover:border-[hsl(var(--av-parchment)/0.25)]'
              }`}
            >
              <span className="font-body text-[10px] uppercase tracking-wider">
                {day.date.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  timeZone: 'Asia/Kolkata',
                })}
              </span>
              <span className="font-serif text-sm mt-1">
                {day.date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  timeZone: 'Asia/Kolkata',
                })}
              </span>
            </button>
          )
        })}
      </div>

      {selectedDayIdx !== null && (
        <div className="space-y-3" role="listbox" aria-label="Available times in IST">
          <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-parchment)/0.4)] text-center">
            Available · IST
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const day = days[selectedDayIdx]
              const past = isSlotPast(day.y, day.mo, day.d, slot.h, slot.m)
              const isSelected = selectedSlot?.label === slot.label
              return (
                <button
                  key={slot.label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={past}
                  onClick={() => handleSelectTime(slot)}
                  className={`min-h-[44px] py-2.5 text-center font-body text-sm rounded-full border transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] border-[hsl(var(--av-gold))]'
                      : 'border-[hsl(var(--av-parchment)/0.15)] text-[hsl(var(--av-parchment)/0.75)] hover:border-[hsl(var(--av-gold)/0.4)]'
                  }`}
                >
                  {slot.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedIso && istLabel && (
        <div
          className="rounded-xl border border-[hsl(var(--av-gold)/0.35)] bg-[hsl(var(--av-gold)/0.08)] px-5 py-4 text-center space-y-1"
          role="status"
        >
          <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-gold))]">
            Selected
          </p>
          <p className="font-serif text-lg text-[hsl(var(--av-parchment))]">{istLabel}</p>
          {!isIst && localLabel && (
            <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)]">
              Your local time · {localLabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
