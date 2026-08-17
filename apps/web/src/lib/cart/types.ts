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
