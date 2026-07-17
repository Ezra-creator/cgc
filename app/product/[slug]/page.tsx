'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Heart, ChevronDown, ChevronLeft, ShoppingBag, Check } from 'lucide-react'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import ProductCard from '@/components/ProductCard'
import { getProductBySlug, getRelatedProducts } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductBySlug(slug)
      .then(async data => {
        setProduct(data)
        if (data?.colors?.[0]) setSelectedColor(data.colors[0])
        if (data?.category) {
          const rel = await getRelatedProducts(data.category, data.id)
          setRelated(rel || [])
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToBag = () => {
    if (!product) return
    if (!selectedSize) {
      setSizeError(true)
      toast.error('Please select a size')
      return
    }
    setSizeError(false)
    setAdding(true)
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor || 'Default')
    }
    setAdded(true)
    toast.success(`${product.name} added to bag`)
    setTimeout(() => { setAdding(false); setAdded(false) }, 2000)
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-white pt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="skeleton aspect-square rounded-card" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`skeleton h-6 rounded ${i === 0 ? 'w-1/3' : i === 1 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </SiteLayout>
    )
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-cgc-ink mb-3">Product not found</p>
            <Link href="/shop" className="btn btn-primary">Back to shop</Link>
          </div>
        </div>
      </SiteLayout>
    )
  }

  const accordionItems = [
    {
      id: 'details',
      label: 'Product details',
      content: product.description || 'Premium quality CGC product. Made to last.',
    },
    {
      id: 'sizing',
      label: 'Size guide',
      content: 'XS: 32–34" chest · S: 34–36" · M: 38–40" · L: 42–44" · XL: 46–48" · XXL: 50–52". When in doubt, size up.',
    },
    {
      id: 'care',
      label: 'Care instructions',
      content: 'Machine wash cold, gentle cycle. Tumble dry low. Do not bleach. Iron on low heat if needed.',
    },
  ]

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-cgc-slate mb-8">
            <Link href="/" className="hover:text-cgc-red transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-cgc-red transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-cgc-red transition-colors capitalize">
              {product.category.replace('african', 'African Collection').replace('activewear', 'Active Wear')}
            </Link>
            <span>/</span>
            <span className="text-cgc-ink font-medium truncate max-w-[140px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* LEFT — Images */}
            <div>
              {/* Main image */}
              <div className="relative aspect-square bg-cgc-bone rounded-card overflow-hidden mb-3">
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-cgc-slate text-xs font-mono">product photo</span>
                  </div>
                )}
                {/* Counter */}
                {product.images?.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-cgc-ink text-xs font-mono px-2 py-1 rounded-pill">
                    {selectedImage + 1} / {product.images.length}
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-cgc-ink' : 'border-transparent hover:border-cgc-hairline'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div className="lg:sticky lg:top-24 h-fit">
              {/* Category + stock */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-cgc-slate capitalize">
                  {product.category.replace('african', 'African Collection').replace('activewear', 'Active Wear')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-cgc-slate'}`} />
                  <span className="text-xs text-cgc-slate">{product.in_stock ? 'In stock' : 'Out of stock'}</span>
                </div>
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-cgc-ink leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="swing-tag text-base">
                  CGC <span className="price">{formatPrice(product.price)}</span>
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-cgc-slate leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Size selector */}
              {product.sizes?.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-cgc-ink uppercase tracking-wider">
                      Size {selectedSize && <span className="font-normal text-cgc-slate ml-1">— {selectedSize}</span>}
                    </label>
                    <button className="text-xs text-cgc-slate hover:text-cgc-red transition-colors">
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => { setSelectedSize(s); setSizeError(false) }}
                        className={`min-w-[44px] h-11 px-3 rounded-btn border text-sm font-medium transition-all ${
                          selectedSize === s
                            ? 'bg-cgc-ink text-white border-cgc-ink'
                            : sizeError
                            ? 'border-cgc-red text-cgc-ink hover:border-cgc-ink'
                            : 'border-cgc-hairline text-cgc-ink hover:border-cgc-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="text-xs text-cgc-red mt-2">Please select a size to continue</p>
                  )}
                </div>
              )}

              {/* Color selector */}
              {product.colors?.length > 0 && (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-cgc-ink uppercase tracking-wider mb-3 block">
                    Color {selectedColor && <span className="font-normal text-cgc-slate ml-1">— {selectedColor}</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-pill border text-xs font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-cgc-ink text-white border-cgc-ink'
                            : 'border-cgc-hairline text-cgc-ink hover:border-cgc-ink'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-cgc-ink uppercase tracking-wider mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-cgc-hairline rounded-btn overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-11 h-11 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-cgc-ink">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      aria-label="Increase quantity"
                      className="w-11 h-11 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToBag}
                  disabled={!product.in_stock || adding}
                  className={`btn w-full justify-center text-sm ${
                    added ? 'bg-green-600 text-white' : 'btn-primary'
                  }`}
                >
                  {added ? (
                    <><Check size={16} /> Added to bag!</>
                  ) : adding ? (
                    'Adding...'
                  ) : product.in_stock ? (
                    <><ShoppingBag size={16} /> Add to bag</>
                  ) : (
                    'Out of stock'
                  )}
                </button>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="btn btn-outline w-full justify-center text-sm gap-2"
                >
                  <Heart size={15} className={wishlisted ? 'fill-cgc-red text-cgc-red' : ''} />
                  {wishlisted ? 'Saved' : 'Save for later'}
                </button>
              </div>

              {/* Perks */}
              <div className="space-y-2 py-4 border-t border-cgc-hairline text-xs text-cgc-slate">
                <p>🔒 Secure checkout</p>
                <p>📍 Also available in-store at 54 Dunlop St W, Barrie ON</p>
                <p>📞 Questions? Call +1 705-717-1073</p>
              </div>

              {/* Accordion */}
              <div className="border-t border-cgc-hairline">
                {accordionItems.map(item => (
                  <div key={item.id} className="border-b border-cgc-hairline">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between py-4 text-sm font-semibold text-cgc-ink hover:text-cgc-red transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`text-cgc-slate transition-transform ${openAccordion === item.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openAccordion === item.id && (
                      <div className="pb-4 text-sm text-cgc-slate leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-cgc-hairline">
              <h2 className="text-xl font-bold text-cgc-ink mb-6">You may also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
