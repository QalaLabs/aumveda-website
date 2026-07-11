export interface ProkeralaAstrologyClient {
  calculateChart(params: {
    dob: string
    timeOfBirth?: string
    lat: number
    lng: number
  }): Promise<{
    sunSign: string
    moonSign: string
    risingSign: string | null
    houses?: Record<string, unknown>
  }>
}

export interface GooglePlacesClient {
  autocomplete(input: string): Promise<Array<{
    placeId: string
    description: string
    lat: number
    lng: number
  }>>
  getPlaceDetails(placeId: string): Promise<{
    lat: number
    lng: number
    formattedAddress: string
    components: Record<string, string>
  }>
}

export interface BookingProvider {
  createBooking(params: {
    userId?: string
    email: string
    name?: string
    practitioner: string
    serviceType: string
    preferredDatetime?: string
    timezone?: string
  }): Promise<{
    bookingId: string
    eventUrl: string
    startTime: string
    endTime: string
    zoomLink?: string
  }>
  getAvailability(params: {
    practitioner: string
    serviceType: string
    dateRange: { start: string; end: string }
  }): Promise<Array<{ start: string; end: string }>>
}

export interface PaymentProvider {
  createCheckoutSession(params: {
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    metadata?: Record<string, string>
  }): Promise<{
    sessionId: string
    paymentUrl: string
  }>
  verifyPayment(paymentId: string): Promise<{
    verified: boolean
    status: string
    amount: number
  }>
  createSubscription(params: {
    planId: string
    customerEmail: string
    customerName?: string
  }): Promise<{
    subscriptionId: string
    paymentUrl: string
  }>
}

export interface N8nWebhookDispatcher {
  dispatch(eventName: string, payload: Record<string, unknown>): Promise<void>
}

export interface AhiEngineClient {
  generateDailyDose(userContext: Record<string, unknown>): Promise<{
    title: string
    audioKey?: string
    promptText: string
    durationSec: number
  }>
  generateInitialPlan(userContext: Record<string, unknown>): Promise<Array<{
    day: number
    practiceType: string
    instructionText: string
  }>>
  generatePreSessionBrief(userId: string): Promise<{
    practitionerFocusAreas: string[]
    summary: string
  }>
}

export interface DailyDoseAdapter {
  getDoseForUser(userId: string, date: string): Promise<{
    title: string
    audioUrl?: string
    promptText: string
    durationSec: number
  }>
  submitCompletion(userId: string, doseId: string): Promise<void>
}

export interface CrmClient {
  syncLead(data: {
    email: string
    name?: string
    phone?: string
    source: string
    metadata?: Record<string, unknown>
  }): Promise<{ contactId: string }>
  syncPortalCompletion(data: {
    email: string
    portalData: Record<string, unknown>
    profileResult: string
  }): Promise<void>
}

export interface IntegrationProvider {
  astrology: ProkeralaAstrologyClient
  places: GooglePlacesClient
  booking: BookingProvider
  payment: PaymentProvider
  webhooks: N8nWebhookDispatcher
  ahi: AhiEngineClient
  dailyDose: DailyDoseAdapter
  crm: CrmClient
}

export type IntegrationConfig = {
  astrology: boolean
  places: boolean
  booking: boolean
  payment: boolean
  webhooks: boolean
  ahi: boolean
  dailyDose: boolean
  crm: boolean
}
