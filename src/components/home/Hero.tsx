import Link from "next/link";
import type { SiteSettings } from "@/lib/sanity/types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-surface to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(29,111,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto w-full">
        <p className="text-ghost text-xs uppercase tracking-[0.3em] mb-6">
          New Hampshire &amp; Vermont
        </p>

        <h1
          className="font-display font-black text-clean leading-none tracking-tight"
          style={{ fontSize: "clamp(5rem, 18vw, 18rem)" }}
        >
          BluJ
        </h1>

        <p className="text-clean/70 text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
          {settings.heroSubtext ||
            "Your local gas station, convenience store, and deli — open when you need us."}
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/locations"
            className="bg-charge text-clean font-semibold px-8 py-4 hover:bg-charge/80 transition-colors duration-200"
          >
            Find a Location
          </Link>
          <Link
            href="/products"
            className="border border-ghost/30 text-ghost hover:text-clean hover:border-ghost/60 font-semibold px-8 py-4 transition-colors duration-200"
          >
            What We Offer
          </Link>
        </div>
      </div>
    </section>
  );
}
