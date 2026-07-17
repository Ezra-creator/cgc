'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, Instagram, Twitter, Facebook } from 'lucide-react'
import SiteLayout from '@/components/SiteLayout'
import { saveMessage } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await saveMessage(form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const INFO = [
    {
      icon: MapPin,
      label: 'Address',
      value: '54 Dunlop Street West, Main Floor, Barrie, Ontario',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 705-717-1073',
      href: 'tel:+17057171073',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'cary@carygrantclothing.com',
      href: 'mailto:cary@carygrantclothing.com',
    },
    {
      icon: Clock,
      label: 'Store hours',
      value: 'Mon–Sat: 10am – 7pm · Sun: 11am – 5pm',
    },
  ]

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">

        {/* Header */}
        <div className="bg-cgc-bone border-b border-cgc-hairline py-12 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-cgc-red" />
              <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">Get in touch</span>
            </div>
            <h1 className="text-3xl font-bold text-cgc-ink">Contact us</h1>
            <p className="text-sm text-cgc-slate mt-2">
              We'd love to hear from you. Send us a message or visit the store.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-cgc-ink mb-6">Find us</h2>
              <div className="space-y-5">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-cgc-bone border border-cgc-hairline flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-cgc-red" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cgc-slate uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-sm text-cgc-ink hover:text-cgc-red transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-cgc-ink">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="mt-8 pt-8 border-t border-cgc-hairline">
                <p className="text-xs font-semibold text-cgc-slate uppercase tracking-wide mb-4">
                  Follow us
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: 'https://instagram.com/cgclthn', label: 'Instagram' },
                    { icon: Twitter, href: 'https://twitter.com/CG021', label: 'Twitter' },
                    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full border border-cgc-hairline flex items-center justify-center text-cgc-slate hover:border-cgc-ink hover:text-cgc-ink transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 h-48 bg-cgc-bone rounded-card border border-cgc-hairline flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-cgc-red mx-auto mb-2" />
                  <p className="text-sm text-cgc-slate">54 Dunlop St W, Barrie ON</p>
                  <a
                    href="https://maps.google.com/?q=54+Dunlop+Street+West+Barrie+Ontario"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cgc-red hover:underline mt-1 block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-xl font-bold text-cgc-ink mb-6">Send a message</h2>

              {sent ? (
                <div className="bg-cgc-bone border border-cgc-hairline rounded-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-500 text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-cgc-ink mb-2">Message sent!</h3>
                  <p className="text-sm text-cgc-slate">
                    We'll get back to you at {form.email || 'your email'} within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="btn btn-outline mt-5 text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className={`input ${errors.name ? 'border-cgc-red' : ''}`}
                      />
                      {errors.name && <p className="text-xs text-cgc-red mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@email.com"
                        className={`input ${errors.email ? 'border-cgc-red' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-cgc-red mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="What's this about?"
                      className={`input ${errors.subject ? 'border-cgc-red' : ''}`}
                    />
                    {errors.subject && <p className="text-xs text-cgc-red mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help..."
                      className={`textarea ${errors.message ? 'border-cgc-red' : ''}`}
                    />
                    {errors.message && <p className="text-xs text-cgc-red mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full justify-center"
                  >
                    {loading ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
