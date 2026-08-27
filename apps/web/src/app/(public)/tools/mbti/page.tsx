"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import LeadMagnetCTA from '@/components/LeadMagnetCTA'
import { cn } from '@/lib/utils'

const QUESTIONS = [
  { id: 1, text: "At a party, you:", a: "Interact with many people including strangers", b: "Interact with a few people you know well", dim: "EI" },
  { id: 2, text: "You are more:", a: "Realistic than speculative", b: "Speculative than realistic", dim: "SN" },
  { id: 3, text: "Is it worse to:", a: "Have your head in the clouds", b: "Be in a rut", dim: "SN" },
  { id: 4, text: "You are more impressed by:", a: "Principles", b: "Emotions", dim: "TF" },
  { id: 5, text: "You are drawn more to:", a: "Convincing", b: "Touching", dim: "TF" },
  { id: 6, text: "Do you prefer to work:", a: "To deadlines", b: "Just whenever", dim: "JP" },
  { id: 7, text: "Does following a schedule:", a: "Appeal to you", b: "Cramp your style", dim: "JP" },
  { id: 8, text: "When in crowds, you:", a: "Feel energized", b: "Seek a quiet corner", dim: "EI" },
  { id: 9, text: "You trust more:", a: "Your experience", b: "Your premonitions", dim: "SN" },
  { id: 10, text: "You value in yourself more that you are:", a: "Clear-headed", b: "Warm-hearted", dim: "TF" },
  { id: 11, text: "When the phone rings, you:", a: "Hurry to answer", b: "Hope someone else will get it", dim: "EI" },
  { id: 12, text: "You prefer things to be:", a: "Settled and decided", b: "Unsettled and undecided", dim: "JP" },
]

const TYPES: Record<string, { title: string; desc: string; traits: string[]; color: string }> = {
  INTJ: { title: "The Architect", desc: "Imaginative and strategic thinkers with a plan for everything.", traits: ["Strategic", "Independent", "Determined", "Private"], color: "bg-violet-900 text-white" },
  INTP: { title: "The Logician", desc: "Innovative inventors with an unquenchable thirst for knowledge.", traits: ["Analytical", "Curious", "Objective", "Flexible"], color: "bg-ink text-white" },
  ENTJ: { title: "The Commander", desc: "Bold, imaginative and strong-willed leaders.", traits: ["Decisive", "Ambitious", "Strategic", "Charismatic"], color: "bg-destructive/20 text-white" },
  ENTP: { title: "The Debater", desc: "Smart and curious thinkers who love intellectual challenges.", traits: ["Inventive", "Enthusiastic", "Outspoken", "Clever"], color: "bg-orange-700 text-white" },
  INFJ: { title: "The Advocate", desc: "Quiet visionaries with an idealistic, principled nature.", traits: ["Insightful", "Principled", "Compassionate", "Private"], color: "bg-teal-900 text-white" },
  INFP: { title: "The Mediator", desc: "Poetic, kind and altruistic people guided by values.", traits: ["Empathetic", "Creative", "Idealistic", "Flexible"], color: "bg-emerald-800 text-white" },
  ENFJ: { title: "The Protagonist", desc: "Charismatic and inspiring leaders who love helping others.", traits: ["Charismatic", "Empathetic", "Organised", "Reliable"], color: "bg-amber-700 text-white" },
  ENFP: { title: "The Campaigner", desc: "Enthusiastic, creative and sociable free spirits.", traits: ["Enthusiastic", "Creative", "Sociable", "Optimistic"], color: "bg-gold text-white" },
  ISTJ: { title: "The Logistician", desc: "Practical and fact-minded individuals with great reliability.", traits: ["Organised", "Loyal", "Responsible", "Traditional"], color: "bg-slate-800 text-white" },
  ISFJ: { title: "The Defender", desc: "Very dedicated and warm protectors, always ready to defend.", traits: ["Supportive", "Reliable", "Patient", "Imaginative"], color: "bg-cyan-800 text-white" },
  ESTJ: { title: "The Executive", desc: "Excellent administrators with a firm grasp on what matters.", traits: ["Organised", "Loyal", "Dedicated", "Direct"], color: "bg-ink text-white" },
  ESFJ: { title: "The Consul", desc: "Extraordinarily caring, social and popular people.", traits: ["Caring", "Social", "Loyal", "Sensitive"], color: "bg-ink text-white" },
  ISTP: { title: "The Virtuoso", desc: "Bold, practical experimenters who master tools of all kinds.", traits: ["Bold", "Practical", "Observant", "Calm"], color: "bg-stone-800 text-white" },
  ISFP: { title: "The Adventurer", desc: "Flexible, charming artists always ready to explore new things.", traits: ["Artistic", "Observant", "Passionate", "Curious"], color: "bg-rose-800 text-white" },
  ESTP: { title: "The Entrepreneur", desc: "Smart, energetic and perceptive people who enjoy risks.", traits: ["Bold", "Rational", "Original", "Perceptive"], color: "bg-lime-800 text-white" },
  ESFP: { title: "The Entertainer", desc: "Spontaneous, energetic entertainers who love life and people.", traits: ["Bold", "Original", "Aesthetic", "Observant"], color: "bg-fuchsia-800 text-white" },
}

