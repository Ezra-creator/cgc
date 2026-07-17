'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Package, LogOut, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { supabase } from '@/lib/supabase'
import { getOrdersByEmail } from '@/lib/supabase'
import { Order } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/auth?returnTo=/account')
        return
      }
      setUser(data.user)
      setNewName(data.user.user_metadata?.full_name || '')
      setLoading(false)
      // Load orders
      getOrdersByEmail(data.user.email!)
        .then(data => setOrders(data || []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false))
    })
  }, [router])

  const handleUpdateName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName },
      })
      if (error) throw error
      setUser((u: any) => ({ ...u, user_metadata: { ...u.user_metadata, full_name: newName } }))
      setEditingName(false)
      toast.success('Name updated!')
    } catch {
      toast.error('Could not update name. Please try again.')
    } finally {
      setSavingName(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user?.email) return
    try {
      await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })
      toast.success('Password reset email sent! Check your inbox.')
    } catch {
      toast.error('Could not send reset email. Please try again.')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
          <p className="text-cgc-slate text-sm">Loading your account...</p>
        </div>
      </SiteLayout>
    )
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer'

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white pt-16">

        {/* Header */}
        <div className="bg-cgc-bone border-b border-cgc-hairline py-10 px-4 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cgc-ink">My account</h1>
              <p className="text-sm text-cgc-slate mt-1">
                Welcome back, {displayName.split(' ')[0]}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost text-sm flex items-center gap-2 text-cgc-slate hover:text-cgc-red"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
          {/* Tabs */}
          <div className="flex gap-1 bg-cgc-bone rounded-card p-1 mb-8 w-fit">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-white text-cgc-ink shadow-sm'
                    : 'text-cgc-slate hover:text-cgc-ink'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="max-w-lg space-y-6">
              {/* Name */}
              <div className="bg-white border border-cgc-hairline rounded-card p-6">
                <h3 className="text-sm font-semibold text-cgc-ink mb-4 uppercase tracking-wide">
                  Display name
                </h3>
                {editingName ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="input"
                      placeholder="Your full name"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateName}
                        disabled={savingName}
                        className="btn btn-primary text-sm"
                      >
                        {savingName ? 'Saving...' : 'Save changes'}
                      </button>
                      <button
                        onClick={() => { setEditingName(false); setNewName(displayName) }}
                        className="btn btn-ghost text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-cgc-ink font-medium">{displayName}</p>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs text-cgc-red hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="bg-white border border-cgc-hairline rounded-card p-6">
                <h3 className="text-sm font-semibold text-cgc-ink mb-4 uppercase tracking-wide">
                  Email address
                </h3>
                <p className="text-cgc-ink">{user?.email}</p>
                <p className="text-xs text-cgc-slate mt-1">
                  Email cannot be changed. Contact us if you need help.
                </p>
              </div>

              {/* Password */}
              <div className="bg-white border border-cgc-hairline rounded-card p-6">
                <h3 className="text-sm font-semibold text-cgc-ink mb-4 uppercase tracking-wide">
                  Password
                </h3>
                <p className="text-sm text-cgc-slate mb-4">
                  We'll send a password reset link to your email address.
                </p>
                <button onClick={handleChangePassword} className="btn btn-outline text-sm">
                  Change password
                </button>
              </div>

              {/* Sign out */}
              <div className="bg-white border border-cgc-hairline rounded-card p-6">
                <h3 className="text-sm font-semibold text-cgc-ink mb-4 uppercase tracking-wide">
                  Sign out
                </h3>
                <p className="text-sm text-cgc-slate mb-4">
                  You'll be signed out of your account on this device.
                </p>
                <button onClick={handleSignOut} className="btn btn-ghost text-sm text-cgc-red hover:text-cgc-ink">
                  Sign out of account
                </button>
              </div>
            </div>
          )}

          {/* Orders tab */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton h-20 rounded-card" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-cgc-bone rounded-card border border-cgc-hairline">
                  <Package size={40} className="text-cgc-slate mx-auto mb-4" />
                  <h3 className="font-bold text-cgc-ink mb-2">No orders yet</h3>
                  <p className="text-sm text-cgc-slate mb-6">
                    When you place an order, it will appear here.
                  </p>
                  <Link href="/shop" className="btn btn-primary text-sm">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white border border-cgc-hairline rounded-card overflow-hidden"
                    >
                      {/* Order header */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-full flex items-center justify-between p-5 hover:bg-cgc-bone transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div>
                            <p className="text-xs font-mono text-cgc-slate">
                              #{order.id.slice(0, 12).toUpperCase()}
                            </p>
                            <p className="text-sm font-semibold text-cgc-ink mt-0.5">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-xs text-cgc-slate">{formatDate(order.created_at)}</p>
                            <p className="text-xs text-cgc-slate mt-0.5">
                              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-pill border capitalize ${STATUS_COLORS[order.status] || 'bg-cgc-bone text-cgc-slate border-cgc-hairline'}`}>
                            {order.status}
                          </span>
                          {expandedOrder === order.id
                            ? <ChevronUp size={16} className="text-cgc-slate" />
                            : <ChevronDown size={16} className="text-cgc-slate" />
                          }
                        </div>
                      </button>

                      {/* Order details */}
                      {expandedOrder === order.id && (
                        <div className="border-t border-cgc-hairline p-5 bg-cgc-bone/40">
                          <div className="space-y-3 mb-5">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex gap-3 items-center">
                                <div className="w-12 h-12 bg-white rounded-lg border border-cgc-hairline flex-shrink-0 overflow-hidden">
                                  {item.product?.images?.[0] && (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-cgc-ink line-clamp-1">
                                    {item.product?.name}
                                  </p>
                                  <p className="text-xs text-cgc-slate">
                                    Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-bold text-cgc-red flex-shrink-0">
                                  {formatPrice((item.product?.price || 0) * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-cgc-hairline pt-4 space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-cgc-slate">Subtotal</span>
                              <span className="text-cgc-ink">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-cgc-slate">HST (13%)</span>
                              <span className="text-cgc-ink">{formatPrice(order.tax)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-1 border-t border-cgc-hairline">
                              <span className="text-cgc-ink">Total</span>
                              <span className="text-cgc-red">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-cgc-hairline text-xs text-cgc-slate">
                            <p>📍 Deliver to: {order.address}, {order.city}, {order.province}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
