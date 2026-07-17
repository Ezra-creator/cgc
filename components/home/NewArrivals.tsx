'use client'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[220px] bg-white border border-cgc-hairline rounded-card overflow-hidden">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-6 w-20 rounded" />
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const ref = useScrollReveal()

  useEffect(() => {
    getFeaturedProducts()
      .then(data => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' })
  }

  return (
    <section className="py-16 bg-cgc-bone">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={ref} className="reveal flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cgc-ink">New arrivals</h2>
            <p className="text-sm text-cgc-slate mt-1">Fresh drops from CGC</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-cgc-hairline bg-white flex items-center justify-center text-cgc-slate hover:border-cgc-ink hover:text-cgc-ink transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full border border-cgc-hairline bg-white flex items-center justify-center text-cgc-slate hover:border-cgc-ink hover:text-cgc-ink transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <Link href="/shop" className="hidden sm:block text-sm text-cgc-slate hover:text-cgc-red transition-colors ml-2">
              View all →
            </Link>
          </div>
        </div>

        {/* Scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
            ? (
              <div className="w-full py-12 text-center">
                <p className="text-cgc-slate text-sm">Products coming soon — check back shortly.</p>
              </div>
            )
            : products.map(product => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[220px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))
          }
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/shop" className="btn btn-outline text-sm">
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
