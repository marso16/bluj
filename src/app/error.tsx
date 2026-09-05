"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-glow text-[10px] uppercase tracking-[0.3em] mb-4">Something went wrong</p>
        <h1 className="font-display font-black text-clean text-6xl md:text-8xl leading-none mb-6">
          Error
        </h1>
        <p className="text-ghost text-sm leading-relaxed mb-8">
          We hit a snag loading this page. Try again or head back home.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="text-[11px] uppercase tracking-[0.2em] px-6 py-3 bg-charge text-ink font-bold hover:bg-charge/80 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="text-[11px] uppercase tracking-[0.2em] px-6 py-3 border border-surface text-ghost hover:text-clean transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
