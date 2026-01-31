'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-[#1e293b] bg-[#0a0f1a] px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#64748b] text-sm">Welcome back</p>
          <h2 className="text-white text-lg font-semibold">{user.email}</h2>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#111827] rounded-full">
            <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-pulse"></div>
            <span className="text-[#22d3ee] text-xs font-semibold">LIVE</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-[#22d3ee]/20 text-[#22d3ee] font-semibold hover:bg-[#22d3ee]/30"
            >
              {user.email?.[0].toUpperCase()}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#1e293b] rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#64748b] hover:text-white hover:bg-[#1e293b] rounded-lg"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
