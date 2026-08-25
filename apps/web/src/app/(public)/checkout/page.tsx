'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Loader2, Package } from 'lucide-react'
import { showError } from '@/utils/toast'
import { useCart } from '@/lib/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalCents, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      showError('Your cart is empty')
      return
    }
    if (!form.customerEmail || !form.fullName || !form.addressLine1 || !form.city || !form.state || !form.pincode) {
      showError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          customerEmail: form.customerEmail,
          customerName: form.customerName || form.fullName,
          customerPhone: form.customerPhone || form.phone,
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone || form.customerPhone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: 'India',
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')

      if (data.paymentUrl) {
        clearCart()
        window.location.href = data.paymentUrl
        return
      }

      router.push(`/checkout/confirmation?orderId=${data.orderId}`)
    } catch (err: any) {
      showError(err.message ?? 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-slate-900">Your cart is empty</h1>
          <p className="text-slate-500">Explore our collection and add something that speaks to you.</p>
          <Button asChild className="bg-slate-900 hover:bg-black">
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shop"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop</Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input id="customerEmail" type="email" required value={form.customerEmail} onChange={e => update('customerEmail', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Name</Label>
                      <Input id="customerName" value={form.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Your name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" required value={form.fullName} onChange={e => update('fullName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address *</Label>
                    <Input id="addressLine1" required value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} placeholder="Street address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Apartment, suite, etc.</Label>
                    <Input id="addressLine2" value={form.addressLine2} onChange={e => update('addressLine2', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" required value={form.city} onChange={e => update('city', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" required value={form.state} onChange={e => update('state', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" required value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary ({totalItems} items)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="space-y-2">
                      <div className="flex gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                          <p className="text-xs text-slate-400">₹{(item.priceCents / 100).toLocaleString('en-IN')}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-auto text-slate-400 hover:text-red-500" onClick={() => removeItem(item.productId)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900 shrink-0">
                          ₹{((item.priceCents * item.quantity) / 100).toLocaleString('en-IN')}
                        </div>
                      </div>
                      {item.bundle && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-slate-600">
                          <span className="font-bold text-amber-700 uppercase tracking-wide mr-1.5">Bundle available</span>
                          Pair with a {item.bundle.sessionLabel} ({item.bundle.serviceType}) for ₹{(item.bundle.bundlePriceCents / 100).toLocaleString('en-IN')} — book the session separately to redeem this price; it isn&apos;t applied automatically at this checkout.
                        </div>
                      )}
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium">₹{(totalCents / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-medium text-emerald-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="font-black text-slate-900 text-lg">₹{(totalCents / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black font-bold" size="lg">
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Place Order
                  </Button>

                  <p className="text-[10px] text-slate-400 text-center">
                    Online payment is not yet available. Our team will contact you to complete your purchase.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
