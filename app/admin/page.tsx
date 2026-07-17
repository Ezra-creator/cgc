'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) throw authError
      toast.success('Welcome back!')
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cgc-bone flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.jpg"
            alt="Cary Grant Clothing"
            width={60}
            height={60}
            className="object-contain mx-auto"
          />
          <p className="text-xs text-cgc-slate mt-3 font-mono uppercase tracking-wider">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-cgc-hairline rounded-card shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-cgc-red" />
            <h1 className="text-base font-bold text-cgc-ink">Sign in to admin</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@carygrantclothing.com"
                className={`input ${error ? 'border-cgc-red' : ''}`}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input pr-11 ${error ? 'border-cgc-red' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cgc-slate hover:text-cgc-ink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-cgc-red bg-red-50 border border-red-100 rounded-btn px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-cgc-slate mt-6">
          <a href="/" className="hover:text-cgc-red transition-colors">← Back to store</a>
        </p>
      </div>
    </div>
  )
}
