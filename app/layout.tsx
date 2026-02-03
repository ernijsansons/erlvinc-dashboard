import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERLV Inc Dashboard',
  description: 'AI-powered operating system dashboard',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0a0f1a] text-white">
        {children}
      </body>
    </html>
  )
}
