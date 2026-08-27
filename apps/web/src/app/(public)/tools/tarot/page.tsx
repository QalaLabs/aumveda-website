"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, Sparkles, Star } from 'lucide-react'
import LeadMagnetCTA from '@/components/LeadMagnetCTA'
import { cn } from '@/lib/utils'

const CARDS = [
  { name: "The Fool", number: "0", element: "Air", upright: "New beginnings, spontaneity, a free spirit embarking on a journey with pure trust.", reversed: "Recklessness, risk-taking without preparation, naivety.", color: "from-gold/20 to-amber-800" },
  { name: "The Magician", number: "I", element: "Air & Fire", upright: "Manifestation, resourcefulness, power. You have all the tools needed to succeed.", reversed: "Manipulation, poor planning, untapped talents going to waste.", color: "from-destructive/20 to-rose-800" },
  { name: "The High Priestess", number: "II", element: "Water", upright: "Intuition, sacred knowledge, divine feminine. Trust your inner voice.", reversed: "Secrets, disconnected from intuition, withdrawal.", color: "from-night to-ink" },
  { name: "The Empress", number: "III", element: "Earth", upright: "Femininity, beauty, abundance. Nature, creativity and nurturing are at the fore.", reversed: "Creative block, dependence on others, smothering.", color: "from-emerald-900 to-sage" },
  { name: "The Emperor", number: "IV", element: "Fire", upright: "Authority, structure, control. A stable foundation built through discipline.", reversed: "Domination, excessive control, rigidity, stubbornness.", color: "from-orange-900 to-destructive/10" },
  { name: "The Hierophant", number: "V", element: "Earth", upright: "Spiritual wisdom, religious beliefs, tradition, conformity, institutions.", reversed: "Personal beliefs, freedom, challenging the status quo.", color: "from-violet-900 to-night" },
  { name: "The Lovers", number: "VI", element: "Air", upright: "Love, harmony, relationships, values alignment, choices.", reversed: "Self-love, disharmony, imbalance, misaligned values.", color: "from-night to-rose-800" },
  { name: "The Chariot", number: "VII", element: "Water", upright: "Control, willpower, success. Overcoming obstacles through determination.", reversed: "Self-discipline, opposition, lack of direction.", color: "from-slate-900 to-gray-800" },
  { name: "Strength", number: "VIII", element: "Fire", upright: "Strength, courage, persuasion, influence, compassion.", reversed: "Inner strength, self-doubt, low energy, raw emotion.", color: "from-amber-900 to-gold/10" },
  { name: "The Hermit", number: "IX", element: "Earth", upright: "Soul-searching, introspection, being alone, inner guidance.", reversed: "Isolation, loneliness, withdrawal, anti-social.", color: "from-stone-900 to-slate-800" },
  { name: "Wheel of Fortune", number: "X", element: "Fire", upright: "Good luck, karma, life cycles, destiny, a turning point.", reversed: "Bad luck, resistance to change, breaking cycles.", color: "from-teal-900 to-cyan-800" },
  { name: "Justice", number: "XI", element: "Air", upright: "Justice, fairness, truth, cause and effect, law.", reversed: "Unfairness, dishonesty, lack of accountability.", color: "from-night to-slate-800" },
  { name: "The Star", number: "XVII", element: "Air", upright: "Hope, faith, purpose, renewal, spirituality. A time of healing.", reversed: "Lack of faith, despair, self-trust, disconnection.", color: "from-ink to-night" },
  { name: "The Moon", number: "XVIII", element: "Water", upright: "Illusion, fear, the unconscious, confusion, the subconscious.", reversed: "Release of fear, repressed emotion, inner confusion.", color: "from-ink to-ink" },
  { name: "The Sun", number: "XIX", element: "Fire", upright: "Positivity, fun, warmth, success, vitality. Pure joy.", reversed: "Inner child, feeling down, overly optimistic.", color: "from-gold/15 to-orange-700" },
  { name: "The World", number: "XXI", element: "Earth", upright: "Completion, integration, accomplishment, travel, wholeness.", reversed: "Incompleteness, no closure, lack of integration.", color: "from-emerald-900 to-teal-800" },
]

