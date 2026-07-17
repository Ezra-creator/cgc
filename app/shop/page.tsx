'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import SiteLayout from '@/components/SiteLayout'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/supabase'
import { Product } from '@/types'
import { CATEGORIES, SIZES } from '@/lib/utils'

const ALL_CATEGORIES = [{ value: 'all', label: 'All' }, ...CATEGORIES]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
]

function SkeletonCard() {
  return (
    <div className="bg-white border border-cgc-hairline rounded-card overflow-hidden">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-6 w-1/2 rounded" />
      </div>
    </div>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(categoryParam)
  const [size, setSize] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProducts(category === 'all' ? undefined : category)
      .then(data => {
        setProducts(data || [])
        setFiltered(data || [])
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category])

  useEffect(() => {
    let result = [...products]
    if (size) result = result.filter(p => p.sizes.includes(size))
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    setFiltered(result)
  }, [products, size, sort])

  const clearFilters = () => { setSize(''); setSort('newest') }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">
        {/* Hero bar */}
        <div className="bg-cgc-bone border-b border-cgc-hairline py-10 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-cgc-ink">Shop all</h1>
            <p className="text-sm text-cgc-slate mt-1">
              {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-30 bg-white border-b border-cgc-hairline">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* Category pills */}
            <div className="flex gap-2 flex-shrink-0">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-pill text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat.value
                      ? 'bg-cgc-ink text-white'
                      : 'bg-cgc-bone text-cgc-slate hover:text-cgc-ink hover:bg-cgc-hairline'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-xs text-cgc-ink bg-cgc-bone border border-cgc-hairline rounded-btn px-3 py-2 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-btn border transition-all ${
                  showFilters || size
                    ? 'bg-cgc-ink text-white border-cgc-ink'
                    : 'bg-white text-cgc-ink border-cgc-hairline hover:border-cgc-ink'
                }`}
              >
                <SlidersHorizontal size={13} />
                Filter
                {size && <span className="bg-cgc-red text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">1</span>}
              </button>
            </div>
          </div>

          {/* Size filter row */}
          {showFilters && (
            <div className="border-t border-cgc-hairline bg-cgc-bone">
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-cgc-slate uppercase tracking-wider">Size:</span>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-btn text-xs font-semibold border transition-all ${
                      size === s
                        ? 'bg-cgc-ink text-white border-cgc-ink'
                        : 'bg-white text-cgc-ink border-cgc-hairline hover:border-cgc-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {(size) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-cgc-red hover:text-cgc-ink transition-colors ml-2"
                  >
                    <X size={12} /> Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-semibold text-cgc-ink mb-2">No products found</p>
              <p className="text-sm text-cgc-slate mb-6">Try a different category or clear your filters.</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="reveal"
                  style={{ transitionDelay: `${Math.min(i * 0.05, 0.3)}s` }}
                  ref={el => {
                    if (el) {
                      setTimeout(() => el.classList.add('revealed'), 50 + i * 50)
                    }
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <SiteLayout>
        <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
          <p className="text-cgc-slate text-sm">Loading shop...</p>
        </div>
      </SiteLayout>
    }>
      <ShopContent />
    </Suspense>
  )
}