export default function MBTIPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'a' | 'b'>>({})
  const [result, setResult] = useState<string | null>(null)

  const question = QUESTIONS[current]

  const answer = (choice: 'a' | 'b') => {
    const next = { ...answers, [question.id]: choice }
    setAnswers(next)
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1)
    } else {
      // Calculate type
      const score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      QUESTIONS.forEach(q => {
        const ans = next[q.id]
        if (!ans) return
        const [dim1, dim2] = q.dim.split('') as [keyof typeof score, keyof typeof score]
        if (ans === 'a') { score[dim1]++ } else { score[dim2]++ }
      })
      const type = `${score.E >= score.I ? 'E' : 'I'}${score.S >= score.N ? 'S' : 'N'}${score.T >= score.F ? 'T' : 'F'}${score.J >= score.P ? 'J' : 'P'}`
      setResult(type)
    }
  }

  const reset = () => { setCurrent(0); setAnswers({}); setResult(null) }

  const progress = Math.round((current / QUESTIONS.length) * 100)
  const typeInfo = result ? TYPES[result] : null

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        {!result ? (
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Question {current + 1} of {QUESTIONS.length}</span>
                <span>{progress}% complete</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-night transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="p-10 bg-slate-50 rounded-[48px] space-y-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">{question.text}</h2>
              <div className="space-y-4">
                {(['a', 'b'] as const).map(choice => (
                  <button
                    key={choice}
                    onClick={() => answer(choice)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-medium text-slate-700 hover:border-gold/40 hover:bg-gold/10 hover:text-ink",
                      answers[question.id] === choice ? "border-night/40 bg-gold/10 text-ink" : "border-slate-200 bg-white"
                    )}
                  >
                    {question[choice]}
                  </button>
                ))}
              </div>
            </div>

            {current > 0 && (
              <Button variant="ghost" onClick={() => setCurrent(c => c - 1)} className="text-slate-400">
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Your Personality Type
              </div>
              <div className={cn("inline-block px-8 py-4 rounded-3xl text-6xl font-black tracking-tight", typeInfo?.color)}>
                {result}
              </div>
              <h2 className="text-4xl font-serif font-bold text-slate-900">{typeInfo?.title}</h2>
              <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">{typeInfo?.desc}</p>
            </div>

            <div className="p-8 bg-slate-50 rounded-[40px] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Core Traits</h3>
              <div className="flex flex-wrap gap-3">
                {typeInfo?.traits.map(t => (
                  <span key={t} className="px-4 py-2 bg-white rounded-full text-sm font-bold text-slate-700 shadow-sm border border-slate-100">{t}</span>
                ))}
              </div>
            </div>

            <LeadMagnetCTA
              tool="MBTI"
              result={result ?? ''}
              title="Get Your Full Personality Report — Free"
              subtitle={`Receive a deep-dive analysis of your ${result} type: career paths, relationship patterns, growth areas and a Vedic psychological overlay.`}
              theme="light"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={reset} variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 font-bold">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
              </Button>
              <Button asChild className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black font-bold">
                <Link href="/contact">Book a Deep-Dive Session <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
