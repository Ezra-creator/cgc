'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Suspense } from 'react'

type Tab = 'signin' | 'signup'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const [tab, setTab] = useState<Tab>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  const [signin, setSignin] = useState({ email: '', password: '' })
  const [signup, setSignup] = useState({ name: '', email: '', password: '', confirm: '' })
  const [forgotEmail, setForgotEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const friendlyError = (msg: string) => {
    if (msg.includes('already registered') || msg.includes('already exists')) return 'An account with this email already exists'
    if (msg.includes('Invalid login') || msg.includes('Invalid credentials')) return 'Incorrect email or password'
    if (msg.includes('Email not confirmed')) return 'Please check your email to confirm your account'
    if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters'
    if (msg.includes('User not found') || msg.includes('No user found')) return 'No account with this email address'
    return 'Something went wrong. Please try again.'
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!signin.email.trim()) err.email = 'Required'
    if (!signin.password) err.password = 'Required'
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signin.email,
        password: signin.password,
      })
      if (error) throw error
      toast.success('Welcome back!')
      router.push(returnTo)
    } catch (err: any) {
      toast.error(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!signup.name.trim()) err.name = 'Required'
    if (!signup.email.trim() || !/\S+@\S+\.\S+/.test(signup.email)) err.email = 'Valid email required'
    if (!signup.password || signup.password.length < 6) err.password = 'At least 6 characters'
    if (signup.password !== signup.confirm) err.confirm = 'Passwords don\'t match'
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: signup.email,
        password: signup.password,
        options: { data: { full_name: signup.name } },
      })
      if (error) throw error
      toast.success(`Welcome to CGC, ${signup.name.split(' ')[0]}!`)
      router.push(returnTo)
    } catch (err: any) {
      toast.error(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })
      if (error) throw error
      toast.success('Reset link sent! Check your inbox.')
      setForgotMode(false)
    } catch {
      toast.error('Could not send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cgc-bone flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="Cary Grant Clothing"
              width={56}
              height={56}
              className="object-contain mx-auto"
            />
          </Link>
          <p className="text-xs text-cgc-slate mt-3 font-mono uppercase tracking-wider">
            Cary Grant Clothing
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-cgc-hairline rounded-card shadow-sm overflow-hidden">

          {forgotMode ? (
            <div className="p-8">
              <h2 className="text-xl font-bold text-cgc-ink mb-2">Reset your password</h2>
              <p className="text-sm text-cgc-slate mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="input"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="btn btn-ghost w-full justify-center text-sm"
                >
                  ← Back to sign in
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-cgc-hairline">
                {(['signin', 'signup'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setErrors({}) }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                      tab === t ? 'text-cgc-ink' : 'text-cgc-slate hover:text-cgc-ink'
                    }`}
                  >
                    {t === 'signin' ? 'Sign in' : 'Create account'}
                    {tab === t && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cgc-red" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Sign In */}
                {tab === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={signin.email}
                        onChange={e => setSignin(s => ({ ...s, email: e.target.value }))}
                        placeholder="you@email.com"
                        className={`input ${errors.email ? 'border-cgc-red' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-cgc-red mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-cgc-ink uppercase tracking-wide">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setForgotMode(true)}
                          className="text-xs text-cgc-slate hover:text-cgc-red transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signin.password}
                          onChange={e => setSignin(s => ({ ...s, password: e.target.value }))}
                          placeholder="••••••••"
                          className={`input pr-11 ${errors.password ? 'border-cgc-red' : ''}`}
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
                      {errors.password && <p className="text-xs text-cgc-red mt-1">{errors.password}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <p className="text-xs text-cgc-slate text-center">
                      Don't have an account?{' '}
                      <button onClick={() => setTab('signup')} className="text-cgc-red hover:underline font-semibold">
                        Create one
                      </button>
                    </p>
                  </form>
                )}

                {/* Sign Up */}
                {tab === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={signup.name}
                        onChange={e => setSignup(s => ({ ...s, name: e.target.value }))}
                        placeholder="John Smith"
                        className={`input ${errors.name ? 'border-cgc-red' : ''}`}
                      />
                      {errors.name && <p className="text-xs text-cgc-red mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={signup.email}
                        onChange={e => setSignup(s => ({ ...s, email: e.target.value }))}
                        placeholder="you@email.com"
                        className={`input ${errors.email ? 'border-cgc-red' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-cgc-red mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signup.password}
                          onChange={e => setSignup(s => ({ ...s, password: e.target.value }))}
                          placeholder="Min. 6 characters"
                          className={`input pr-11 ${errors.password ? 'border-cgc-red' : ''}`}
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
                      {errors.password && <p className="text-xs text-cgc-red mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={signup.confirm}
                          onChange={e => setSignup(s => ({ ...s, confirm: e.target.value }))}
                          placeholder="Repeat your password"
                          className={`input pr-11 ${errors.confirm ? 'border-cgc-red' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-cgc-slate hover:text-cgc-ink transition-colors"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.confirm && <p className="text-xs text-cgc-red mt-1">{errors.confirm}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
                      {loading ? 'Creating account...' : 'Create account'}
                    </button>
                    <p className="text-xs text-cgc-slate text-center">
                      Already have an account?{' '}
                      <button onClick={() => setTab('signin')} className="text-cgc-red hover:underline font-semibold">
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-cgc-slate mt-6">
          <Link href="/" className="hover:text-cgc-red transition-colors">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cgc-bone flex items-center justify-center">
        <p className="text-cgc-slate text-sm">Loading...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
