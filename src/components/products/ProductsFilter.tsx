"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { Product } from "@/lib/sanity/types";

const CATEGORIES: { key: Product["category"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fuel", label: "Fuel" },
  { key: "deli", label: "Deli" },
  { key: "food", label: "Food" },
  { key: "convenience", label: "Convenience" },
];

export default function ProductsFilter({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Product["category"] | "all">("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  const [first, ...rest] = filtered;

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-px mb-16 flex-wrap">
        {CATEGORIES.filter((c) => c.key === "all" || products.some((p) => p.category === c.key)).map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-colors duration-150 ${
              active === cat.key
                ? "bg-glow text-ink font-bold"
                : "bg-surface text-ghost hover:text-clean"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-ghost text-sm">No products in this category.</p>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-surface/50">
          {/* Hero item */}
          <div className="col-span-2 md:col-span-1 bg-ink row-span-2">
            {first.image ? (
              <div className="h-56 md:h-72 bg-surface/50 relative">
                <Image fill src={urlFor(first.image).width(600).url()} alt={first.name} className="object-cover opacity-90" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
            ) : (
              <div className="h-56 md:h-72 bg-surface/30" />
            )}
            <div className="p-6">
              <h3 className="text-clean font-display font-black text-2xl leading-tight">{first.name}</h3>
              {first.description && <p className="text-ghost text-sm mt-2 leading-relaxed">{first.description}</p>}
            </div>
          </div>

          {/* Remaining items */}
          {rest.map((p) => (
            <div key={p._id} className="bg-ink">
              {p.image ? (
                <div className="h-32 bg-surface/50 relative">
                  <Image fill src={urlFor(p.image).width(400).url()} alt={p.name} className="object-cover opacity-80" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
              ) : (
                <div className="h-32 bg-surface/20" />
              )}
              <div className="p-4">
                <h3 className="text-clean font-semibold text-sm">{p.name}</h3>
                {p.description && <p className="text-ghost text-xs mt-1 leading-relaxed line-clamp-2">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
