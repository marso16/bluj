"use client";

import { useState, useEffect } from "react";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [canShare, setCanShare] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  if (!canShare) return null;

  async function share() {
    try {
      await navigator.share({ title, url });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // user cancelled or error — do nothing
    }
  }

  return (
    <button
      onClick={share}
      className="border border-surface hover:border-glow text-ghost hover:text-glow text-[11px] uppercase tracking-[0.2em] px-4 py-2 transition-colors duration-200"
    >
      {shared ? "Shared" : "Share"}
    </button>
  );
}
