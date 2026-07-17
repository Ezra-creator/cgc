export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: 'mens' | 'womens' | 'kids' | 'african' | 'activewear' | 'accessories'
  gender: 'mens' | 'womens' | 'kids' | 'unisex'
  sizes: string[]
  colors: string[]
  images: string[]
  in_stock: boolean
  featured: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
  country: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  payment_status: 'demo' | 'paid' | 'failed'
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

export type OrderStatus = Order['status']
export type ProductCategory = Product['category']
