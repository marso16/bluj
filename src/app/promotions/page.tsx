import { getPromotions } from "@/lib/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Current deals and promotions at BluJ gas stations across New Hampshire and Vermont.",
  openGraph: { title: "Promotions | BluJ", description: "Current deals at BluJ." },
};
export const revalidate = 300;

function formatRange(start?: string, end?: string) {
  if (!start && !end) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (start && end) return `${fmt(start)} to ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${fmt(end!)}`;
}

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">Current Deals</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-16">Promotions</h1>

      {promotions.length === 0 ? (
        <p className="text-ghost text-sm">No active promotions right now. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-px bg-surface/30">
          {promotions.map((promo) => {
            const range = promo.activeDateRange
              ? formatRange(promo.activeDateRange.start, promo.activeDateRange.end)
              : null;
            return (
              <div key={promo._id} className="bg-ink px-8 py-8 border-l-2 border-glow">
                <h2 className="font-display font-black text-clean text-3xl leading-none">
                  {promo.title}
                </h2>
                {range && (
                  <p className="text-ghost text-[10px] uppercase tracking-[0.2em] mt-3">{range}</p>
                )}
                {promo.description && (
                  <p className="text-ghost mt-4 leading-relaxed max-w-xl">{promo.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
