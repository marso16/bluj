import { getLocations } from "@/lib/sanity/queries";

export default async function FuelTicker() {
  const locations = await getLocations();

  const items = locations
    .filter((l) => l.fuelPrices?.some((f) => f.grade === "Regular"))
    .map((l) => {
      const regular = l.fuelPrices!.find((f) => f.grade === "Regular")!;
      return `${l.name}  ·  Regular $${regular.price.toFixed(3)}`;
    });

  if (items.length === 0) return null;

  // Duplicate for seamless loop (translateX -50% brings it back to start)
  const text = items.join("          ");
  const repeated = `${text}          ${text}`;

  return (
    <div className="border-t border-surface overflow-hidden bg-ink/80 py-2.5">
      <div
        className="flex whitespace-nowrap animate-ticker"
        style={{ willChange: "transform" }}
      >
        <span className="text-ghost/60 text-[10px] uppercase tracking-[0.25em] pr-20">
          {repeated}
        </span>
      </div>
    </div>
  );
}
