import type { Metadata } from "next";
import RewardsSignup from "@/components/rewards/RewardsSignup";

export const metadata: Metadata = {
  title: "BluJ Rewards",
  description: "Join the BluJ Rewards waitlist. Earn points on every gallon, every coffee, every deli order. Coming soon to NH and VT.",
  openGraph: { title: "BluJ Rewards", description: "Coming soon — earn points at every BluJ station." },
};

const PERKS = [
  { label: "Fuel Points", detail: "Earn on every gallon pumped" },
  { label: "Deli Credit", detail: "Points convert to free food" },
  { label: "Early Deals", detail: "Members see specials first" },
  { label: "No App Required", detail: "Tied to your phone number" },
];

export default function RewardsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="max-w-2xl mb-20">
        <p className="text-ghost text-[11px] uppercase tracking-[0.3em] mb-4">Coming Soon</p>
        <h1 className="font-display font-black text-clean leading-none mb-6" style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
          BluJ<br /><span className="text-glow">Rewards.</span>
        </h1>
        <p className="text-ghost text-lg leading-relaxed">
          Every gallon, every coffee, every sandwich — earning something back. We're building a rewards program for people who actually stop here, not just whoever downloaded the app.
        </p>
      </div>

      {/* Perks grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface/30 mb-20">
        {PERKS.map((p) => (
          <div key={p.label} className="bg-ink px-6 py-8">
            <p className="font-display font-black text-glow text-xl leading-none mb-2">{p.label}</p>
            <p className="text-ghost text-sm leading-relaxed">{p.detail}</p>
          </div>
        ))}
      </div>

      {/* Waitlist */}
      <div className="max-w-lg">
        <div className="h-px bg-glow/20 mb-10" />
        <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-3">Get Early Access</p>
        <h2 className="font-display font-black text-clean text-4xl md:text-5xl leading-none mb-6">
          Join the waitlist.
        </h2>
        <p className="text-ghost mb-8 leading-relaxed">
          Drop your email and you'll be first to know when BluJ Rewards launches — plus a bonus on your first fill-up.
        </p>
        <RewardsSignup />
      </div>
    </div>
  );
}
