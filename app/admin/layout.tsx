'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Package, ShoppingBag,
  LogOut, Menu, X, ExternalLink,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Toaster } from 'react-hot-toast'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && pathname !== '/admin') {
        router.push('/admin')
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [pathname, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cgc-bone flex items-center justify-center">
        <div className="text-center">
          <Image src="/images/logo.jpg" alt="CGC" width={48} height={48} className="mx-auto mb-3 object-contain animate-pulse" />
          <p className="text-xs text-cgc-slate font-mono uppercase tracking-wider">Loading admin...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin') return <>{children}</>
  if (!user) return null

  return (
    <>
      <div className="min-h-screen bg-cgc-bone flex">
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-cgc-hairline z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-cgc-hairline">
            <Image src="/images/logo.jpg" alt="CGC" width={36} height={36} className="object-contain" />
            <div>
              <p className="text-xs font-bold text-cgc-ink leading-tight">CGC Admin</p>
              <p className="text-[11px] text-cgc-slate truncate max-w-[120px]">{user.email}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all ${
                    active
                      ? 'admin-nav-active font-semibold'
                      : 'text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-cgc-hairline space-y-0.5">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-all"
            >
              <ExternalLink size={15} />
              View live site
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm text-cgc-slate hover:text-cgc-red hover:bg-red-50 transition-all"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-cgc-ink/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-cgc-hairline flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <h1 className="text-sm font-semibold text-cgc-ink">
                {NAV.find(n => n.href === pathname)?.label || 'Admin'}
              </h1>
            </div>
            <span className="text-xs text-cgc-slate hidden sm:block">
              Cary Grant Clothing — Admin Dashboard
            </span>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#fff',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '10px',
          },
        }}
      />
    </>
  )
}
