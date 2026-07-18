'use client'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const CATEGORIES = [
  {
    label: "Men's",
    sub: 'Hoodies · Tracksuits · Tees',
    href: '/shop?category=mens',
    gradient: 'from-[#1a1a2a] to-[#2a1f35]',
    span: 'col-span-2 sm:col-span-1 lg:col-span-1 lg:row-span-2',
    height: 'min-h-[340px]',
  },
  {
    label: "Women's",
    sub: 'Dresses · Coats · Tops',
    href: '/shop?category=womens',
    gradient: 'from-[#1f2a1a] to-[#2a351f]',
    span: '',
    height: 'min-h-[160px]',
  },
  {
    label: 'Kids',
    sub: 'Tees · Hoodies',
    href: '/shop?category=kids',
    gradient: 'from-[#2a1a1a] to-[#351f1f]',
    span: '',
    height: 'min-h-[160px]',
  },
  {
    label: 'African Collection',
    sub: 'Prints · Contemporary',
    href: '/shop?category=african',
    gradient: 'from-[#2a2a1a] to-[#35301f]',
    span: '',
    height: 'min-h-[160px]',
  },
  {
    label: 'Active Wear',
    sub: 'Sets · Joggers',
    href: '/shop?category=activewear',
    gradient: 'from-[#1a2a2a] to-[#1f3535]',
    span: '',
    height: 'min-h-[160px]',
  },
]

export default function Categories() {
  const ref = useScrollReveal()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={ref} className="reveal flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-cgc-ink">Shop by category</h2>
          <Link href="/shop" className="text-sm text-cgc-slate hover:text-cgc-red transition-colors">
            View all →
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:grid-rows-2">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`group relative overflow-hidden rounded-card bg-gradient-to-br ${cat.gradient} ${cat.span} ${cat.height} flex flex-col justify-end p-5 cursor-pointer`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-cgc-red/0 group-hover:bg-cgc-red/8 transition-colors duration-300" />

              {/* Red border trace on hover */}
              <div className="absolute inset-0 rounded-card border-2 border-transparent group-hover:border-cgc-red/50 transition-all duration-300" />

              {/* Red dot */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-cgc-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Label */}
              <div className="relative z-10">
                <p className="text-base font-bold text-white group-hover:text-cgc-red transition-colors duration-300">
                  {cat.label}
                </p>
                <p className="text-xs text-white/50 mt-0.5">{cat.sub}</p>
              </div>

              {/* Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
