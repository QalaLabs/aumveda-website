'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Moon, Footprints, BookOpen, Heart, Activity, Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'
import ProgressGauge from '@/components/ProgressGauge'
import ProgressChart from '@/components/ProgressChart'
import BadgeShelf from '@/components/BadgeShelf'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProgressHistoryPoint {
  date: string
  score: number
  sleep: number
  activity: number
  journal: number
  wellbeing: number
}

interface ProgressData {
  current: number
  average: number
  history: ProgressHistoryPoint[]
  breakdown: { sleep: number; activity: number; journal: number; wellbeing: number }
}

function ScoreBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-stone-500 font-medium">
          {icon} {label}
        </span>
        <span className="font-bold text-stone-700">{value}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const [range, setRange] = useState<'7d' | '30d'>('7d')
  const [metric, setMetric] = useState<'score' | 'wellbeing' | 'activity' | 'journal'>('score')
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  // Session stats & chakra stats (simulated values based on user database profile)
  const sessionsCount = 2 
  const sessionsTotal = 3
  const activeChakra = 'Heart (Anahata)'

  useEffect(() => {
    setLoading(true)
    fetch(`/api/profile/progress?range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d)
      })
      .finally(() => setLoading(false))
  }, [range])

  // Map history based on selected metric to reuse ProgressChart
  const chartData = data
    ? data.history.map((pt) => ({
        date: pt.date,
        score:
          metric === 'score'
            ? pt.score
            : metric === 'wellbeing'
            ? pt.wellbeing
            : metric === 'activity'
            ? pt.activity
            : pt.journal,
      }))
    : []

  const averageScore = chartData.length
    ? Math.round(chartData.reduce((s, pt) => s + pt.score, 0) / chartData.length)
    : 0

  return (
    <>
      <Topbar title="Progress" />
      <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto space-y-8 bg-stone-50 min-h-screen pb-16">
        
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Score Gauge & Metric Breakdown */}
        <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ProgressGauge value={data?.current ?? 0} size={170} strokeWidth={13} />
            </div>

            <div className="flex-1 w-full space-y-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Somatic Score Breakdown</h3>
              <ScoreBar
                label="Sleep Quality"
                value={data?.breakdown.sleep ?? 50}
                icon={<Moon className="w-3.5 h-3.5 text-indigo-400" />}
              />
              <ScoreBar
                label="Practice Completion"
                value={data?.breakdown.activity ?? 0}
                icon={<Footprints className="w-3.5 h-3.5 text-emerald-500" />}
              />
              <ScoreBar
                label="Journaling Streaks"
                value={data?.breakdown.journal ?? 0}
                icon={<BookOpen className="w-3.5 h-3.5 text-amber-500" />}
              />
              <ScoreBar
                label="Mood / Wellbeing"
                value={data?.breakdown.wellbeing ?? 50}
                icon={<Heart className="w-3.5 h-3.5 text-rose-400" />}
              />
            </div>
          </div>
        </div>

        {/* Sessions & Chakra Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Therapeutic Attendance</p>
              <h4 className="text-xl font-bold text-stone-700 mt-1">
                {sessionsCount} / {sessionsTotal} <span className="text-xs text-stone-400 font-normal">sessions attended</span>
              </h4>
              <p className="text-[10px] text-stone-400 mt-1">1 Discovery session and 1 Reset session completed.</p>
            </div>
          </div>

          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Chakra Unblocking</p>
              <h4 className="text-lg font-bold text-stone-700 mt-1 capitalize">
                {activeChakra}
              </h4>
              <p className="text-[10px] text-stone-400 mt-1">Currently working on clearing throat expressions.</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Journey History</h3>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-2.5 py-1 outline-none text-stone-700"
              >
                <option value="score">Healing Score</option>
                <option value="wellbeing">Mood / Wellbeing</option>
                <option value="activity">Practice Completion</option>
                <option value="journal">Journaling Activity</option>
              </select>
            </div>

            <Tabs value={range} onValueChange={(v) => setRange(v as '7d' | '30d')}>
              <TabsList className="h-8 bg-stone-100">
                <TabsTrigger value="7d" className="text-xs px-3">7 Days</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-3">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="h-[200px] bg-stone-100 rounded-2xl animate-pulse" />
          ) : chartData.length > 0 ? (
            <ProgressChart data={chartData} average={averageScore} />
          ) : (
            <div className="h-[200px] bg-white border border-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm font-medium text-stone-600">No history data available</p>
              <p className="text-xs text-stone-400 mt-1">Complete your first daily dose or log a reflection to start tracking.</p>
            </div>
          )}
        </div>

        {/* Milestone badges Day 7 / 21 / 30 / 90 */}
        <div className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-6 space-y-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-gold))]">
              Streak milestones
            </p>
            <h3 className="font-serif text-xl text-[hsl(var(--av-night))] mt-1">
              Day 7 · 21 · 30 · 90
            </h3>
            <p className="font-body text-sm text-[hsl(var(--av-mute))] mt-1 leading-relaxed">
              Earned through daily check-ins. See the full shelf below.
            </p>
          </div>
          <Link
            href="/dashboard/check-in"
            className="inline-flex h-10 items-center font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
          >
            Continue your streak
          </Link>
        </div>

        {/* Badge Shelf */}
        <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
          <BadgeShelf />
        </div>

      </div>
    </>
  )
}