const SYMBOLS = ["☽", "★", "◈", "⊕", "∞", "✦", "⟡", "◉"]

export default function TarotPage() {
  const [drawn, setDrawn] = useState<typeof CARDS[0] | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [question, setQuestion] = useState('')
  const [shuffled, setShuffled] = useState(false)

  const shuffle = () => {
    setShuffled(true)
    setDrawn(null)
  }

  const draw = () => {
    setIsFlipping(true)
    setTimeout(() => {
      const card = CARDS[Math.floor(Math.random() * CARDS.length)]
      const rev = Math.random() > 0.7
      setDrawn(card)
      setIsReversed(rev)
      setIsFlipping(false)
    }, 600)
  }

  const reset = () => { setDrawn(null); setShuffled(false); setQuestion('') }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-soft text-xs font-black uppercase tracking-widest">
            <Star className="w-3 h-3" /> Sacred Tarot
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Draw Your Card</h1>
          <p className="text-slate-400 leading-relaxed">Focus on your question, still your mind, then draw when ready.</p>
        </div>

        {!drawn ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Question (optional)</label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What guidance do you seek from the cards today?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-night/40 transition-colors"
                rows={3}
              />
            </div>

            <div className="flex flex-col items-center gap-6">
              {!shuffled ? (
                <Button onClick={shuffle} className="h-14 px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 w-full">
                  <RefreshCw className="w-4 h-4 mr-2" /> Shuffle the Deck
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {SYMBOLS.slice(0, 5).map((s, i) => (
                      <div key={i} className="aspect-[2/3] bg-gradient-to-br from-ink to-ink rounded-xl border border-white/10 flex items-center justify-center text-white/20 text-2xl font-black select-none">
                        {s}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={draw}
                    disabled={isFlipping}
                    className="h-14 px-12 rounded-2xl bg-night hover:bg-night text-white font-bold w-full text-lg"
                  >
                    {isFlipping ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 mr-2" /> Draw Your Card</>}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={cn(
              "aspect-[2/3] max-w-xs mx-auto rounded-3xl bg-gradient-to-br flex flex-col items-center justify-center p-8 text-center space-y-4 border border-white/10 shadow-2xl",
              drawn.color,
              isReversed && "rotate-180"
            )}>
              <div className="text-white/40 text-xs font-black uppercase tracking-[0.4em]">{drawn.number}</div>
              <div className="text-6xl text-white/20 font-black">✦</div>
              <h3 className="text-2xl font-serif font-bold text-white">{drawn.name}</h3>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest">{drawn.element}</div>
            </div>

            {isReversed && (
              <div className="text-center">
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest rounded-full border border-rose-500/30">
                  Reversed
                </span>
              </div>
            )}

            <div className="space-y-6">
              {question && (
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Question</p>
                  <p className="text-slate-300 italic">"{question}"</p>
                </div>
              )}

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-gold-soft">
                  {isReversed ? 'Reversed Meaning' : 'Upright Meaning'}
                </h4>
                <p className="text-white leading-relaxed">{isReversed ? drawn.reversed : drawn.upright}</p>
              </div>
            </div>

            <LeadMagnetCTA
              tool="Tarot"
              result={drawn?.name ?? ''}
              title="Get Your Full Card Reading — Free"
              subtitle={`Receive a complete interpretation of ${drawn?.name}, including how it applies to love, career, and your spiritual path right now.`}
              theme="dark"
            />

            <div className="flex gap-4">
              <Button onClick={reset} variant="ghost" className="flex-1 h-12 rounded-xl text-slate-400 hover:text-white border border-white/10 font-bold">
                <RefreshCw className="w-4 h-4 mr-2" /> Draw Again
              </Button>
              <Button asChild className="flex-1 h-12 rounded-xl bg-night hover:bg-night font-bold">
                <Link href="/contact">Book a Reading</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
