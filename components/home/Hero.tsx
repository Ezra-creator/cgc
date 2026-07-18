'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cgc-ink">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <div
          className="absolute inset-0 ken-burns opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #3a0a0a 0%, #000000 100%)',
          }}
        />
        {/* Attractive Glowing Gradient Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-cgc-red/40 blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-rose-700/30 blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-orange-500/20 blur-3xl pointer-events-none mix-blend-screen" />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div
            className="reveal revealed flex items-center gap-3 mb-6"
            style={{ transitionDelay: '0.1s' }}
          >
            <span className="w-8 h-px bg-cgc-red" />
            <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">
              Est. 2002 — Barrie, Ontario 🇨🇦
            </span>
          </div>

          {/* Headline */}
          <h1
            className="reveal revealed font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.02] mb-6"
            style={{ transitionDelay: '0.2s' }}
          >
            Built for the streets.{' '}
            <em className="not-italic text-cgc-red">Made for everyone.</em>
          </h1>

          {/* Subtext */}
          <p
            className="reveal revealed text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
            style={{ transitionDelay: '0.35s' }}
          >
            Premium Canadian streetwear for the whole family — hoodies, tracksuits,
            African prints, women's wear and more.
          </p>

          {/* CTAs */}
          <div
            className="reveal revealed flex flex-wrap gap-3"
            style={{ transitionDelay: '0.5s' }}
          >
            <Link href="/shop" className="btn btn-red">
              Shop now
            </Link>
            <Link href="/about" className="btn btn-outline-white">
              Our story
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className="reveal revealed mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-sm"
            style={{ transitionDelay: '0.65s' }}
          >
            {[
              { value: '2002', label: 'Founded' },
              { value: '20+', label: 'Years' },
              { value: '120+', label: 'Products' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display text-2xl text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address card */}
      <div className="absolute bottom-6 right-4 lg:right-8 hidden md:block">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-card px-4 py-3">
          <p className="font-mono text-[11px] text-white/40 uppercase tracking-wider mb-0.5">Visit us</p>
          <p className="text-sm font-medium text-white">54 Dunlop St W, Barrie ON</p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/60 animate-[scrollDot_1.6s_ease_infinite]" />
        </div>
      </div>
    </section>
  )
}
