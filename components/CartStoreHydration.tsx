'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'

export default function CartStoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])
  return null
}
