import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Wrong Turn" };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-[11px] uppercase tracking-[0.3em] mb-4">404</p>
      <h1 className="font-display font-black text-clean leading-none mb-6" style={{ fontSize: "clamp(4rem, 18vw, 14rem)" }}>
        Wrong<br />
        <span className="text-glow">Turn.</span>
      </h1>
      <p className="text-ghost max-w-sm mb-12 leading-relaxed">
        This page doesn't exist — but the nearest BluJ is never far away.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/"
          className="bg-charge/10 border border-charge text-charge text-[11px] uppercase tracking-[0.2em] px-6 py-3 hover:bg-charge/20 transition-colors"
        >
          Back Home
        </Link>
        <Link
          href="/locations"
          className="border border-surface text-ghost text-[11px] uppercase tracking-[0.2em] px-6 py-3 hover:border-glow/40 hover:text-clean transition-colors"
        >
          Find a Location →
        </Link>
      </div>
    </div>
  );
}
