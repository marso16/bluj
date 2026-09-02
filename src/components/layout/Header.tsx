"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Promotions", href: "/promotions" },
  { label: "Locations", href: "/locations" },
  { label: "News", href: "/news" },
  { label: "Rewards", href: "/rewards" },
  { label: "Employment", href: "/employment" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Canopy edge */}
        <div className="h-0.5 bg-glow" />

        {/* Brand strip, desktop only, collapses on scroll */}
        <div
          className={`hidden md:block bg-ink/95 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out ${
            scrolled ? "max-h-0" : "max-h-24"
          }`}
        >
          <div className="flex items-center justify-center py-4">
            <Link
              href="/"
              className="font-display text-5xl tracking-[0.15em] text-clean uppercase select-none hover:text-charge transition-colors duration-300"
            >
              BluJ
            </Link>
          </div>
        </div>

        {/* Nav strip */}
        <div className="hidden md:block bg-surface/90 backdrop-blur-sm border-b border-white/5">
          <div className="h-10 flex items-center justify-center gap-10">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ghost hover:text-clean text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile single row */}
        <div className="md:hidden bg-ink/95 backdrop-blur-sm border-b border-white/5">
          <div className="h-14 flex items-center justify-between px-6">
            <Link
              href="/"
              className="font-display text-2xl tracking-[0.15em] text-clean uppercase"
            >
              BluJ
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-ghost hover:text-glow text-[11px] uppercase tracking-[0.2em] transition-colors duration-200"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink flex flex-col justify-end pb-16 px-8 md:hidden transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-ghost hover:text-clean uppercase tracking-[0.05em] transition-colors duration-150 leading-tight"
              style={{ fontSize: "clamp(2rem, 10vw, 3.75rem)" }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 h-0.5 w-12 bg-glow" />
      </div>
    </>
  );
}
