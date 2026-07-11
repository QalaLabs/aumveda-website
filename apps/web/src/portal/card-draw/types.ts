export interface CardItem {
  id: string
  label: string
  name: string
  theme: string
  description?: string
  metadata?: Record<string, unknown>
}

export type CardDrawPhase = 'shuffling' | 'ready' | 'drawing' | 'flipping' | 'revealed'

export interface CardDrawState {
  deck: CardItem[]
  drawnCard: CardItem | null
  phase: CardDrawPhase
  seed: number
  remaining: number
}

export interface CardDrawContextValue {
  deck: CardItem[]
  drawnCard: CardItem | null
  phase: CardDrawPhase
  seed: number
  remaining: number
  draw: () => void
  reset: () => void
  cannotDraw: boolean
}
