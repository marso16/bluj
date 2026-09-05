import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fleet Accounts",
  description: "Commercial and fleet fuel accounts at BluJ. Bulk fuel pricing, account management, and dedicated support for NH and VT businesses.",
  openGraph: { title: "Fleet Accounts | BluJ", description: "Commercial fuel accounts for NH and VT businesses." },
};

const PERKS = [
  { label: "Volume Pricing", body: "Negotiated per-gallon rates based on your monthly usage. The more you fill, the more you save." },
  { label: "Consolidated Billing", body: "One monthly invoice across all your drivers and vehicles. No per-card reconciliation." },
  { label: "Multi-Driver Cards", body: "Assign fleet cards to individual drivers. PIN-protected with per-transaction limits you control." },
  { label: "All Locations", body: "Cards work at every BluJ station in New Hampshire and Vermont. No network restrictions." },
  { label: "Usage Reports", body: "Monthly breakdowns by driver, vehicle, and location. Useful for mileage logs and expense reporting." },
  { label: "Dedicated Contact", body: "A direct line to our commercial team, not a call center. Issues get resolved the same day." },
];

export default function FleetPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-3">Commercial Accounts</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-4 leading-none">
        Fleet Fuel
      </h1>
      <p className="text-ghost mb-16 leading-relaxed max-w-xl">
        If your vehicles are on the road in NH or VT, BluJ fleet accounts give you volume pricing, consolidated billing, and per-driver controls. No middlemen, no monthly fees.
      </p>

      {/* Perks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-surface/30 mb-20">
        {PERKS.map((p) => (
          <div key={p.label} className="bg-ink px-8 py-8">
            <div className="h-px w-8 bg-glow mb-6" />
            <h2 className="font-display font-black text-clean text-2xl leading-none mb-3">{p.label}</h2>
            <p className="text-ghost text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-l-2 border-glow pl-8">
        <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-3">Get Started</p>
        <h2 className="font-display font-black text-clean text-4xl leading-none mb-4">
          Talk to our commercial team.
        </h2>
        <p className="text-ghost mb-8 leading-relaxed max-w-lg">
          Send us your fleet size and locations and we'll put together a pricing proposal within one business day.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-glow text-ink font-display font-black text-lg uppercase tracking-[0.1em] px-10 py-4 hover:bg-glow/80 transition-colors"
        >
          Contact Us →
        </Link>
      </div>
    </div>
  );
}
