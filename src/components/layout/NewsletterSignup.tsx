"use client";

import { useState } from "react";

export default function NewsletterSignup() {
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

  if (state === "done") {
    return (
      <p className="text-glow text-[11px] uppercase tracking-[0.2em]">
        You're in. Watch for deals.
      </p>
    );
  }

  if (state === "already") {
    return (
      <p className="text-ghost text-[11px] uppercase tracking-[0.2em]">
        Already subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-0">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="bg-ink border border-surface/80 text-clean text-xs px-3 py-2 w-44 placeholder:text-ghost/40 focus:outline-none focus:border-glow/40 transition-colors"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="bg-glow/10 border border-glow/30 hover:bg-glow/20 text-glow text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors disabled:opacity-50"
      >
        {state === "loading" ? "…" : "Get Deals"}
      </button>
      {state === "error" && (
        <p className="text-red-400 text-[10px] absolute mt-8">Try again.</p>
      )}
    </form>
  );
}
