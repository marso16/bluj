"use client";

import { useState } from "react";
import { haversineDistance } from "@/lib/utils";
import OpenIndicator from "@/components/home/OpenIndicator";
import type { Location } from "@/lib/sanity/types";

type State = "idle" | "loading" | "done" | "denied";

export default function NearestLocation({ locations }: { locations: Location[] }) {
  const [state, setState] = useState<State>("idle");
  const [nearest, setNearest] = useState<(Location & { miles: number }) | null>(null);

  const locatable = locations.filter((l) => l.lat != null && l.lng != null);
  if (locatable.length === 0) return null;

  function locate() {
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let closest: typeof nearest = null;
        for (const loc of locatable) {
          const miles = haversineDistance(latitude, longitude, loc.lat!, loc.lng!);
          if (!closest || miles < closest.miles) closest = { ...loc, miles };
        }
        setNearest(closest);
        setState("done");
      },
      () => setState("denied"),
      { timeout: 8000 },
    );
  }

  if (state === "idle") {
    return (
      <button
        onClick={locate}
        className="flex items-center gap-3 text-ghost hover:text-clean text-xs uppercase tracking-[0.2em] transition-colors duration-200 group"
      >
        <span className="w-4 h-4 border border-ghost/30 group-hover:border-charge/60 flex items-center justify-center transition-colors">
          <span className="w-1.5 h-1.5 bg-charge" />
        </span>
        Find nearest BluJ
      </button>
    );
  }

  if (state === "loading") {
    return <p className="text-ghost text-xs uppercase tracking-widest animate-pulse">Locating…</p>;
  }

  if (state === "denied") {
    return <p className="text-ghost text-xs uppercase tracking-widest">Location access denied</p>;
  }

  if (!nearest) return null;

  return (
    <div className="border-l-2 border-charge pl-5 flex flex-col gap-2">
      <p className="text-ghost text-[10px] uppercase tracking-[0.25em]">
        Nearest · {nearest.miles.toFixed(1)} mi away
      </p>
      <p className="font-display font-black text-clean text-2xl leading-none">{nearest.name}</p>
      <p className="text-ghost text-xs">{nearest.address}</p>
      <OpenIndicator hours={nearest.hours ?? []} />
      {nearest.phone && (
        <a href={`tel:${nearest.phone}`} className="text-charge text-xs hover:text-charge/70 transition-colors">
          {nearest.phone}
        </a>
      )}
      <button
        onClick={() => setState("idle")}
        className="text-ghost/50 text-[10px] uppercase tracking-widest hover:text-ghost transition-colors mt-1 text-left"
      >
        ← Back
      </button>
    </div>
  );
}
