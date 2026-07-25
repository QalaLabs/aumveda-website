'use client'

import { useState } from 'react'

interface CalendarSelectorProps {
  onChange: (datetime: string) => void
  practitionerName?: string
}

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
]

/** Calm scheduling — timezone explicit, one selection path */
export function CalendarSelector({ onChange, practitionerName }: CalendarSelectorProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const getUpcomingDays = () => {
    const days: Date[] = []
    const current = new Date()
    if (current.getHours() >= 18) {
      current.setDate(current.getDate() + 1)
    }
    while (days.length < 7) {
      if (current.getDay() !== 0) {
        days.push(new Date(current))
      }
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const days = getUpcomingDays()
  const userTz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'local'
  const isIst = userTz === 'Asia/Kolkata' || userTz === 'Asia/Calcutta'

  const handleSelectDay = (idx: number) => {
    setSelectedDayIdx(idx)
    setSelectedTimeSlot(null)
  }

  const handleSelectTime = (slot: string) => {
    if (selectedDayIdx === null) return
    setSelectedTimeSlot(slot)

    const baseDate = days[selectedDayIdx]
    const [time, modifier] = slot.split(' ')
    const [hoursStr, minutesStr] = time.split(':')
    let hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)

    if (modifier === 'PM' && hours < 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    const finalDate = new Date(baseDate)
    finalDate.setHours(hours, minutes, 0, 0)
    onChange(finalDate.toISOString())
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Choose a time
        </p>
        {practitionerName && (
          <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.65)]">
            with {practitionerName}
          </p>
        )}
        <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.45)]">
          Times shown in IST (India). Your timezone: {userTz.replace(/_/g, ' ')}
          {!isIst && ' — confirm the IST slot feels right for you.'}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" role="listbox" aria-label="Available days">
        {days.map((day, idx) => {
          const isSelected = selectedDayIdx === idx
          return (
            <button
              key={day.toISOString()}
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
                {day.toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span className="font-serif text-sm mt-1">
                {day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </button>
          )
        })}
      </div>

      {selectedDayIdx !== null && (
        <div className="space-y-3" role="listbox" aria-label="Available times">
          <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-parchment)/0.4)] text-center">
            Available slots · IST
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTimeSlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTime(slot)}
                  className={`min-h-[44px] py-2.5 text-center font-body text-sm rounded-full border transition-colors duration-150 ${
                    isSelected
                      ? 'bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] border-[hsl(var(--av-gold))]'
                      : 'border-[hsl(var(--av-parchment)/0.15)] text-[hsl(var(--av-parchment)/0.75)] hover:border-[hsl(var(--av-gold)/0.4)]'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
