'use client'

import { usePortalStore } from '@/lib/portal/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const STEP_ROUTES = ['', '', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8']

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const step = usePortalStore(s => s.step)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#1A0F3C] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="flex items-center gap-1.5 max-w-xl mx-auto">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between max-w-xl mx-auto mt-1 px-0.5">
          {['Breathe', 'Chakra', 'Archetype', 'Tarot', 'Intention', 'Constellation', 'Pattern', 'Book'].map((label, i) => (
            <span key={label} className={`text-[9px] uppercase tracking-widest ${
              i + 1 <= step ? 'text-[#C9A84C]' : 'text-white/20'
            }`}>{label}</span>
          ))}
        </div>
      </div>
      <main className="min-h-screen flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  )
}
