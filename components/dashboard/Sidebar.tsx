'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/agents', label: 'Agents', icon: '🤖' },
    { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
    { href: '/dashboard/labs', label: 'LABS', icon: '🧪' },
    { href: '/dashboard/claire', label: 'Claire', icon: '💰' },
    { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 border-r border-[#1e293b] bg-[#0a0f1a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#1e293b]">
        <h1 className="text-xl font-bold text-white tracking-wide">ERLV</h1>
        <p className="text-[#64748b] text-xs mt-1">Operating System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
              isActive(link.href)
                ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]'
                : 'text-[#64748b] hover:text-white hover:bg-[#111827]'
            )}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#1e293b]">
        <div className="px-4 py-2 bg-[#111827] rounded-lg">
          <p className="text-white text-sm truncate">{user.email}</p>
          <p className="text-[#64748b] text-xs">Owner</p>
        </div>
      </div>
    </div>
  )
}
