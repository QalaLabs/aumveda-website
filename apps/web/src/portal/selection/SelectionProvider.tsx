'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { SelectionItem, SelectionPhase, SelectionContextValue } from './types'

interface SelectionProviderProps {
  children: ReactNode
  items: SelectionItem[]
  onSelect?: (id: string) => void
  onConfirm?: (id: string) => void
}

const SelectionCtx = createContext<SelectionContextValue | null>(null)

export function SelectionProvider({ children, items, onSelect, onConfirm }: SelectionProviderProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [phase, setPhase] = useState<SelectionPhase>('selecting')
  const [locked, setLocked] = useState(false)

  const select = useCallback((id: string) => {
    setSelectedId(id)
    onSelect?.(id)
  }, [onSelect])

  const lock = useCallback((id?: string) => {
    const targetId = id ?? selectedId
    if (!targetId) return
    if (id && id !== selectedId) {
      setSelectedId(id)
      onSelect?.(id)
    }
    setLocked(true)
    setPhase('locked')
  }, [selectedId, onSelect])

  const confirm = useCallback(() => {
    if (!selectedId) return
    setPhase('revealing')
    setTimeout(() => {
      setPhase('confirmed')
      onConfirm?.(selectedId)
    }, 800)
  }, [selectedId, onConfirm])

  const reset = useCallback(() => {
    setSelectedId(null)
    setPhase('selecting')
    setLocked(false)
  }, [])

  const isSelected = useCallback((id: string) => selectedId === id, [selectedId])

  return (
    <SelectionCtx.Provider value={{
      items,
      selectedId,
      phase,
      locked,
      select,
      lock,
      confirm,
      reset,
      isSelected,
    }}>
      {children}
    </SelectionCtx.Provider>
  )
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionCtx)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
