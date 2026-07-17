'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import { getAllOrders, getAllProducts } from '@/lib/supabase'
import { Order, Product } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllOrders(), getAllProducts()])
      .then(([o, p]) => {
        setOrders(o || [])
        setProducts(p || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const lowStock = products.filter(p => !p.in_stock).length
  const recentOrders = orders.slice(0, 6)

  const STATS = [
    {
      label: 'Total products',
      value: loading ? '—' : products.length,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/products',
    },
    {
      label: 'Total orders',
      value: loading ? '—' : orders.length,
      icon: ShoppingBag,
      color: 'text-cgc-red',
      bg: 'bg-red-50',
      href: '/admin/orders',
    },
    {
      label: 'Total revenue',
      value: loading ? '—' : formatPrice(revenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/admin/orders',
    },
    {
      label: 'Out of stock',
      value: loading ? '—' : lowStock,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/products',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-cgc-ink">Overview</h2>
        <p className="text-sm text-cgc-slate mt-1">Welcome back to your store dashboard.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-cgc-hairline rounded-card p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-cgc-slate uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                <Icon size={15} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-cgc-ink">
              {loading ? (
                <span className="skeleton h-8 w-16 rounded inline-block" />
              ) : value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="bg-cgc-ink text-white rounded-card p-6 flex items-center justify-between hover:bg-cgc-red transition-colors group"
        >
          <div>
            <p className="font-bold text-base">Add new product</p>
            <p className="text-white/60 text-sm mt-1">Upload images and set details</p>
          </div>
          <Package size={28} className="text-white/40 group-hover:text-white transition-colors" />
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white border border-cgc-hairline rounded-card p-6 flex items-center justify-between hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-bold text-base text-cgc-ink">Manage orders</p>
            <p className="text-cgc-slate text-sm mt-1">
              {orders.filter(o => o.status === 'pending').length} pending orders
            </p>
          </div>
          <ShoppingBag size={28} className="text-cgc-slate group-hover:text-cgc-red transition-colors" />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-cgc-hairline rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cgc-hairline">
          <h3 className="font-semibold text-cgc-ink">Recent orders</h3>
          <Link href="/admin/orders" className="text-xs text-cgc-red hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-12 rounded" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag size={32} className="text-cgc-slate mx-auto mb-3" />
            <p className="text-sm text-cgc-slate">No orders yet. Share the store link to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cgc-hairline">
                  {['Order', 'Customer', 'Date', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-cgc-slate uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-cgc-hairline last:border-0 hover:bg-cgc-bone/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-cgc-slate">
                        #{order.id.slice(0, 10).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-cgc-ink">{order.customer_name}</p>
                      <p className="text-xs text-cgc-slate">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-cgc-slate text-xs">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-bold text-cgc-red">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill border capitalize ${STATUS_COLORS[order.status] || 'bg-cgc-bone text-cgc-slate border-cgc-hairline'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
