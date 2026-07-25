'use client'

import { useState } from 'react'

interface PaymentFormProps {
  basePrice: number
  packageName: string
  onPaymentSuccess: (razorpayPaymentId: string) => void
  onCancel: () => void
}

/**
 * Stripe-level checkout clarity — one primary action, transparent totals, calm states.
 * Payment simulation preserved (Razorpay mock) — backend integration unchanged.
 */
export function PaymentForm({
  basePrice,
  packageName,
  onPaymentSuccess,
  onCancel,
}: PaymentFormProps) {
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [paying, setPaying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [payError, setPayError] = useState('')
  const [showCoupon, setShowCoupon] = useState(false)

  const discountedBase = Math.max(0, basePrice - discount)
  const gstAmount = Math.round(discountedBase * 0.18 * 100) / 100
  const totalAmount = discountedBase + gstAmount

  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')
    const code = coupon.trim().toUpperCase()

    if (code === 'HEAL50') {
      setDiscount(Math.round(basePrice * 0.5 * 100) / 100)
      setCouponSuccess('50% applied')
    } else if (code === 'WELCOME10') {
      setDiscount(Math.round(basePrice * 0.1 * 100) / 100)
      setCouponSuccess('10% applied')
    } else {
      setCouponError('Code not recognised')
      setDiscount(0)
    }
  }

  const triggerPayment = () => {
    setPayError('')
    setPaying(true)

    setTimeout(() => {
      // Simulated secure Razorpay handoff — replace with live SDK when keys ready
      const ok = true
      if (!ok) {
        setPaying(false)
        setPayError('Payment could not be completed. Nothing was charged. Try again.')
        return
      }
      setPaying(false)
      setPaymentSuccess(true)
      setTimeout(() => {
        const mockPayId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
        onPaymentSuccess(mockPayId)
      }, 1200)
    }, 2200)
  }

  const inr = (n: number) =>
    n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Secure checkout
        </p>
        <h3 className="font-serif text-2xl text-[hsl(var(--av-parchment))]">Confirm your investment</h3>
      </div>

      {/* Transparent invoice */}
      <div className="rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-ink)/0.5)] p-6 space-y-4">
        <div className="flex justify-between gap-4 font-body text-sm">
          <span className="text-[hsl(var(--av-parchment)/0.65)]">{packageName}</span>
          <span className="tabular text-[hsl(var(--av-parchment))]">{inr(basePrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between gap-4 font-body text-sm text-[hsl(var(--av-sage))]">
            <span>Discount</span>
            <span className="tabular">− {inr(discount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4 font-body text-sm text-[hsl(var(--av-parchment)/0.45)]">
          <span>GST (18%)</span>
          <span className="tabular">{inr(gstAmount)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] pt-4">
          <span className="font-serif text-lg text-[hsl(var(--av-parchment))]">Total due</span>
          <span className="font-serif text-xl tabular text-[hsl(var(--av-gold-soft))]">
            {inr(totalAmount)}
          </span>
        </div>
      </div>

      {/* Coupon — progressive disclosure */}
      {!paymentSuccess && (
        <div>
          {!showCoupon ? (
            <button
              type="button"
              onClick={() => setShowCoupon(true)}
              className="font-body text-sm text-[hsl(var(--av-parchment)/0.45)] underline underline-offset-4"
            >
              Have a code?
            </button>
          ) : (
            <div className="space-y-2">
              <label htmlFor="coupon" className="sr-only">
                Coupon code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Code"
                  className="flex-1 min-h-[44px] rounded-xl border border-[hsl(var(--av-parchment)/0.15)] bg-transparent px-4 font-body text-sm text-[hsl(var(--av-parchment))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--av-gold))]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="min-h-[44px] px-4 rounded-xl border border-[hsl(var(--av-parchment)/0.2)] font-body text-sm text-[hsl(var(--av-parchment))]"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="font-body text-xs text-[hsl(var(--av-rose))]" role="alert">
                  {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="font-body text-xs text-[hsl(var(--av-sage))]" role="status">
                  {couponSuccess}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Trust line */}
      <ul className="space-y-2 font-body text-xs text-[hsl(var(--av-parchment)/0.45)]">
        <li>Encrypted payment via Razorpay</li>
        <li>You will receive a receipt by email</li>
        <li>Reschedule or cancel up to 24 hours before your session</li>
      </ul>

      {payError && (
        <p className="font-body text-sm text-[hsl(var(--av-rose))] rounded-xl border border-[hsl(var(--av-rose)/0.3)] px-4 py-3" role="alert">
          {payError}
        </p>
      )}

      {paying ? (
        <div className="py-6 text-center space-y-3" role="status" aria-live="polite">
          <div
            className="mx-auto w-8 h-8 rounded-full border-2 border-[hsl(var(--av-gold))] border-t-transparent animate-spin"
            aria-hidden
          />
          <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)]">
            Connecting securely…
          </p>
        </div>
      ) : paymentSuccess ? (
        <div className="py-6 text-center space-y-2" role="status" aria-live="polite">
          <p className="font-serif text-xl text-[hsl(var(--av-gold-soft))]">Payment received</p>
          <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.55)]">
            Preparing your confirmation…
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={triggerPayment}
            className="w-full min-h-[52px] rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium text-base transition-transform duration-100 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold-soft))]"
          >
            Pay {inr(totalAmount)}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] font-body text-sm text-[hsl(var(--av-parchment)/0.4)] hover:text-[hsl(var(--av-parchment)/0.7)]"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}
