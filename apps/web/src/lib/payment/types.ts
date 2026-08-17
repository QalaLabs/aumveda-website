export interface CreateCheckoutParams {
  amountPaise: number
  currency: string
  orderId: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  metadata?: Record<string, string>
  returnUrl: string
}

export interface CheckoutSession {
  sessionId: string
  paymentUrl: string
}

export interface PaymentVerification {
  verified: boolean
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  amountPaise: number
  paymentId: string | null
  rawPayload?: Record<string, unknown>
}

export interface PaymentProvider {
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession>
  verifyPayment(paymentId: string): Promise<PaymentVerification>
  processWebhook(payload: Record<string, unknown>, signature?: string): Promise<{ orderId: string; status: PaymentVerification['status'] } | null>
  refundPayment(paymentId: string, amountPaise?: number): Promise<{ refunded: boolean; refundId: string | null }>
}

export type PaymentProviderName = 'eazebus'
