'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DomainsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-[#1e293b] pb-4">
        <DomainTab href="/dashboard/domains/work" label="💼 Work" />
        <DomainTab href="/dashboard/domains/family" label="❤️ Family" />
        <DomainTab href="/dashboard/domains/personal" label="🌟 Personal" />
      </div>

      {children}
    </div>
  )
}

function DomainTab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`px-4 py-3 border-b-2 transition-colors ${
        isActive
          ? 'border-[#22d3ee] text-[#22d3ee]'
          : 'border-transparent text-[#64748b] hover:text-white'
      }`}
    >
      {label}
    </Link>
  )
}
