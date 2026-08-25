interface ProgressRingProps {
  score: number
  streakDays: number
  size?: number
}

/** Quiet progress indicator — a held ring, not a scoreboard. */
export default function ProgressRing({ score, streakDays, size = 56 }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 flex-shrink-0"
        role="img"
        aria-label={`Progress: ${clamped} percent`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--av-stone))"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--av-gold))"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div>
        <p className="font-mono text-sm tabular text-[hsl(var(--av-night))]">{clamped}%</p>
        {streakDays > 0 ? (
          <p className="font-body text-xs text-[hsl(var(--av-mute))]">
            {streakDays} day{streakDays === 1 ? '' : 's'} held
          </p>
        ) : (
          <p className="font-body text-xs text-[hsl(var(--av-mute))]">Just beginning</p>
        )}
      </div>
    </div>
  )
}
