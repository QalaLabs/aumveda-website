'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'
import { ALL_MAJOR_ARCANA, TAROT_THEMES } from '@/lib/portal/constants'
import type { TarotThemeType } from '@aumveda/types'

export default function Step4Tarot() {
  const [flipped, setFlipped] = useState(false)
  const [card, setCard] = useState<string | null>(null)
  const [theme, setTheme] = useState<TarotThemeType | null>(null)
  const setTarot = usePortalStore(s => s.setTarot)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  const handlePull = () => {
    const idx = Math.floor(Math.random() * ALL_MAJOR_ARCANA.length)
    const drawnCard = ALL_MAJOR_ARCANA[idx]
    setCard(drawnCard)

    const matchedTheme = TAROT_THEMES.find(t => t.cards.includes(drawnCard))
    const themeName = matchedTheme?.theme || 'awakening'
    setTheme(themeName)
    setTarot(drawnCard as any, themeName)
    setFlipped(true)
  }

  const handleContinue = () => {
    setStep(5)
    router.push('/step-5')
  }

  if (flipped && theme && card) {
    const themeData = TAROT_THEMES.find(t => t.theme === theme)
    return (
      <div className="text-center max-w-lg animate-fade-in">
        <div className="relative w-40 h-56 mx-auto mb-8 perspective-1000">
          <div className="w-full h-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded-xl flex items-center justify-center shadow-2xl">
            <div className="text-center p-4">
              <p className="text-[#1A0F3C] text-lg font-bold">{card}</p>
              <p className="text-[#1A0F3C]/70 text-xs mt-2">Major Arcana</p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-serif text-[#C9A84C] mb-4">{themeData?.theme.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</h2>
        <p className="text-white/60 mb-8 italic">&ldquo;{themeData?.message}&rdquo;</p>
        <button onClick={handleContinue} className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all">
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="text-center max-w-lg">
      <p className="text-lg text-white/70 mb-8">The cards know what your mind hasn&apos;t said yet. When you feel ready — pull one.</p>
      <button
        onClick={handlePull}
        className="group relative w-40 h-56 mx-auto"
      >
        <div className="w-full h-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded-xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-105 group-hover:shadow-[#C9A84C]/30 group-hover:shadow-2xl">
          <p className="text-[#1A0F3C] text-4xl font-bold">?</p>
        </div>
        <p className="text-xs text-white/40 mt-3">Click to pull a card</p>
      </button>
    </div>
  )
}
