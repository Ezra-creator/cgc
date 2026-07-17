'use client'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import SiteLayout from '@/components/SiteLayout'
import { useCartStore } from '@/store/cart'
import { formatPrice, calculateTax } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore()
  const sub = subtotal()
  const tax = calculateTax(sub)
  const total = sub + tax

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">
        {/* Header */}
        <div className="bg-cgc-bone border-b border-cgc-hairline py-10 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-cgc-ink">Your bag</h1>
            <p className="text-sm text-cgc-slate mt-1">
              {items.length === 0 ? 'Empty' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-cgc-bone flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-cgc-slate" />
              </div>
              <h2 className="text-xl font-bold text-cgc-ink mb-2">Your bag is empty</h2>
              <p className="text-sm text-cgc-slate mb-8 max-w-xs">
                Looks like you haven't added anything yet. Browse the collection and find something you love.
              </p>
              <Link href="/shop" className="btn btn-primary">Start shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-cgc-ink">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-cgc-slate hover:text-cgc-red transition-colors"
                  >
                    Clear bag
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-5 py-6 border-b border-cgc-hairline last:border-0"
                    >
                      {/* Image */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="w-24 h-28 bg-cgc-bone rounded-card flex-shrink-0 overflow-hidden"
                      >
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-cgc-slate" />
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="text-sm font-semibold text-cgc-ink hover:text-cgc-red transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex gap-2 mt-1.5 flex-wrap">
                              {item.size && (
                                <span className="text-xs text-cgc-slate bg-cgc-bone px-2 py-0.5 rounded-pill">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-xs text-cgc-slate bg-cgc-bone px-2 py-0.5 rounded-pill">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            aria-label="Remove item"
                            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-cgc-slate hover:text-cgc-red rounded-full hover:bg-cgc-bone transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Qty stepper */}
                          <div className="flex items-center border border-cgc-hairline rounded-btn overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-9 h-9 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-9 text-center text-sm font-semibold text-cgc-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-9 h-9 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-cgc-red">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-cgc-bone border border-cgc-hairline rounded-card p-6 sticky top-24">
                  <h2 className="text-base font-bold text-cgc-ink mb-5">Order summary</h2>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-cgc-slate">Subtotal</span>
                      <span className="font-medium text-cgc-ink">{formatPrice(sub)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cgc-slate">HST (13%)</span>
                      <span className="font-medium text-cgc-ink">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-base font-bold pt-4 border-t border-cgc-hairline mb-6">
                    <span className="text-cgc-ink">Total</span>
                    <span className="text-cgc-red">{formatPrice(total)}</span>
                  </div>

                  <Link href="/checkout" className="btn btn-primary w-full justify-center text-sm mb-3">
                    Proceed to checkout
                  </Link>
                  <Link href="/shop" className="btn btn-ghost w-full justify-center text-sm">
                    Continue shopping
                  </Link>

                  <p className="text-xs text-cgc-slate text-center mt-4">
                    🔒 Secure checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
