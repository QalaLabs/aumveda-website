import { createHash, randomBytes } from 'crypto'

// ─── PII Hashing (for ad platforms) ──────────────────────────────────────────
/**
 * sha256(lowercase(trim(value))) — matches Meta & GA4 requirements
 */
export function hashPII(value: string): string {
  return createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

// ─── UUID generation ──────────────────────────────────────────────────────────
export function generateEventId(): string {
  return randomBytes(16).toString('hex')
}

// ─── Progress score calculation ───────────────────────────────────────────────
export interface ProgressComponents {
  sleepScore: number     // S_t  0–100
  activityScore: number  // A_t  0–100
  journalScore: number   // J_t  0–100
  wellbeingScore: number // W_t  0–100
}

/**
 * P_t = 0.35·S_t + 0.30·A_t + 0.25·J_t + 0.10·W_t
 */
export function calculateProgressScore(components: ProgressComponents): number {
  const { sleepScore, activityScore, journalScore, wellbeingScore } = components
  const raw = 0.35 * sleepScore + 0.30 * activityScore + 0.25 * journalScore + 0.10 * wellbeingScore
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10))
}

/**
 * Derive activity score from raw health metrics
 * steps target: 8,000/day → 50 pts; workout target: 30 min/day → 50 pts
 */
export function deriveActivityScore(steps: number, workoutMinutes: number): number {
  const stepScore = Math.min(50, (steps / 8000) * 50)
  const workoutScore = Math.min(50, (workoutMinutes / 30) * 50)
  return Math.round(stepScore + workoutScore)
}

/**
 * Journal score: (journals in last 7 days / 7) × 100
 */
export function deriveJournalScore(journalsLast7Days: number): number {
  return Math.min(100, Math.round((journalsLast7Days / 7) * 100))
}

/**
 * Wellbeing score from average mood rating (1–10) × 10
 */
export function deriveWellbeingScore(avgMood: number): number {
  return Math.min(100, Math.max(0, Math.round(avgMood * 10)))
}

// ─── Slug generation ──────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Currency formatting (INR) ────────────────────────────────────────────────
export function formatINR(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function toISTDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(date)
}

export function startOfDayIST(date: Date = new Date()): Date {
  const istDateStr = toISTDateString(date)
  return new Date(`${istDateStr}T00:00:00.000+05:30`)
}
