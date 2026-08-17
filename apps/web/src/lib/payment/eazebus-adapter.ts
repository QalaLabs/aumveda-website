import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutSession,
  PaymentVerification,
} from '@/lib/payment/types'

/**
 * EazeBus payment adapter.
 *
 * IMPORTANT: This is a skeleton adapter. The actual EazeBus API contract
 * (endpoints, authentication, webhook format) is not yet documented in this
 * repository. The implementation below is a structural placeholder that
 * follows the PaymentProvider interface.
 *
 * To complete this integration you need:
 * 1. EazeBus API documentation (REST endpoints, auth method)
 * 2. EazeBus merchant credentials (merchantId, apiKey, etc.)
 * 3. Environment variables: EAZEBUS_MERCHANT_ID, EAZEBUS_API_KEY, EAZEBUS_BASE_URL, EAZEBUS_WEBHOOK_SECRET
 * 4. Webhook endpoint at /api/webhooks/eazebus
 *
 * Once documentation is available, replace the TODO sections below.
 */
export class EazeBusAdapter implements PaymentProvider {
  private baseUrl: string
  private merchantId: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.EAZEBUS_BASE_URL ?? 'https://api.eazebus.com'
    this.merchantId = process.env.EAZEBUS_MERCHANT_ID ?? ''
    this.apiKey = process.env.EAZEBUS_API_KEY ?? ''
  }

  isConfigured(): boolean {
    return Boolean(this.merchantId && this.apiKey)
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    if (!this.isConfigured()) {
      throw new Error('EazeBus is not configured. Set EAZEBUS_MERCHANT_ID and EAZEBUS_API_KEY.')
    }

    // TODO: Replace with actual EazeBus API call once documentation is available.
    //
    // Expected flow:
    // 1. POST to EazeBus checkout/create endpoint
    // 2. Send: amount, currency, order reference, customer details, return URL
    // 3. Receive: session ID + payment URL redirect
    //
    // Example (to be replaced):
    // const response = await fetch(`${this.baseUrl}/api/v1/checkout/create`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'X-Merchant-Id': this.merchantId,
    //   },
    //   body: JSON.stringify({
    //     amount: params.amountPaise,
    //     currency: params.currency,
    //     order_id: params.orderId,
    //     customer_email: params.customerEmail,
    //     customer_name: params.customerName,
    //     return_url: params.returnUrl,
    //     metadata: params.metadata,
    //   }),
    // })
    // const data = await response.json()
    // return { sessionId: data.session_id, paymentUrl: data.payment_url }

    throw new Error(
      'EazeBus checkout not yet implemented. ' +
      'Provide EazeBus API documentation to complete this integration.'
    )
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerification> {
    if (!this.isConfigured()) {
      throw new Error('EazeBus is not configured.')
    }

    // TODO: Replace with actual EazeBus payment verification.
    //
    // Expected flow:
    // 1. GET or POST to EazeBus verify/status endpoint
    // 2. Send: payment ID / transaction ID
    // 3. Receive: status, amount, verification hash
    //
    // Example (to be replaced):
    // const response = await fetch(`${this.baseUrl}/api/v1/payment/verify/${paymentId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'X-Merchant-Id': this.merchantId,
    //   },
    // })
    // const data = await response.json()
    // return {
    //   verified: data.status === 'SUCCESS',
    //   status: mapEazeBusStatus(data.status),
    //   amountPaise: data.amount,
    //   paymentId: data.payment_id,
    //   rawPayload: data,
    // }

    throw new Error(
      'EazeBus payment verification not yet implemented. ' +
      'Provide EazeBus API documentation to complete this integration.'
    )
  }

  async processWebhook(payload: Record<string, unknown>, _signature?: string): Promise<{ orderId: string; status: PaymentVerification['status'] } | null> {
    if (!this.isConfigured()) {
      throw new Error('EazeBus is not configured.')
    }

    // TODO: Replace with actual EazeBus webhook processing.
    //
    // Expected flow:
    // 1. Verify webhook signature using EAZEBUS_WEBHOOK_SECRET
    // 2. Extract order_id and payment status from payload
    // 3. Map EazeBus status to internal status
    //
    // Example (to be replaced):
    // if (!this.verifyWebhookSignature(payload, _signature)) {
    //   throw new Error('Invalid webhook signature')
    // }
    // return {
    //   orderId: payload.order_id as string,
    //   status: mapEazeBusStatus(payload.status as string),
    // }

    throw new Error(
      'EazeBus webhook processing not yet implemented. ' +
      'Provide EazeBus API documentation to complete this integration.'
    )
  }

  async refundPayment(paymentId: string, amountPaise?: number): Promise<{ refunded: boolean; refundId: string | null }> {
    if (!this.isConfigured()) {
      throw new Error('EazeBus is not configured.')
    }

    // TODO: Replace with actual EazeBus refund API.
    throw new Error(
      'EazeBus refund not yet implemented. ' +
      'Provide EazeBus API documentation to complete this integration.'
    )
  }
}

let _instance: EazeBusAdapter | null = null

export function getPaymentProvider(): EazeBusAdapter {
  if (!_instance) {
    _instance = new EazeBusAdapter()
  }
  return _instance
}
