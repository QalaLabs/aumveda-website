'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

export default function Step6Constellation() {
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [tobUnknown, setTobUnknown] = useState(false)
  const [place, setPlace] = useState('')
  const [email, setEmail] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const setBirthDetails = usePortalStore(s => s.setBirthDetails)
  const setEmail_state = usePortalStore(s => s.setEmail)
  const setAstrology = usePortalStore(s => s.setAstrology)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!dob || !place || !email) return
    setLoading(true)

    // Simulate Prokerala API call with random signs
    await new Promise(r => setTimeout(r, 1500))
    const sun = SIGNS[Math.floor(Math.random() * 12)]
    const moon = SIGNS[Math.floor(Math.random() * 12)]
    const rising = SIGNS[Math.floor(Math.random() * 12)]

    setBirthDetails({ dob, timeOfBirth: tobUnknown ? '' : tob, placeOfBirth: place, lat: 0, lng: 0 })
    setEmail_state(email)
    setAstrology({ sunSign: sun, moonSign: moon, risingSign: rising })

    setShowEmail(true)
    setLoading(false)

    // Auto-reveal after email
    setTimeout(() => setRevealed(true), 500)
  }

  const handleContinue = () => {
    setStep(7)
    router.push('/step-7')
  }

  if (revealed) {
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="relative w-full h-48 mb-8 rounded-2xl bg-gradient-to-b from-[#0F0A2E] via-[#1A0F3C] to-[#0F0A2E] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 80px 40px, white, transparent), radial-gradient(1px 1px at 120px 80px, white, transparent)' }} />
          <p className="text-white/30 text-sm relative">✦ Your birth sky ✦</p>
        </div>
        <p className="text-white/40 text-sm mb-2 italic">This was your sky — the moment you took your first breath.</p>
        <div className="space-y-3 mb-8">
          <div className="bg-white/5 rounded-xl p-3"><span className="text-[#C9A84C] font-semibold">☀ Sun</span> <span className="text-white/70">— Your core self</span></div>
          <div className="bg-white/5 rounded-xl p-3"><span className="text-white/70 font-semibold">☽ Moon</span> <span className="text-white/70">— Your emotional world</span></div>
          <div className="bg-white/5 rounded-xl p-3"><span className="text-purple-400 font-semibold">↑ Rising</span> <span className="text-white/70">— Your mask to the world</span></div>
        </div>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Continue →
        </button>
      </div>
    )
  }

  if (showEmail && !revealed) {
    return (
      <div className="text-center max-w-md animate-fade-in">
        <h2 className="text-2xl font-serif text-[#C9A84C] mb-4">Your constellation is ready</h2>
        <p className="text-white/60 mb-8">Enter your email to reveal it.</p>
        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <button onClick={() => setRevealed(true)} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
            Reveal My Chart
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center max-w-md">
      <p className="text-lg text-white/70 mb-2">
        Your birth chart already knows everything about you.
      </p>
      <p className="text-white/30 text-sm mb-8">Every pattern. Every wound. Every piece of unlived potential.</p>
      <div className="space-y-4 text-left">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest">Place of Birth</label>
          <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="City, Country" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <label className="text-white/50 text-xs uppercase tracking-widest">Time of Birth</label>
            <input type="time" value={tob} onChange={e => setTob(e.target.value)} disabled={tobUnknown} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C] disabled:opacity-30" />
          </div>
          <label className="flex items-center gap-2 mt-5 text-white/40 text-xs cursor-pointer">
            <input type="checkbox" checked={tobUnknown} onChange={e => setTobUnknown(e.target.checked)} className="accent-[#C9A84C]" />
            I don&apos;t know
          </label>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!dob || !place || !email}
        className="mt-8 bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Calculating...' : 'Reveal My Birth Chart'}
      </button>
    </div>
  )
}
