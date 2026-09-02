"use client";

import { useState } from "react";

export default function RewardsSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "already" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) { setState("error"); return; }
    const data = await res.json();
    setState(data.alreadySubscribed ? "already" : "done");
  }

  if (state === "done") return (
    <div className="border-l-2 border-glow pl-5">
      <p className="font-display font-black text-glow text-2xl leading-none">You're on the list.</p>
      <p className="text-ghost text-sm mt-2">We'll be in touch when BluJ Rewards launches.</p>
    </div>
  );

  if (state === "already") return (
    <div className="border-l-2 border-charge pl-5">
      <p className="font-display font-black text-clean text-2xl leading-none">Already signed up.</p>
      <p className="text-ghost text-sm mt-2">You're on the list — we'll reach out at launch.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-0">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="bg-ink border border-surface/80 text-clean text-sm px-4 py-3 flex-1 placeholder:text-ghost/40 focus:outline-none focus:border-glow/40 transition-colors"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="bg-glow text-ink font-display font-black text-sm uppercase tracking-[0.1em] px-8 py-3 hover:bg-glow/90 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {state === "loading" ? "…" : "Join Waitlist"}
      </button>
      {state === "error" && <p className="text-red-400 text-xs mt-2">Something went wrong — try again.</p>}
    </form>
  );
}
