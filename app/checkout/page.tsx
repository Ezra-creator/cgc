'use client'
import { useState } from 'react'
import { Check, Lock, CreditCard, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { useCartStore } from '@/store/cart'
import { createOrder } from '@/lib/supabase'
import { formatPrice, calculateTax, generateOrderId, PROVINCES } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'shipping' | 'payment' | 'success'

const emptyShipping = {
  firstName: '', lastName: '', email: '',
  phone: '', address: '', city: '',
  province: 'Ontario', postalCode: '', country: 'Canada',
}

const emptyCard = { name: '', number: '', expiry: '', cvv: '' }

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const formatExpiry = (v: string) =>
  v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/')

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('shipping')
  const [shipping, setShipping] = useState(emptyShipping)
  const [card, setCard] = useState(emptyCard)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState('')

  const sub = subtotal()
  const tax = calculateTax(sub)
  const total = sub + tax

  const validateShipping = () => {
    const e: Record<string, string> = {}
    if (!shipping.firstName.trim()) e.firstName = 'Required'
    if (!shipping.lastName.trim()) e.lastName = 'Required'
    if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Valid email required'
    if (!shipping.address.trim()) e.address = 'Required'
    if (!shipping.city.trim()) e.city = 'Required'
    if (!shipping.province) e.province = 'Required'
    if (!shipping.postalCode.trim()) e.postalCode = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = () => {
    const e: Record<string, string> = {}
    if (!card.name.trim()) e.name = 'Required'
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Enter a valid card number'
    if (card.expiry.length < 5) e.expiry = 'Enter expiry date'
    if (card.cvv.length < 3) e.cvv = 'Enter CVV'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return
    setPlacing(true)
    try {
      // Simulate processing delay for demo
      await new Promise(r => setTimeout(r, 1800))

      const id = generateOrderId()
      await createOrder({
        customer_name: `${shipping.firstName} ${shipping.lastName}`,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        province: shipping.province,
        postal_code: shipping.postalCode,
        country: shipping.country,
        items,
        subtotal: sub,
        tax,
        total,
        payment_status: 'demo',
        status: 'pending',
      })

      // Send confirmation email
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              id,
              customer_name: `${shipping.firstName} ${shipping.lastName}`,
              email: shipping.email,
              phone: shipping.phone,
              address: shipping.address,
              city: shipping.city,
              province: shipping.province,
              postal_code: shipping.postalCode,
              country: shipping.country,
              items,
              subtotal: sub,
              tax,
              total,
            },
          }),
        })
      } catch { /* Email failure is non-blocking */ }

      setOrderId(id)
      clearCart()
      setStep('success')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const Field = ({
    label, name, value, onChange, type = 'text', placeholder = '', error = '', className = '',
  }: {
    label: string; name: string; value: string; onChange: (v: string) => void
    type?: string; placeholder?: string; error?: string; className?: string
  }) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input ${error ? 'border-cgc-red' : ''}`}
      />
      {error && <p className="text-xs text-cgc-red mt-1">{error}</p>}
    </div>
  )

  if (items.length === 0 && step !== 'success') {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-cgc-ink mb-3">Your bag is empty</p>
            <Link href="/shop" className="btn btn-primary">Shop now</Link>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-cgc-bone pt-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">

          {/* Step indicator */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-4 mb-10">
              {(['shipping', 'payment'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${step === s ? 'text-cgc-ink' : step === 'payment' && s === 'shipping' ? 'text-green-600' : 'text-cgc-slate'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      step === s ? 'border-cgc-ink bg-cgc-ink text-white' :
                      step === 'payment' && s === 'shipping' ? 'border-green-500 bg-green-500 text-white' :
                      'border-cgc-hairline bg-white text-cgc-slate'
                    }`}>
                      {step === 'payment' && s === 'shipping' ? <Check size={12} /> : i + 1}
                    </div>
                    <span className="text-sm font-medium capitalize hidden sm:block">{s}</span>
                  </div>
                  {i === 0 && <div className="w-12 h-px bg-cgc-hairline" />}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* STEP 1 — Shipping */}
                {step === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-card border border-cgc-hairline p-6 lg:p-8"
                  >
                    <h2 className="text-xl font-bold text-cgc-ink mb-6">Shipping information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="First name" name="firstName" value={shipping.firstName}
                        onChange={v => setShipping(s => ({ ...s, firstName: v }))}
                        error={errors.firstName} />
                      <Field label="Last name" name="lastName" value={shipping.lastName}
                        onChange={v => setShipping(s => ({ ...s, lastName: v }))}
                        error={errors.lastName} />
                      <Field label="Email address" name="email" value={shipping.email} type="email"
                        onChange={v => setShipping(s => ({ ...s, email: v }))}
                        error={errors.email} className="sm:col-span-2" />
                      <Field label="Phone number" name="phone" value={shipping.phone} type="tel"
                        onChange={v => setShipping(s => ({ ...s, phone: v }))}
                        placeholder="Optional" className="sm:col-span-2" />
                      <Field label="Street address" name="address" value={shipping.address}
                        onChange={v => setShipping(s => ({ ...s, address: v }))}
                        error={errors.address} className="sm:col-span-2" />
                      <Field label="City" name="city" value={shipping.city}
                        onChange={v => setShipping(s => ({ ...s, city: v }))}
                        error={errors.city} />
                      <Field label="Postal code" name="postalCode" value={shipping.postalCode}
                        onChange={v => setShipping(s => ({ ...s, postalCode: v }))}
                        error={errors.postalCode} />
                      <div>
                        <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                          Province
                        </label>
                        <select
                          value={shipping.province}
                          onChange={e => setShipping(s => ({ ...s, province: e.target.value }))}
                          className="input"
                        >
                          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {errors.province && <p className="text-xs text-cgc-red mt-1">{errors.province}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                          Country
                        </label>
                        <input value="Canada" disabled className="input bg-cgc-bone text-cgc-slate cursor-not-allowed" />
                      </div>
                    </div>

                    <button
                      onClick={() => { if (validateShipping()) setStep('payment') }}
                      className="btn btn-primary w-full justify-center mt-6"
                    >
                      Continue to payment <ChevronRight size={15} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2 — Payment */}
                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-card border border-cgc-hairline p-6 lg:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-cgc-ink">Payment</h2>
                      <div className="flex items-center gap-1.5 text-xs text-cgc-slate">
                        <Lock size={12} />
                        Secured checkout
                      </div>
                    </div>

                    {/* Accepted cards */}
                    <div className="flex items-center gap-2 mb-6 pb-6 border-b border-cgc-hairline">
                      {['VISA', 'MC', 'AMEX'].map(c => (
                        <span key={c} className="border border-cgc-hairline text-cgc-ink font-mono text-[11px] px-2.5 py-1 rounded">
                          {c}
                        </span>
                      ))}
                      <span className="text-xs text-cgc-slate ml-1">accepted</span>
                    </div>

                    <div className="space-y-4">
                      <Field label="Cardholder name" name="name" value={card.name}
                        placeholder="John Smith"
                        onChange={v => setCard(c => ({ ...c, name: v }))}
                        error={errors.name} />
                      <div>
                        <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                          Card number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={card.number}
                            onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`input pr-10 ${errors.number ? 'border-cgc-red' : ''}`}
                          />
                          <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-cgc-slate" />
                        </div>
                        {errors.number && <p className="text-xs text-cgc-red mt-1">{errors.number}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                            Expiry date
                          </label>
                          <input
                            type="text"
                            value={card.expiry}
                            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`input ${errors.expiry ? 'border-cgc-red' : ''}`}
                          />
                          {errors.expiry && <p className="text-xs text-cgc-red mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={card.cvv}
                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="123"
                            maxLength={4}
                            className={`input ${errors.cvv ? 'border-cgc-red' : ''}`}
                          />
                          {errors.cvv && <p className="text-xs text-cgc-red mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep('shipping')}
                        className="btn btn-ghost flex-shrink-0"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="btn btn-primary flex-1 justify-center"
                      >
                        {placing ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <><Lock size={14} /> Place order — {formatPrice(total)}</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-card border border-cgc-hairline p-8 lg:p-12 text-center"
                  >
                    {/* Animated checkmark */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-full border-4 border-cgc-red flex items-center justify-center">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <path
                            d="M8 18l7 7 13-13"
                            stroke="#E0102A"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="checkmark-path"
                          />
                        </svg>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-cgc-ink mb-2">Order confirmed!</h2>
                    <p className="text-cgc-slate mb-2">
                      Thank you, {shipping.firstName}! Your order has been received.
                    </p>
                    {orderId && (
                      <p className="font-mono text-xs text-cgc-slate mb-6">Order #{orderId}</p>
                    )}

                    <div className="bg-cgc-bone rounded-card p-5 text-left mb-8 space-y-2">
                      <p className="text-sm text-cgc-slate">
                        ✉️ A confirmation email has been sent to <strong className="text-cgc-ink">{shipping.email}</strong>
                      </p>
                      <p className="text-sm text-cgc-slate">
                        📞 We'll be in touch shortly at {shipping.phone || shipping.email} to confirm your delivery.
                      </p>
                      <p className="text-sm text-cgc-slate">
                        📍 You can also pick up in-store at 54 Dunlop St W, Barrie ON.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/shop" className="btn btn-primary">
                        Continue shopping
                      </Link>
                      <Link href="/account" className="btn btn-outline">
                        View my orders
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            {step !== 'success' && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-card border border-cgc-hairline p-6 sticky top-24">
                  <h3 className="text-base font-bold text-cgc-ink mb-4">Order summary</h3>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                        <div className="w-12 h-14 bg-cgc-bone rounded-lg flex-shrink-0 overflow-hidden">
                          {item.product.images?.[0] && (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-cgc-ink line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-cgc-slate">{item.size} · Qty {item.quantity}</p>
                          <p className="text-xs font-bold text-cgc-red mt-0.5">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-cgc-hairline text-sm">
                    <div className="flex justify-between">
                      <span className="text-cgc-slate">Subtotal</span>
                      <span className="text-cgc-ink">{formatPrice(sub)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cgc-slate">HST (13%)</span>
                      <span className="text-cgc-ink">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-cgc-hairline text-base">
                      <span className="text-cgc-ink">Total</span>
                      <span className="text-cgc-red">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
