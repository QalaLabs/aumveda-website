export interface CartItem {
  productId: number
  slug: string
  title: string
  priceCents: number
  compareAtPriceCents: number | null
  imageUrl: string | null
  quantity: number
  inventoryCount: number
  productType: string
  /** "Crystal + Session" bundle info, if this product carries one — surfaced in the cart summary. */
  bundle?: { serviceType: string; sessionLabel: string; bundlePriceCents: number } | null
}

export interface CartState {
  items: CartItem[]
  totalCents: number
  totalItems: number
}

export interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: number) => boolean
}
