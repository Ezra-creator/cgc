import { createClient } from '@supabase/supabase-js'
import { Product, Order, Message } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, serviceKey)
}

// Upload image to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const path = `products/${fileName}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return data.publicUrl
}

// Products
export const getProducts = async (category?: string) => {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8)
  if (error) throw error
  return data
}

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export const getRelatedProducts = async (category: string, excludeId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4)
  if (error) throw error
  return data
}

export const searchProducts = async (query: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(6)
  if (error) throw error
  return data
}

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()
  if (error) throw error
  return data
}

export const getOrdersByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Admin
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const updateOrderStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
  if (error) throw error
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Newsletter
export const subscribeNewsletter = async (email: string) => {
  const { error } = await supabase
    .from('newsletter')
    .upsert([{ email }], { onConflict: 'email' })
  if (error) throw error
}

// Contact
export const saveMessage = async (msg: Omit<Message, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('messages')
    .insert([msg])
  if (error) throw error
}
