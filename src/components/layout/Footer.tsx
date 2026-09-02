import Link from "next/link";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/blujfuel", icon: "IG" },
  { label: "Facebook", href: "https://facebook.com/blujfuel", icon: "FB" },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Locations", href: "/locations" },
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
          {/* Brand anchor — large, bottom-aligned left */}
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
            <div className="flex gap-4 mt-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-ghost/50 hover:text-glow text-[11px] uppercase tracking-[0.2em] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav — bottom-aligned right */}
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

      {/* Canopy edge — mirrors the header's amber top line */}
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
