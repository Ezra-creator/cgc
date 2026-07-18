'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const STATS = [
  { value: '2002', label: 'Founded' },
  { value: '20+', label: 'Years in business' },
  { value: '120+', label: 'Products' },
  { value: '🇨🇦', label: 'Proudly Canadian' },
]

export default function BrandStory() {
  const refLeft = useScrollReveal()
  const refRight = useScrollReveal()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <div ref={refLeft} className="reveal order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/5] bg-cgc-ink rounded-card overflow-hidden relative">
                <Image 
                  src="/images/IMG-20260531-WA0017.jpg"
                  alt="Cary Grant Clothing Owner"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Accent card */}
              <div className="absolute -bottom-4 -right-4 bg-cgc-red text-white p-4 rounded-card">
                <p className="font-mono text-xs uppercase tracking-wider opacity-80">Est.</p>
                <p className="font-display text-2xl">2002</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={refRight} className="reveal order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-cgc-red" />
              <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">Our story</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-cgc-ink leading-tight mb-5">
              From a duffle bag to<br />owning the building.
            </h2>

            <div className="space-y-4 text-cgc-slate leading-relaxed text-sm">
              <p>
                It started outside Eaton Centre in Toronto — CG t-shirts and mix-tapes out of a duffle bag, 
                hustling every single day. Then the trunk of a car in the Yorkgate Mall parking lot. 
                Then a folding table inside the mall.
              </p>
              <p>
                The haters came, but so did the supporters. And the supporters won.
              </p>
              <p>
                Today, Cary Grant Clothing sits at 54 Dunlop Street West, Barrie, Ontario — 
                and we own the building. But the streets? The streets will always be home.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-cgc-hairline">
              {STATS.map(stat => (
                <div key={stat.label}>
                  <p className="text-xl font-bold text-cgc-ink">{stat.value}</p>
                  <p className="text-xs text-cgc-slate mt-0.5 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn btn-primary mt-8 inline-flex">
              Read our full story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
