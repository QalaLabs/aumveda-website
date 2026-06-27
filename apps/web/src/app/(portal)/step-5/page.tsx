'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'

export default function Step5Intention() {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const setIntention = usePortalStore(s => s.setIntention)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handleSubmit = () => {
    setIntention(text)
    setSubmitted(true)
  }

  const handleSkip = () => {
    setIntention('')
    setSubmitted(true)
  }

  const handleContinue = () => {
    setStep(6)
    router.push('/step-6')
  }

  if (submitted) {
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🕊️</span>
        </div>
        <h2 className="text-2xl font-serif text-[#C9A84C] mb-4">We see you. We hear you.</h2>
        <p className="text-white/60 mb-2">And we&apos;ve got you.</p>
        <p className="text-white/40 text-sm mb-8">This intention will travel with you — through every step of your journey.</p>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="text-center max-w-xl">
      <p className="text-lg text-white/70 mb-2">
        If we were sitting together right now — what is the one thing you want to change about your life
        that you&apos;ve been carrying for far too long?
      </p>
      <p className="text-white/30 text-sm mb-8">Write it. Own it. This is where it begins.</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="I want to..."
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/20 text-lg min-h-[120px] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all resize-none"
      />
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handleSkip}
          className="text-white/40 hover:text-white/60 text-sm underline transition-all"
        >
          Continue quietly
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="bg-[#C9A84C] text-[#1A0F3C] px-8 py-3 rounded-full font-semibold hover:bg-[#d4b85a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          I&apos;m ready
        </button>
      </div>
    </div>
  )
}
