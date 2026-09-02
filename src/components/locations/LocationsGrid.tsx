"use client";

import { useState } from "react";
import Link from "next/link";
import OpenIndicator from "@/components/home/OpenIndicator";
import { isOpenNow } from "@/lib/utils";
import type { Location } from "@/lib/sanity/types";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function chunk<T>(arr: T[], n: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(i * n, (i + 1) * n)
  );
}

export default function LocationsGrid({ locations }: { locations: Location[] }) {
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = openOnly
    ? locations.filter((l) => isOpenNow(l.hours ?? []) !== "closed")
    : locations;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => setOpenOnly((v) => !v)}
          className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
            openOnly
              ? "border-glow/50 bg-glow/10 text-glow"
              : "border-surface text-ghost hover:border-glow/30 hover:text-clean"
          }`}
        >
          {openOnly && (
            <span className="w-1.5 h-1.5 rounded-full bg-glow inline-block animate-pulse" />
          )}
          Open Now
        </button>
        {openOnly && (
          <span className="text-ghost text-xs">
            {filtered.length} location{filtered.length !== 1 ? "s" : ""} open
          </span>
        )}
      </div>

      {filtered.length === 0 && openOnly && (
        <p className="text-ghost text-sm">No locations currently open.</p>
      )}

      <div className="flex flex-col gap-6">
        {chunk(filtered, 2).map((pair, pi) => (
          <div key={pi} className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
            {pair.map((loc) => (
              <div
                key={loc._id}
                className="
                  mb-6 last:mb-0 md:mb-0
                  bg-surface border border-ink/50 hover:border-charge/20 transition-colors duration-300
                  md:grid md:[grid-row:span_5] md:[grid-template-rows:subgrid]
                "
              >
                {/* Row 1 — Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-clean font-display font-black text-3xl leading-none">
                        {loc.name}
                      </h2>
                      <p className="text-ghost mt-2">{loc.address}</p>
                      {loc.phone && (
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-charge text-sm mt-1 block hover:text-charge/70 transition-colors"
                        >
                          {loc.phone}
                        </a>
                      )}
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <OpenIndicator hours={loc.hours ?? []} />
                    </div>
                  </div>
                </div>

                {/* Row 2 — Fuel prices */}
                {loc.fuelPrices && loc.fuelPrices.length > 0 ? (
                  <div className="flex flex-wrap gap-4 px-8 py-5 border-t border-ink/50">
                    {loc.fuelPrices.map((fp) => (
                      <div key={fp.grade} className="flex flex-col gap-0.5">
                        <p className="text-ghost text-[10px] uppercase tracking-[0.2em]">{fp.grade}</p>
                        <p className="font-display font-black text-glow text-xl leading-none">${fp.price.toFixed(3)}</p>
                      </div>
                    ))}
                  </div>
                ) : <div />}

                {/* Row 3 — Amenities */}
                {loc.amenities?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 px-8 pb-5">
                    {loc.amenities.map((a) => (
                      <span key={a} className="text-ghost text-[11px] uppercase tracking-[0.1em] bg-ink px-2.5 py-1">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : <div />}

                {/* Row 4 — Hours */}
                {loc.hours?.length > 0 ? (
                  <div className="px-8 py-6 border-t border-ink/50">
                    <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-4">Hours</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                      {DAYS.map((day) => {
                        const entry = loc.hours.find((h) => h.day === day);
                        return (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="text-ghost">{day.slice(0, 3)}</span>
                            <span className="text-clean tabular-nums">
                              {entry?.closed
                                ? "Closed"
                                : entry
                                  ? `${entry.open} – ${entry.close}`
                                  : "N/A"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : <div />}

                {/* Row 5 — Full Details + Map */}
                <div>
                  <div className="px-8 pt-5 pb-4 border-t border-ink/50 flex justify-end">
                    <Link
                      href={`/locations/${loc.slug.current}`}
                      className="text-charge text-[10px] uppercase tracking-[0.2em] hover:text-charge/70 transition-colors"
                    >
                      Full Details →
                    </Link>
                  </div>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed&z=15`}
                    width="100%"
                    height="200"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full block border-t border-ink/50"
                    style={{ filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)" }}
                    title={`Map for ${loc.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
