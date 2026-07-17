export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const generateOrderId = (): string => {
  return `CGC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export const calculateTax = (subtotal: number): number => {
  return Math.round(subtotal * 0.13 * 100) / 100
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const CATEGORIES = [
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'kids', label: 'Kids' },
  { value: 'african', label: 'African Collection' },
  { value: 'activewear', label: 'Active Wear' },
  { value: 'accessories', label: 'Accessories' },
] as const

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

export const PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
]

export const TESTIMONIALS = [
  {
    quote: 'I am a very big customer of CG Clothing. The product quality is 5 star, customer service is excellent and their collection is just awesome.',
    name: 'Nick Agostino',
    location: 'Barrie, Ontario',
  },
  {
    quote: 'They have fashionable clothing, great prices, and fantastic customer service. I will definitely continue to purchase from Cary Grant Clothing.',
    name: 'Aran',
    location: 'Canada',
  },
  {
    quote: 'One of my favourite stores to shop at. They have a great selection and the staff is always very helpful and knowledgeable.',
    name: 'Levin Joseph',
    location: 'Canada',
  },
  {
    quote: 'I love their hoodies! The quality is great and long lasting. CGC has a huge variety of clothing to choose from.',
    name: 'Crystal Eve',
    location: 'Canada',
  },
]
