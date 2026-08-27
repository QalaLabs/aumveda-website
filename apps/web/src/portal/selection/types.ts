export interface SelectionItem {
  id: string
  label: string
  description?: string
  icon?: string
  metadata?: Record<string, any>
}

export type SelectionPhase = 'selecting' | 'locked' | 'revealing' | 'confirmed'

export interface SelectionState {
  items: SelectionItem[]
  selectedId: string | null
  phase: SelectionPhase
  locked: boolean
}

export interface SelectionContextValue {
  items: SelectionItem[]
  selectedId: string | null
  phase: SelectionPhase
  locked: boolean
  select: (id: string) => void
  lock: (id?: string) => void
  confirm: () => void
  reset: () => void
  isSelected: (id: string) => boolean
}
