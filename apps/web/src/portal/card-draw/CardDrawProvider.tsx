'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { CardItem, CardDrawPhase, CardDrawContextValue } from './types'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CardDrawProviderProps {
  cards: CardItem[]
  onDraw?: (card: CardItem) => void
  shuffleDuration?: number
  flipDuration?: number
  children: ReactNode
}

const CardDrawCtx = createContext<CardDrawContextValue | null>(null)

export function CardDrawProvider({
  cards,
  onDraw,
  shuffleDuration = 2500,
  flipDuration = 800,
  children,
}: CardDrawProviderProps) {
  const [deck, setDeck] = useState<CardItem[]>(() => shuffleArray(cards))
  const [drawnCard, setDrawnCard] = useState<CardItem | null>(null)
  const [phase, setPhase] = useState<CardDrawPhase>('shuffling')
  const [seed, setSeed] = useState(0)
  const onDrawRef = useRef(onDraw)
  onDrawRef.current = onDraw

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), shuffleDuration)
    return () => clearTimeout(t)
  }, [shuffleDuration])

  const draw = useCallback(() => {
    if (phase !== 'ready') return
    setPhase('drawing')

    const index = Math.floor(Math.random() * deck.length)
    const card = deck[index]
    const drawSeed = Date.now()
    setSeed(drawSeed)

    setTimeout(() => {
      setPhase('flipping')
      setDrawnCard(card)

      setTimeout(() => {
        setPhase('revealed')
        onDrawRef.current?.(card)
      }, flipDuration)
    }, 600)
  }, [phase, deck, flipDuration])

  const reset = useCallback(() => {
    setDeck(shuffleArray(cards))
    setDrawnCard(null)
    setPhase('shuffling')
    setSeed(0)
    const t = setTimeout(() => setPhase('ready'), 2500)
    return () => clearTimeout(t)
  }, [cards])

  return (
    <CardDrawCtx.Provider
      value={{
        deck,
        drawnCard,
        phase,
        seed,
        remaining: deck.length,
        draw,
        reset,
        cannotDraw: phase !== 'ready',
      }}
    >
      {children}
    </CardDrawCtx.Provider>
  )
}

export function useCardDraw(): CardDrawContextValue {
  const ctx = useContext(CardDrawCtx)
  if (!ctx) throw new Error('useCardDraw must be used within a CardDrawProvider')
  return ctx
}
