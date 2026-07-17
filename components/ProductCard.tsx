'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const { addItem } = useCartStore()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.in_stock) return
    setAdding(true)
    addItem(product, product.sizes[0] || 'One Size', product.colors[0] || 'Default')
    toast.success(`${product.name} added to bag`)
    setTimeout(() => setAdding(false), 600)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(!wishlisted)
    toast(wishlisted ? 'Removed from saved items' : 'Saved for later', { icon: wishlisted ? '💔' : '❤️' })
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block product-card bg-white border border-cgc-hairline rounded-card overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-cgc-bone">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cgc-bone to-cgc-hairline">
            <span className="text-cgc-slate text-xs font-mono">product photo</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-cgc-ink text-white text-[10px] font-semibold px-2 py-1 rounded-pill uppercase tracking-wide">
              Featured
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-cgc-slate text-white text-[10px] font-semibold px-2 py-1 rounded-pill uppercase tracking-wide">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from saved' : 'Save for later'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 ${
            hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-cgc-red text-cgc-red' : 'text-cgc-slate'}
          />
        </button>

        {/* Quick add */}
        {product.in_stock && (
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            hovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 bg-cgc-ink text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-cgc-red transition-colors"
            >
              <Plus size={13} />
              {adding ? 'Added!' : 'Quick add'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] text-cgc-slate mb-1 capitalize">{product.category.replace('african', 'African Collection').replace('activewear', 'Active wear')}</p>
        <h3 className="text-sm font-semibold text-cgc-ink mb-3 line-clamp-1 group-hover:text-cgc-red transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="swing-tag">
            CGC <span className="price">{formatPrice(product.price)}</span>
          </span>
          {product.sizes.length > 0 && (
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map(size => (
                <span key={size} className="text-[10px] text-cgc-slate border border-cgc-hairline px-1.5 py-0.5 rounded">
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-[10px] text-cgc-slate">+{product.sizes.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
