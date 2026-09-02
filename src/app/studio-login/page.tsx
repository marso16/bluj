"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/studio-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/studio");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-display font-black text-glow text-5xl mb-1 leading-none">
          BLUJ
        </p>
        <p className="text-ghost text-xs uppercase tracking-[0.2em] mb-10">
          Studio Access
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full bg-surface border border-ink/50 text-clean placeholder:text-ghost px-4 py-3 text-sm focus:outline-none focus:border-charge/40"
          />
          {error && (
            <p className="text-glow text-xs uppercase tracking-widest">
              Wrong password
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-charge text-clean font-display font-black text-lg uppercase tracking-widest py-3 hover:bg-charge/80 transition-colors disabled:opacity-40"
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
