import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'From a duffle bag outside Eaton Centre to owning the building. The story of Cary Grant Clothing, Est. 2002, Barrie, Ontario.',
}

const TIMELINE = [
  {
    year: '2002',
    title: 'A duffle bag outside Eaton Centre',
    desc: 'Started selling CG t-shirts and mix-tapes outside Eaton Centre in Downtown Toronto while sharing a booth with a friend selling watches.',
  },
  {
    year: '2003',
    title: 'The trunk of a car',
    desc: 'Moved to the Jane & Finch area, selling clothing and mix-tapes out of the trunk of the car in the Yorkgate Mall parking lot.',
  },
  {
    year: '2005',
    title: 'A folding table inside the mall',
    desc: 'Got a small space inside Yorkgate Mall — selling on a folding table. The haters started complaining. We kept going.',
  },
  {
    year: 'Today',
    title: 'We own the building',
    desc: '54 Dunlop Street West, Barrie, Ontario. A full store, a full team, and a building we own. The journey continues.',
  },
]

const STATS = [
  { value: '2002', label: 'Year founded' },
  { value: '20+', label: 'Years in business' },
  { value: '120+', label: 'Products' },
  { value: '🇨🇦', label: 'Proudly Canadian' },
]

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">

        {/* Hero */}
        <div className="bg-cgc-ink py-20 px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-px bg-cgc-red" />
              <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">Est. 2002</span>
              <span className="w-6 h-px bg-cgc-red" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Our story</h1>
            <p className="text-white/60 text-base leading-relaxed">
              From a duffle bag to owning the building. This is more than clothing — it's legacy.
            </p>
          </div>
        </div>

        {/* Story intro */}
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
          <blockquote className="text-2xl md:text-3xl font-light text-cgc-ink leading-relaxed italic text-center mb-12">
            "I started selling my CG t-shirts and hats from a duffle bag. LOL…"
          </blockquote>
          <div className="space-y-5 text-cgc-slate leading-relaxed">
            <p>
              The Cary Grant Clothing Company started back in the day when I worked with my friend AKA 
              Big Brother Micks outside the Eaton Centre in Downtown Toronto. We shared a little booth 
              selling watches and I had my designs and mix-tapes in a duffle-bag hustling at the same time.
            </p>
            <p>
              I then went to the Jane & Finch area and sold my CG clothing and mix-tapes outta the trunk 
              of my car in the parking lot of Yorkgate Mall during the day, and then to my friends all 
              over the city at night. To my Portuguese fam', you know who you are — thank you for always 
              supporting my business!
            </p>
            <p>
              After being outside for a few months, I got a little space inside the Mall to sell my 
              clothing and CDs on a folding table. Then the hating began. A few store owners started 
              complaining about me selling clothing, saying it was a conflict of their interest.
            </p>
            <p>
              I then moved across the street to my current location, 54 Dunlop Street West. This space 
              was much bigger than the previous three combined. And today — we own the building.
            </p>
            <p className="font-semibold text-cgc-ink">
              This is more than clothing. This is legacy.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-cgc-bone py-16 px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-cgc-ink mb-10 text-center">The journey</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-cgc-hairline hidden sm:block" />

              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    {/* Year badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cgc-red flex items-center justify-center z-10">
                      <span className="text-white text-[10px] font-bold text-center leading-tight">
                        {item.year === 'Today' ? '📍' : item.year.slice(2)}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="bg-white border border-cgc-hairline rounded-card p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-cgc-red">{item.year}</span>
                      </div>
                      <h3 className="font-bold text-cgc-ink mb-2">{item.title}</h3>
                      <p className="text-sm text-cgc-slate leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16 px-4 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(stat => (
                <div key={stat.label} className="text-center p-6 bg-cgc-bone rounded-card border border-cgc-hairline">
                  <p className="text-3xl font-bold text-cgc-ink">{stat.value}</p>
                  <p className="text-xs text-cgc-slate mt-2 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-cgc-ink py-16 px-4 lg:px-8 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-display text-3xl text-white mb-3">Wear the legacy</h2>
            <p className="text-white/60 text-sm mb-8">
              Every piece of CGC clothing carries the story of where we came from and where we're going.
            </p>
            <Link href="/shop" className="btn btn-red">Shop the collection</Link>
          </div>
        </div>

      </div>
    </SiteLayout>
  )
}
