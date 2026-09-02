"use client";

import { useMemo } from "react";
import { isOpenNow } from "@/lib/utils";
import type { HoursEntry } from "@/lib/sanity/types";

export default function OpenIndicator({ hours }: { hours: HoursEntry[] }) {
  const status = useMemo(() => isOpenNow(hours), [hours]);

  const config = {
    open: { label: "Open Now", color: "bg-emerald-500", pulse: true },
    "closing-soon": { label: "Closing Soon", color: "bg-glow", pulse: false },
    closed: { label: "Closed", color: "bg-ghost", pulse: false },
  }[status];

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}
        />
      </span>
      <span className="text-xs text-ghost">{config.label}</span>
    </span>
  );
}
