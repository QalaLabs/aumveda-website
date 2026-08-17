'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { CartItem, CartContextValue } from '@/lib/cart/types'

const CART_KEY = 'aumveda_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'productId' in item &&
        'quantity' in item
    )
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(loadCart())
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId)
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, existing.inventoryCount || 99)
        return prev.map(i =>
          i.productId === newItem.productId ? { ...i, quantity: newQty } : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.productId !== productId))
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.inventoryCount || 99) }
          : i
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback(
    (productId: number) => items.some(i => i.productId === productId),
    [items]
  )

  const state = useMemo(() => {
    const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0)
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    return { items, totalCents, totalItems }
  }, [items])

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, isInCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
