"use client";

import { useState } from "react";
import type { Location } from "@/lib/sanity/types";

export default function AllLocationsMap({ locations }: { locations: Location[] }) {
  const [expanded, setExpanded] = useState(false);

  // Build a Google Maps search URL for all locations
  const mapsSearchUrl = `https://www.google.com/maps/search/BluJ+gas+station/@43.5,-71.8,9z`;

  // For the embed: center on centroid of all locations with coords
  const withCoords = locations.filter((l) => l.lat && l.lng);
  const embedSrc =
    withCoords.length > 0
      ? (() => {
          const lat = withCoords.reduce((s, l) => s + l.lat!, 0) / withCoords.length;
          const lng = withCoords.reduce((s, l) => s + l.lng!, 0) / withCoords.length;
          const q = locations.map((l) => encodeURIComponent(l.address)).join("|");
          return `https://maps.google.com/maps?q=${encodeURIComponent("BluJ gas station NH VT")}&output=embed&z=9&ll=${lat},${lng}`;
        })()
      : `https://maps.google.com/maps?q=BluJ+gas+station+NH+VT&output=embed&z=9`;

  return (
    <div className="mb-16 border-t border-surface/50 pt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-1">All Locations</p>
          <h2 className="font-display font-black text-clean text-3xl leading-none">Region Map</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-ghost text-[10px] uppercase tracking-[0.2em] hover:text-clean transition-colors"
          >
            {expanded ? "Collapse" : "Show Map"}
          </button>
          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-charge text-[10px] uppercase tracking-[0.2em] hover:text-charge/70 transition-colors"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>

      {expanded && (
        <iframe
          src={embedSrc}
          width="100%"
          height="420"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full block border-t border-ink/50"
          style={{ filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)" }}
          title="All BluJ locations"
        />
      )}

      {!expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-surface/30">
          {locations.map((loc) => (
            <a
              key={loc._id}
              href={`/locations/${loc.slug.current}`}
              className="bg-ink px-4 py-4 hover:bg-surface transition-colors group"
            >
              <p className="text-clean text-sm font-medium group-hover:text-charge transition-colors truncate">
                {loc.name}
              </p>
              <p className="text-ghost text-[10px] mt-0.5 truncate">{loc.address.split(",")[0]}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
