'use client'

import { useState } from 'react'
import { usePortalStore } from '@/lib/portal/store'
import { PROFILE_NAMES } from '@/lib/portal/constants'

export default function Step8Booking() {
  const [booked, setBooked] = useState(false)
  const portalData = usePortalStore()

  const handleBook = () => {
    setBooked(true)
    // In production: n8n webhook triggers WhatsApp to Sejal + creates ClickUp card
  }

  if (booked) {
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-2xl font-serif text-[#C9A84C] mb-4">Your portal is complete</h2>
        <p className="text-white/60 mb-2">Sejal will reach out to you shortly to confirm your Discovery Call.</p>
        <p className="text-white/30 text-sm mb-8">Keep an eye on your email and WhatsApp for the calendar invite.</p>
        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Your Portal Summary</p>
          <div className="space-y-2 text-sm">
            <p className="text-white/60">Profile: <span className="text-white">{PROFILE_NAMES[portalData.profileResult || ''] || portalData.profileResult}</span></p>
            <p className="text-white/60">Chakra: <span className="text-white">{portalData.chakraSelected}</span></p>
            <p className="text-white/60">Archetype: <span className="text-white">{portalData.archetypeSelected}</span></p>
            {portalData.sunSign && <p className="text-white/60">Sun Sign: <span className="text-white">{portalData.sunSign}</span></p>}
            {portalData.intentionText && (
              <p className="text-white/60">Intention: <span className="text-white italic">&ldquo;{portalData.intentionText}&rdquo;</span></p>
            )}
          </div>
        </div>
        <div className="text-center">
          <p className="text-white/40 text-sm">AUMVEDA &mdash; Decode. Dissolve. Return.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-lg">
      <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🕊️</span>
      </div>
      <h2 className="text-2xl font-serif text-[#C9A84C] mb-4">You&apos;ve completed the portal</h2>
      <p className="text-white/70 mb-2">Your healing profile has been read.</p>
      <p className="text-white/40 text-sm mb-8">Now take the next step — book a free Discovery Call with Sejal. She&apos;ll walk through your results and guide you to the right path.</p>

      <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
        <p className="text-[#C9A84C] text-sm font-semibold mb-3">On your Discovery Call, Sejal will:</p>
        <ul className="space-y-2 text-sm text-white/60">
          <li className="flex items-start gap-2">✦ Review your portal results with you</li>
          <li className="flex items-start gap-2">✦ Identify the primary area of healing</li>
          <li className="flex items-start gap-2">✦ Recommend the right session or package</li>
          <li className="flex items-start gap-2">✦ Answer any questions you have</li>
        </ul>
      </div>

      <button
        onClick={handleBook}
        className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all hover:scale-105"
      >
        Book My Free Discovery Call
      </button>
      <p className="text-white/20 text-xs mt-4">30 min · Free · Zoom</p>
    </div>
  )
}
