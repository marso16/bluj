"use client";

import { useMemo } from "react";
import { getOpenStatus } from "@/lib/utils";
import type { HoursEntry } from "@/lib/sanity/types";

export default function OpenIndicator({ hours }: { hours: HoursEntry[] }) {
  const { status, label } = useMemo(() => getOpenStatus(hours), [hours]);

  const dot = {
    open: { color: "bg-emerald-500", pulse: true },
    "closing-soon": { color: "bg-glow", pulse: false },
    closed: { color: "bg-ghost", pulse: false },
  }[status];

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {dot.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot.color} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot.color}`} />
      </span>
      <span className="text-xs text-ghost">{label}</span>
    </span>
  );
}
