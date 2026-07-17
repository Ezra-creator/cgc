'use client'
import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { getAllOrders, updateOrderStatus } from '@/lib/supabase'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'processing', 'delivered', 'cancelled'] as const
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filtered, setFiltered] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data || [])
      setFiltered(data || [])
    } catch {
      toast.error('Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFiltered(orders)
    } else {
      setFiltered(orders.filter(o => o.status === statusFilter))
    }
  }, [statusFilter, orders])

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingStatus(orderId)
    try {
      await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o))
      toast.success('Order status updated')
    } catch {
      toast.error('Could not update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-cgc-ink">Orders</h2>
        <p className="text-sm text-cgc-slate mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-semibold border transition-all ${
            statusFilter === 'all'
              ? 'bg-cgc-ink text-white border-cgc-ink'
              : 'bg-white text-cgc-slate border-cgc-hairline hover:border-cgc-ink hover:text-cgc-ink'
          }`}
        >
          All
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-cgc-bone text-cgc-slate'
          }`}>
            {orders.length}
          </span>
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-semibold border transition-all capitalize ${
              statusFilter === s
                ? 'bg-cgc-ink text-white border-cgc-ink'
                : 'bg-white text-cgc-slate border-cgc-hairline hover:border-cgc-ink hover:text-cgc-ink'
            }`}
          >
            {s}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              statusFilter === s ? 'bg-white/20 text-white' : 'bg-cgc-bone text-cgc-slate'
            }`}>
              {statusCounts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-card" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-cgc-hairline rounded-card p-12 text-center">
            <Filter size={32} className="text-cgc-slate mx-auto mb-3" />
            <p className="font-semibold text-cgc-ink mb-1">No orders found</p>
            <p className="text-sm text-cgc-slate">
              {statusFilter === 'all' ? 'Orders will appear here when customers place them.' : `No ${statusFilter} orders.`}
            </p>
          </div>
        ) : (
          filtered.map(order => (
            <div
              key={order.id}
              className="bg-white border border-cgc-hairline rounded-card overflow-hidden"
            >
              {/* Order row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Expand button */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors flex-shrink-0"
                  aria-label={expandedOrder === order.id ? 'Collapse order' : 'Expand order'}
                >
                  {expandedOrder === order.id
                    ? <ChevronUp size={15} />
                    : <ChevronDown size={15} />
                  }
                </button>

                {/* Order info */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-cgc-slate">
                      #{order.id.slice(0, 10).toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold text-cgc-ink truncate">
                      {order.customer_name}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs text-cgc-slate">Email</p>
                    <p className="text-sm text-cgc-ink truncate">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cgc-slate">Date</p>
                    <p className="text-sm text-cgc-ink">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cgc-slate">Total</p>
                    <p className="text-sm font-bold text-cgc-red">{formatPrice(order.total)}</p>
                  </div>
                </div>

                {/* Status dropdown */}
                <div className="flex-shrink-0">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingStatus === order.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-pill border cursor-pointer outline-none transition-all capitalize ${
                      STATUS_COLORS[order.status] || 'bg-cgc-bone text-cgc-slate border-cgc-hairline'
                    } ${updatingStatus === order.id ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} className="text-cgc-ink bg-white capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="border-t border-cgc-hairline bg-cgc-bone/40 px-5 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Customer & delivery */}
                    <div>
                      <h4 className="text-xs font-semibold text-cgc-ink uppercase tracking-wide mb-3">
                        Customer & delivery
                      </h4>
                      <div className="bg-white border border-cgc-hairline rounded-card p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-cgc-slate">Name</span>
                          <span className="text-cgc-ink font-medium">{order.customer_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cgc-slate">Email</span>
                          <a href={`mailto:${order.email}`} className="text-cgc-red hover:underline text-xs">
                            {order.email}
                          </a>
                        </div>
                        {order.phone && (
                          <div className="flex justify-between">
                            <span className="text-cgc-slate">Phone</span>
                            <a href={`tel:${order.phone}`} className="text-cgc-ink hover:text-cgc-red transition-colors">
                              {order.phone}
                            </a>
                          </div>
                        )}
                        <div className="pt-2 border-t border-cgc-hairline">
                          <p className="text-cgc-slate text-xs mb-1">Deliver to:</p>
                          <p className="text-cgc-ink leading-relaxed">
                            {order.address}<br />
                            {order.city}, {order.province} {order.postal_code}<br />
                            {order.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items & payment */}
                    <div>
                      <h4 className="text-xs font-semibold text-cgc-ink uppercase tracking-wide mb-3">
                        Items ordered
                      </h4>
                      <div className="bg-white border border-cgc-hairline rounded-card p-4 space-y-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-cgc-bone rounded-lg border border-cgc-hairline flex-shrink-0 overflow-hidden">
                              {item.product?.images?.[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-cgc-ink line-clamp-1">
                                {item.product?.name}
                              </p>
                              <p className="text-[11px] text-cgc-slate">
                                {item.size} · {item.color} · Qty {item.quantity}
                              </p>
                            </div>
                            <p className="text-xs font-bold text-cgc-red flex-shrink-0">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </p>
                          </div>
                        ))}

                        {/* Totals */}
                        <div className="pt-3 border-t border-cgc-hairline space-y-1.5 text-xs">
                          <div className="flex justify-between text-cgc-slate">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-cgc-slate">
                            <span>HST (13%)</span>
                            <span>{formatPrice(order.tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-sm pt-1 border-t border-cgc-hairline">
                            <span className="text-cgc-ink">Total</span>
                            <span className="text-cgc-red">{formatPrice(order.total)}</span>
                          </div>
                        </div>

                        {/* Payment status */}
                        <div className="pt-2 border-t border-cgc-hairline">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-cgc-slate">Payment</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-pill border ${
                              order.payment_status === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : order.payment_status === 'demo'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-cgc-red border-red-200'
                            }`}>
                              {order.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick contact */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`mailto:${order.email}?subject=Your CGC Order %23${order.id.slice(0, 10).toUpperCase()}`}
                      className="btn btn-outline text-xs"
                    >
                      Email customer
                    </a>
                    {order.phone && (
                      <a
                        href={`tel:${order.phone}`}
                        className="btn btn-ghost text-xs"
                      >
                        Call customer
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
