import type { WeeklySpecial } from "@/lib/sanity/types";

export default function WeeklySpecials({ specials }: { specials: WeeklySpecial[] }) {
  if (specials.length === 0) return null;

  return (
    <section className="border-t border-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end gap-6 mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">Updated Weekly</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl leading-none">
              This Week's Deals
            </h2>
          </div>
          <div className="h-px flex-1 bg-charge/20 mb-3 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-surface/30">
          {specials.map((s) => (
            <div key={s._id} className="bg-ink px-6 py-6 flex flex-col gap-2">
              <p className="text-ghost text-[10px] uppercase tracking-[0.2em]">{s.note ?? "All Locations"}</p>
              <p className="font-display font-black text-clean text-xl leading-tight">{s.item}</p>
              <p className="font-display font-black text-glow text-3xl leading-none mt-1">{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
