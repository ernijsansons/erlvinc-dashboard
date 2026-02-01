'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      // Initialize Supabase client only in browser
      const supabaseClient = createClient()
      setSupabase(supabaseClient)

      // Check if redirected from erlvinc.com with session tokens
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          try {
            // Restore the session with tokens from erlvinc.com
            await supabaseClient.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            // Clear tokens from URL for security
            window.history.replaceState({}, document.title, window.location.pathname)

            // Redirect to dashboard
            router.push('/dashboard')
            router.refresh()
          } catch (err) {
            console.error('Failed to restore session:', err)
            // Session restoration failed, user will need to login manually
          }
        }
      }
    }

    initializeAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      setError('Authentication service is initializing. Please try again.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">ERLV INC</h1>
        <p className="text-[#64748b] mt-2">Operating System v2.0</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-white text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee]"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-[#111827] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#22d3ee] text-black font-semibold rounded-lg hover:bg-[#22d3ee]/80 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[#64748b] text-sm">
        Don't have access?{' '}
        <Link href="/login" className="text-[#22d3ee] hover:underline">
          Contact Ernie
        </Link>
      </p>
    </div>
  )
}
