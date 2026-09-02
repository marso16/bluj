import type { HoursEntry } from "./sanity/types";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function getOpenStatus(hours: HoursEntry[]): {
  status: "open" | "closing-soon" | "closed";
  label: string;
} {
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const todayEntry = hours.find((h) => h.day === DAYS[now.getDay()]);

  if (todayEntry && !todayEntry.closed) {
    const open = toMin(todayEntry.open);
    const close = toMin(todayEntry.close);
    if (curMin >= open && curMin < close) {
      const remaining = close - curMin;
      if (remaining <= 60) {
        return { status: "closing-soon", label: `Closes in ${remaining}m` };
      }
      return { status: "open", label: `Open · Closes ${todayEntry.close}` };
    }
  }

  // Find next opening
  for (let i = 1; i <= 7; i++) {
    const next = new Date(now);
    next.setDate(now.getDate() + i);
    const entry = hours.find((h) => h.day === DAYS[next.getDay()]);
    if (entry && !entry.closed) {
      const prefix = i === 1 ? "Tomorrow" : DAYS[next.getDay()].slice(0, 3);
      return { status: "closed", label: `Opens ${prefix} ${entry.open}` };
    }
  }

  return { status: "closed", label: "Closed" };
}

export function isOpenNow(hours: HoursEntry[]): "open" | "closing-soon" | "closed" {
  return getOpenStatus(hours).status;
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
