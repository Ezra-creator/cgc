'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { formatPrice, calculateTax } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()
  const sub = subtotal()
  const tax = calculateTax(sub)
  const total = sub + tax

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-cgc-ink/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cgc-hairline">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-cgc-ink" />
                <h2 className="font-semibold text-cgc-ink">
                  Your bag
                  {items.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-cgc-slate">
                      ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-cgc-bone flex items-center justify-center">
                    <ShoppingBag size={24} className="text-cgc-slate" />
                  </div>
                  <div>
                    <p className="font-semibold text-cgc-ink">Your bag is empty</p>
                    <p className="text-sm text-cgc-slate mt-1">Add some items to get started</p>
                  </div>
                  <button onClick={closeCart} className="btn btn-primary mt-2">
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 pb-5 border-b border-cgc-hairline last:border-0"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-cgc-bone rounded-card flex-shrink-0 overflow-hidden">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={16} className="text-cgc-slate" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-semibold text-cgc-ink hover:text-cgc-red transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.size, item.color)}
                              aria-label="Remove item"
                              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-cgc-slate hover:text-cgc-red transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="mt-1 flex gap-2 flex-wrap">
                            {item.size && (
                              <span className="text-xs text-cgc-slate bg-cgc-bone px-2 py-0.5 rounded-pill">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs text-cgc-slate bg-cgc-bone px-2 py-0.5 rounded-pill">
                                {item.color}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-2 border border-cgc-hairline rounded-btn overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-cgc-ink">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 flex items-center justify-center text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors"
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
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-cgc-hairline space-y-4 bg-cgc-bone/40">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cgc-slate">Subtotal</span>
                    <span className="font-medium text-cgc-ink">{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cgc-slate">HST (13%)</span>
                    <span className="font-medium text-cgc-ink">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-cgc-hairline">
                    <span className="text-cgc-ink">Total</span>
                    <span className="text-cgc-red">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary w-full justify-center text-sm"
                >
                  Go to checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="btn btn-ghost w-full justify-center text-sm"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
