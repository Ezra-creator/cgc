'use client'
import { useState } from 'react'
import { subscribeNewsletter } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useScrollReveal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await subscribeNewsletter(email)
      setDone(true)
      setEmail('')
      toast.success('You\'re in! Welcome to the CGC family.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-white border-t border-cgc-hairline">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div ref={ref} className="reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-cgc-red" />
            <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">Stay connected</span>
            <span className="w-6 h-px bg-cgc-red" />
          </div>

          <h2 className="text-2xl font-bold text-cgc-ink mb-2">Join the CGC family</h2>
          <p className="text-sm text-cgc-slate mb-8">
            New drops, exclusive offers and store updates. No spam, ever.
          </p>

          {done ? (
            <div className="bg-cgc-bone border border-cgc-hairline rounded-card px-6 py-4">
              <p className="font-semibold text-cgc-ink">You're in! 🎉</p>
              <p className="text-sm text-cgc-slate mt-1">Watch your inbox for CGC updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 border border-cgc-hairline rounded-btn overflow-hidden max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 text-sm text-cgc-ink placeholder-cgc-slate/50 bg-white outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-cgc-ink text-white text-sm font-semibold px-5 py-3 hover:bg-cgc-red transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="text-xs text-cgc-slate/50 mt-4">
            By subscribing you agree to receive marketing emails. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
