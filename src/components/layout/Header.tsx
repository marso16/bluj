'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Locations', href: '/locations' },
  { label: 'Employment', href: '/employment' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-sm border-b border-surface">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-2xl font-black text-clean tracking-tight">
          BluJ
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-ghost hover:text-clean text-sm font-medium transition-colors duration-200">
              {item.label}
            </Link>
          ))}
          <Link href="/locations"
            className="bg-charge text-clean text-sm font-semibold px-4 py-2 rounded-md hover:bg-charge/80 transition-colors duration-200">
            Find a Location
          </Link>
        </nav>

        <button className="md:hidden text-ghost hover:text-clean" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-t border-ink px-6 py-4 flex flex-col gap-4">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-ghost hover:text-clean text-sm font-medium transition-colors"
              onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
