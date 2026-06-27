'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'
import { ARCHETYPE_DATA } from '@/lib/portal/constants'
import type { ArchetypeType } from '@aumveda/types'

export default function Step3Archetype() {
  const [selected, setSelected] = useState<ArchetypeType | null>(null)
  const [revealed, setRevealed] = useState(false)
  const setArchetype = usePortalStore(s => s.setArchetype)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handleSelect = (value: ArchetypeType) => {
    setSelected(value)
    setArchetype(value)
  }

  const handleReveal = () => {
    if (!selected) return
    setRevealed(true)
  }

  const handleContinue = () => {
    setStep(4)
    router.push('/step-4')
  }

  const archetype = ARCHETYPE_DATA.find(a => a.value === selected)

  if (revealed && archetype) {
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="text-6xl mb-6">{archetype.icon}</div>
        <h2 className="text-3xl font-serif text-[#C9A84C] mb-4">The {archetype.value.charAt(0).toUpperCase() + archetype.value.slice(1)}</h2>
        <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left space-y-4">
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-1">Your Gift</p>
            <p className="text-white/70 text-sm">{archetype.gift}</p>
          </div>
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-1">Your Wound</p>
            <p className="text-white/70 text-sm">{archetype.wound}</p>
          </div>
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-1">How It Shows Up</p>
            <p className="text-white/70 text-sm">{archetype.showsUp}</p>
          </div>
        </div>
        <p className="text-white/40 text-sm mb-8 italic">Your birth chart has more to reveal.</p>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="text-center max-w-3xl">
      <p className="text-lg text-white/70 mb-8">Six archetypes. One is you. Choose the one that feels most true — without thinking.</p>
      <div className="grid grid-cols-3 gap-4">
        {ARCHETYPE_DATA.map(a => (
          <button
            key={a.value}
            onClick={() => selected === a.value ? handleReveal() : handleSelect(a.value)}
            className={`p-6 rounded-2xl transition-all ${
              selected === a.value
                ? 'bg-white/15 ring-2 ring-[#C9A84C] scale-105'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-4xl mb-3">{a.icon}</div>
            <p className="font-semibold text-white mb-1">{a.value.charAt(0).toUpperCase() + a.value.slice(1)}</p>
            <p className="text-xs text-white/40">{a.oneLine}</p>
          </button>
        ))}
      </div>
      {selected && (
        <button
          onClick={handleReveal}
          className="mt-8 bg-[#C9A84C] text-[#1A0F3C] px-8 py-3 rounded-full font-semibold hover:bg-[#d4b85a] transition-all animate-fade-in"
        >
          Reveal My Archetype
        </button>
      )}
    </div>
  )
}
