"use client";

import { useState } from "react";

export default function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="text-ghost hover:text-glow text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 mt-2 block"
    >
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}
