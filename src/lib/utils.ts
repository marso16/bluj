import type { HoursEntry } from "./sanity/types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function isOpenNow(
  hours: HoursEntry[],
): "open" | "closing-soon" | "closed" {
  const now = new Date();
  const entry = hours.find((h) => h.day === DAYS[now.getDay()]);
  if (!entry || entry.closed) return "closed";

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(entry.open);
  const close = toMinutes(entry.close);

  if (current < open || current >= close) return "closed";
  if (close - current <= 60) return "closing-soon";
  return "open";
}
