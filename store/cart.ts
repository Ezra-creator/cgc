'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, size, color) => {
        const items = get().items
        const existing = items.find(
          i => i.product.id === product.id && i.size === size && i.color === color
        )
        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...items, { product, size, color, quantity: 1 }], isOpen: true })
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            i => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        })
      },

      updateQuantity: (productId, size, color, qty) => {
        if (qty < 1) {
          get().removeItem(productId, size, color)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity: qty }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'cgc-cart', skipHydration: true }
  )
)
