import Link from 'next/link'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Locations', href: '/locations' },
  { label: 'Employment', href: '/employment' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-ink/50 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <span className="font-display text-3xl font-black text-clean">BluJ</span>
          <p className="text-ghost text-sm mt-3 leading-relaxed">
            Your local gas station, convenience store, and deli across New Hampshire and Vermont.
          </p>
        </div>

        <div>
          <p className="text-ghost text-xs uppercase tracking-widest mb-4">Navigation</p>
          <nav className="flex flex-col gap-2">
            {NAV.map(item => (
              <Link key={item.href} href={item.href} className="text-ghost hover:text-clean text-sm transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-ghost text-xs uppercase tracking-widest mb-4">Get In Touch</p>
          <Link href="/contact" className="text-charge hover:text-charge/80 text-sm transition-colors">
            Send us a message
          </Link>
        </div>
      </div>

      <div className="border-t border-ink/50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <p className="text-ghost text-xs">© {new Date().getFullYear()} BluJ. All rights reserved.</p>
        <p className="text-ghost text-xs">NH &amp; VT</p>
      </div>
    </footer>
  )
}
