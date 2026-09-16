"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Hash, Sparkles } from 'lucide-react'
import LeadMagnetCTA from '@/components/LeadMagnetCTA'

const MOOLANK: Record<number, { title: string; planet: string; traits: string[]; desc: string; color: string }> = {
  1: { title: "The Leader", planet: "Sun ☀️", traits: ["Independent", "Ambitious", "Creative", "Pioneering"], desc: "You are a natural-born leader with tremendous willpower. The Sun blesses you with authority and originality.", color: "bg-amber-50 border-amber-200" },
  2: { title: "The Diplomat", planet: "Moon 🌙", traits: ["Sensitive", "Intuitive", "Cooperative", "Nurturing"], desc: "The Moon governs your deep emotional intelligence. You are the peacemaker who brings harmony to every space.", color: "bg-gold/10 border-gold/25" },
  3: { title: "The Creator", planet: "Jupiter ♃", traits: ["Creative", "Optimistic", "Social", "Expressive"], desc: "Jupiter's expansive energy flows through you. You are a natural communicator with boundless creative gifts.", color: "bg-gold/10 border-gold/30" },
  4: { title: "The Builder", planet: "Rahu / Uranus", traits: ["Disciplined", "Practical", "Loyal", "Hard-working"], desc: "Rahu gives you the power of transformation through structure. You build lasting foundations for yourself and others.", color: "bg-stone-50 border-stone-200" },
  5: { title: "The Explorer", planet: "Mercury ☿", traits: ["Versatile", "Adventurous", "Quick-witted", "Free"], desc: "Mercury blesses you with a quicksilver mind. You crave freedom, travel and the exchange of ideas.", color: "bg-emerald-50 border-emerald-200" },
  6: { title: "The Nurturer", planet: "Venus ♀", traits: ["Loving", "Responsible", "Artistic", "Protective"], desc: "Venus fills your life with beauty and deep relationships. You are a natural caregiver with refined aesthetic sensibility.", color: "bg-gold/10 border-gold/30" },
  7: { title: "The Seeker", planet: "Ketu / Neptune", traits: ["Analytical", "Spiritual", "Intuitive", "Mysterious"], desc: "Ketu draws you toward the mystical and the unseen. You are the eternal seeker of truth beyond the veil.", color: "bg-violet-50 border-violet-200" },
  8: { title: "The Achiever", planet: "Saturn ♄", traits: ["Ambitious", "Authoritative", "Disciplined", "Resilient"], desc: "Saturn's karmic energy propels you toward mastery and material success. Power and responsibility define your path.", color: "bg-slate-50 border-slate-300" },
  9: { title: "The Humanitarian", planet: "Mars ♂", traits: ["Compassionate", "Courageous", "Idealistic", "Wise"], desc: "Mars gives you the courage to serve humanity. You carry the wisdom of all numbers — your life is devoted to the greater good.", color: "bg-rose-50 border-rose-200" },
}

function reduce(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n
  return reduce([...String(n)].reduce((a, d) => a + +d, 0))
}

export default function NumerologyPage() {
  const [dob, setDob] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<{ moolank: number; bhagyank: number } | null>(null)

  const calculate = () => {
    if (!dob) return
    const [year, month, day] = dob.split('-').map(Number)
    const moolank = reduce(day)
    const bhagyank = reduce(day + month + [...String(year)].reduce((a, d) => a + +d, 0))
    setResult({ moolank, bhagyank })
  }

  const m = result ? MOOLANK[result.moolank] : null
  const b = result ? MOOLANK[result.bhagyank] : null

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-black uppercase tracking-widest">
            <Hash className="w-3 h-3" /> Vedic Numerology
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Moolank &amp; Bhagyank</h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
            Your <strong>Moolank</strong> (birth number) reveals your core personality. Your <strong>Bhagyank</strong> (destiny number) reveals your life's karmic mission.
          </p>
        </div>

        <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date of Birth</label>
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="h-12 rounded-xl border-slate-200 bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name (optional)</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="As given at birth" className="h-12 rounded-xl border-slate-200 bg-white" />
            </div>
          </div>
          <Button onClick={calculate} disabled={!dob} className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black font-bold">
            <Sparkles className="w-4 h-4 mr-2" /> Calculate My Numbers
          </Button>
        </div>

        {result && m && b && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Moolank', sub: 'Birth Number', num: result.moolank, info: m },
                { label: 'Bhagyank', sub: 'Destiny Number', num: result.bhagyank, info: b },
              ].map(({ label, sub, num, info }) => (
                <div key={label} className={`p-8 rounded-[40px] border-2 space-y-5 ${info.color}`}>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label} — {sub}</p>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="text-7xl font-black text-slate-900">{num}</span>
                      <span className="text-lg font-serif font-bold text-slate-700">{info.title}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{info.planet}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{info.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {info.traits.map(t => (
                      <span key={t} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <LeadMagnetCTA
              tool="Numerology"
              result={`Moolank ${result?.moolank} / Bhagyank ${result?.bhagyank}`}
              title="Get Your Full Numerology Report — Free"
              subtitle="Receive a detailed breakdown of your life path, lucky numbers, karmic lessons, and the best periods for important decisions."
              theme="light"
            />

            <div className="p-6 bg-slate-900 rounded-[32px] text-center space-y-4">
              <p className="text-white font-serif text-lg">Want a personalised numerology reading with Archana Jain?</p>
              <Button asChild className="bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold">
                <Link href="/contact">Book a Session</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
