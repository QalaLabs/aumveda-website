'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'
import { CHAKRA_DATA, CHAKRA_REVEALS } from '@/lib/portal/constants'
import type { ChakraType } from '@aumveda/types'

export default function Step2Chakra() {
  const [selected, setSelected] = useState<ChakraType | null>(null)
  const setChakra = usePortalStore(s => s.setChakra)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handleSelect = (chakra: ChakraType) => {
    setSelected(chakra)
    setChakra(chakra)
  }

  const handleContinue = () => {
    if (!selected) return
    setStep(3)
    router.push('/step-3')
  }

  const chakras = (Object.entries(CHAKRA_DATA) as [ChakraType, typeof CHAKRA_DATA[ChakraType]][])

  if (selected) {
    const reveal = CHAKRA_REVEALS[selected]
    const data = CHAKRA_DATA[selected]
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{ backgroundColor: data.color + '33', boxShadow: `0 0 30px ${data.color}66` }}
        >
          <span style={{ color: data.color }}>◉</span>
        </div>
        <h2 className="text-3xl font-serif text-[#C9A84C] mb-2">{data.label} — {data.sanskrit}</h2>
        <p className="text-white/50 text-sm mb-6">{reveal.sub}</p>
        <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left space-y-4">
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-1">{reveal.heading}</p>
            <p className="text-white/70 text-sm">{reveal.blocked}</p>
          </div>
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold mb-1">How it shows up in your life</p>
            <p className="text-white/70 text-sm">{reveal.showsUp}</p>
          </div>
        </div>
        <p className="text-white/40 text-sm mb-8 italic">This is where we begin. Your chart already knows why.</p>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="text-center max-w-2xl">
      <p className="text-lg text-white/70 mb-8">Every chakra holds an energy. Choose the sound that your body is calling for right now.</p>
      <div className="grid grid-cols-4 gap-4">
        {chakras.map(([key, data]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className="group relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-all group-hover:shadow-lg"
              style={{ backgroundColor: data.color + '22', boxShadow: `0 0 0px ${data.color}` }}
            >
              <span className="text-lg" style={{ color: data.color }}>◉</span>
            </div>
            <p className="text-xs text-white/60 font-medium">{data.label}</p>
            <p className="text-[10px] text-white/30">{data.frequency}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
