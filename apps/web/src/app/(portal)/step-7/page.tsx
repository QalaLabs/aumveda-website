'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'
import { PATTERN_QUESTIONS, PROFILE_NAMES } from '@/lib/portal/constants'
import { calculateProfile } from '@/lib/portal/scoring'

export default function Step7Pattern() {
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)
  const setAnswers_state = usePortalStore(s => s.setAnswers)
  const setScores = usePortalStore(s => s.setScores)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handleAnswer = (answer: string) => {
    const qId = PATTERN_QUESTIONS[qIdx].id
    const updated = { ...answers, [qId]: answer }
    setAnswers(updated)
    setAnswers_state(qIdx + 1, answer)

    if (qIdx < 6) {
      setTimeout(() => setQIdx(qIdx + 1), 300)
    } else {
      const profile = calculateProfile(updated)
      setResult(profile)
      setScores(profile)
    }
  }

  const handleContinue = () => {
    setStep(8)
    router.push('/step-8')
  }

  if (result) {
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔮</span>
        </div>
        <h2 className="text-2xl font-serif text-[#C9A84C] mb-2">Your Healing Profile</h2>
        <p className="text-3xl font-bold text-white mb-6">{PROFILE_NAMES[result.profile] || result.profile}</p>
        <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-white/40">Nervous System</span><span className="text-white/80">{result.nervousSystem}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Relationship Pattern</span><span className="text-white/80">{result.relationship}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Childhood</span><span className="text-white/80">{result.childhood}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Financial</span><span className="text-white/80">{result.financial}</span></div>
        </div>
        <p className="text-white/40 text-sm mb-8 italic">The portal has read you. Now it&apos;s time to meet the person who can guide you through it.</p>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Book Your Discovery Call →
        </button>
      </div>
    )
  }

  const q = PATTERN_QUESTIONS[qIdx]
  return (
    <div className="text-center max-w-lg">
      <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Question {qIdx + 1} of 7</p>
      <div className="flex gap-1 justify-center mb-8">
        {PATTERN_QUESTIONS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= qIdx ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
        ))}
      </div>
      <h2 className="text-xl font-serif text-white mb-2">{q.question}</h2>
      <p className="text-white/30 text-sm mb-8">Choose the answer that resonates most.</p>
      <div className="space-y-3">
        {(Object.entries(q.options) as [string, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleAnswer(key)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A84C]/50 rounded-xl p-4 text-left transition-all group"
          >
            <span className="text-[#C9A84C] text-xs font-bold mr-3">{key}</span>
            <span className="text-white/70 group-hover:text-white text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
