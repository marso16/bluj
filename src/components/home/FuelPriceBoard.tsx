import type { Location } from "@/lib/sanity/types";

const GRADE_ORDER = ["Regular", "Mid-Grade", "Premium", "Diesel"];

export default function FuelPriceBoard({ locations }: { locations: Location[] }) {
  // Aggregate: average price per grade across all locations
  const priceMap = new Map<string, number[]>();
  for (const loc of locations) {
    for (const fp of loc.fuelPrices ?? []) {
      if (!priceMap.has(fp.grade)) priceMap.set(fp.grade, []);
      priceMap.get(fp.grade)!.push(fp.price);
    }
  }
  if (priceMap.size === 0) return null;

  const grades = GRADE_ORDER.filter((g) => priceMap.has(g));

  return (
    <section className="border-t border-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end gap-6 mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">Updated Daily</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl leading-none">
              Fuel Prices
            </h2>
          </div>
          <div className="h-px flex-1 bg-glow/20 mb-3 hidden md:block" />
          <p className="text-ghost text-xs uppercase tracking-widest mb-3 hidden md:block">Per Gallon</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-surface/30">
          {grades.map((grade) => {
            const prices = priceMap.get(grade)!;
            const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
            const dollars = Math.floor(avg);
            const cents = avg.toFixed(3).split(".")[1];

            return (
              <div key={grade} className="bg-ink px-6 py-8 flex flex-col gap-3">
                <p className="text-ghost text-[10px] uppercase tracking-[0.25em]">{grade}</p>
                <div className="flex items-start leading-none">
                  <span className="text-glow font-display font-black text-lg mt-1 mr-0.5">$</span>
                  <span className="text-clean font-display font-black text-5xl md:text-6xl tracking-tight">
                    {dollars}
                  </span>
                  <span className="text-glow font-display font-black text-xl mt-1 ml-0.5">
                    .{cents}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
