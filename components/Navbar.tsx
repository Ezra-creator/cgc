'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import { searchProducts } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Men', href: '/shop?category=mens' },
  { label: 'Women', href: '/shop?category=womens' },
  { label: 'Kids', href: '/shop?category=kids' },
  { label: 'African Collection', href: '/shop?category=african' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchProducts(searchQuery)
        setSearchResults(results || [])
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen || menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [searchOpen, menuOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white ${
        scrolled ? 'border-b border-cgc-hairline shadow-sm' : ''
      }`}>
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Cary Grant Clothing"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors relative group text-cgc-slate hover:text-cgc-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cgc-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone"
            >
              <Search size={18} />
            </button>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : undefined}
                aria-label="Account"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone"
              >
                {user ? (
                  <Link href="/account"><User size={18} /></Link>
                ) : (
                  <Link href="/auth"><User size={18} /></Link>
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-48 bg-white border border-cgc-hairline rounded-card shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-cgc-hairline">
                      <p className="text-xs text-cgc-slate truncate">{user.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-cgc-ink hover:bg-cgc-bone transition-colors">
                      My account
                    </Link>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-cgc-ink hover:bg-cgc-bone transition-colors">
                      My orders
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-cgc-red hover:bg-cgc-bone transition-colors border-t border-cgc-hairline">
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label={`Shopping bag, ${count} items`}
              className="w-10 h-10 flex items-center justify-center rounded-full relative transition-colors text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cgc-red text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="max-w-2xl mx-auto w-full px-4 pt-6">
              <div className="flex items-center gap-4 pb-4 border-b border-cgc-hairline">
                <Search size={20} className="text-cgc-slate flex-shrink-0" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg font-medium text-cgc-ink placeholder-cgc-slate/50 bg-transparent outline-none"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="mt-6">
                {searching && (
                  <p className="text-sm text-cgc-slate">Searching...</p>
                )}
                {!searching && searchQuery && searchResults.length === 0 && (
                  <p className="text-sm text-cgc-slate">No products found for "{searchQuery}"</p>
                )}
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="flex items-center gap-4 py-3 border-b border-cgc-hairline hover:bg-cgc-bone -mx-4 px-4 transition-colors"
                  >
                    <div className="w-12 h-12 bg-cgc-bone rounded-lg flex-shrink-0 overflow-hidden">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-cgc-ink truncate">{product.name}</p>
                      <p className="text-xs text-cgc-slate capitalize">{product.category}</p>
                    </div>
                    <span className="text-sm font-bold text-cgc-red flex-shrink-0">{formatPrice(product.price)}</span>
                  </Link>
                ))}
                {!searchQuery && (
                  <div>
                    <p className="text-xs font-600 text-cgc-slate uppercase tracking-wider mb-3">Popular categories</p>
                    <div className="flex flex-wrap gap-2">
                      {["Men's", "Women's", "Kids", "African Collection", "Active Wear"].map(cat => (
                        <Link
                          key={cat}
                          href={`/shop?category=${cat.toLowerCase().replace("'s", '').replace(' ', '')}`}
                          onClick={() => setSearchOpen(false)}
                          className="px-4 py-2 bg-cgc-bone rounded-pill text-sm text-cgc-ink hover:bg-cgc-hairline transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-cgc-hairline">
              <Image src="/images/logo.jpg" alt="CGC" width={40} height={40} className="object-contain" />
              <button onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-cgc-hairline text-base font-medium text-cgc-ink hover:text-cgc-red transition-colors"
                  >
                    {link.label}
                    <ChevronDown size={16} className="-rotate-90 text-cgc-slate" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-4 py-6 border-t border-cgc-hairline space-y-3">
              {user ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="btn btn-outline w-full justify-center">My account</Link>
                  <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="btn btn-ghost w-full justify-center text-cgc-red">Sign out</button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMenuOpen(false)}
                  className="btn btn-primary w-full justify-center">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
