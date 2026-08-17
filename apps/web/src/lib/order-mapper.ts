export interface OrderItemView {
  id: string
  name: string
  quantity: number
  price: number
  image: string
  type: 'PHYSICAL' | 'COURSE' | 'SESSION' | 'MICRO_LEARNING'
}

export interface OrderView {
  id: string
  createdAt: string
  total: number
  status: string
  paymentStatus: string
  shippingAddress: string
  paymentMethod: string
  items: OrderItemView[]
  trackingNumber?: string
}

type OrderItemRow = {
  id: number
  title: string
  quantity: number
  priceCents: number
  product?: {
    images: string[]
    productType: string | null
  } | null
}

type OrderRow = {
  id: number
  createdAt: Date
  totalCents: number
  status: string
  paymentStatus?: string
  eazebusPaymentId?: string | null
  shippingAddress: unknown
  trackingNumber: string | null
  items?: OrderItemRow[]
}

export function mapOrderItem(item: OrderItemRow): OrderItemView {
  const productType = item.product?.productType ?? 'physical'
  let type: OrderItemView['type'] = 'PHYSICAL'
  if (productType === 'course') type = 'COURSE'
  else if (productType === 'digital') type = 'MICRO_LEARNING'
  return {
    id: String(item.id),
    name: item.title,
    quantity: item.quantity,
    price: item.priceCents / 100,
    image: item.product?.images?.[0] ?? '',
    type,
  }
}

export function mapOrder(order: OrderRow): OrderView {
  const shipping =
    order.shippingAddress && typeof order.shippingAddress === 'object'
      ? (order.shippingAddress as { address?: string; fullName?: string }).address ??
        JSON.stringify(order.shippingAddress)
      : null
  return {
    id: String(order.id),
    createdAt: order.createdAt.toISOString(),
    total: order.totalCents / 100,
    status: order.status,
    paymentStatus: order.paymentStatus ?? 'PENDING',
    shippingAddress:
      shipping ?? 'Digital content — delivered instantly to your account.',
    paymentMethod: order.eazebusPaymentId ? 'Online payment' : 'Pending payment',
    trackingNumber: order.trackingNumber ?? undefined,
    items: (order.items ?? []).map(mapOrderItem),
  }
}
