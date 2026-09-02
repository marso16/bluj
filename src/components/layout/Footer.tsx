import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://instagram.com/blujfuel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/blujfuel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Locations", href: "/locations" },
  { label: "News", href: "/news" },
  { label: "Rewards", href: "/rewards" },
  { label: "Employment", href: "/employment" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="mt-32">
      {/* Transaction complete */}
      <div className="h-px bg-white/10" />

      <div className="bg-ink px-8 md:px-16 pt-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Brand anchor */}
          <div>
            <Link
              href="/"
              className="font-display text-7xl md:text-9xl text-clean uppercase tracking-[0.08em] hover:text-charge transition-colors duration-300 leading-none block"
            >
              BluJ
            </Link>
            <p className="text-ghost text-[11px] uppercase tracking-[0.25em] mt-3">
              New Hampshire &amp; Vermont
            </p>
            <div className="flex gap-2 mt-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="border border-surface hover:border-glow text-ghost hover:text-glow p-2.5 transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col md:items-end gap-2 md:pb-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ghost hover:text-clean text-sm transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-charge hover:text-charge/70 text-sm mt-3 transition-colors duration-200"
            >
              Send us a message →
            </Link>
          </nav>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-surface/40 bg-ink px-8 md:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
        <div>
          <p className="text-ghost text-[11px] uppercase tracking-[0.2em]">Deals &amp; Updates</p>
          <p className="text-clean text-sm mt-0.5">Get weekly specials straight to your inbox.</p>
        </div>
        <NewsletterSignup />
      </div>

      {/* Canopy edge */}
      <div className="h-0.5 bg-glow mt-12" />

      <div className="bg-ink px-8 md:px-16 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
        <p className="text-ghost text-[11px] uppercase tracking-[0.15em]">
          © {new Date().getFullYear()} BluJ. All rights reserved.
        </p>
        <p className="text-ghost/50 text-[11px] uppercase tracking-[0.15em]">
          NH &amp; VT
        </p>
      </div>
    </footer>
  );
}
