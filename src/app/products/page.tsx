import { getProducts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
import type { Metadata } from "next";
import type { Product } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Fuel, deli, convenience items, and more at every BluJ location across NH and VT.",
  openGraph: { title: "Products | BluJ", description: "Fuel, deli, convenience items, and more at every BluJ location." },
};
export const revalidate = 60;

const CATEGORIES: { key: Product["category"]; label: string }[] = [
  { key: "fuel", label: "Fuel" },
  { key: "deli", label: "Deli" },
  { key: "food", label: "Food" },
  { key: "convenience", label: "Convenience" },
];

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">
        At Every Location
      </p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-20">
        Products
      </h1>

      <div className="space-y-24">
        {CATEGORIES.map((cat) => {
          const items = products.filter((p) => p.category === cat.key);
          if (items.length === 0) return null;
          const [first, ...rest] = items;

          return (
            <div key={cat.key}>
              {/* Category label — amber rule */}
              <div className="flex items-center gap-6 mb-10">
                <h2 className="font-display font-black text-glow text-3xl uppercase tracking-[0.15em] flex-shrink-0">
                  {cat.label}
                </h2>
                <div className="h-px flex-1 bg-glow/20" />
              </div>

              {/* Asymmetric layout — hero item + rest */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-surface/50">
                {/* First item — full height feature */}
                <div className="col-span-2 md:col-span-1 bg-ink row-span-2">
                  {first.image ? (
                    <div className="h-56 md:h-72 bg-surface/50">
                      <img
                        src={urlFor(first.image).width(600).url()}
                        alt={first.name}
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>
                  ) : (
                    <div className="h-56 md:h-72 bg-surface/30" />
                  )}
                  <div className="p-6">
                    <h3 className="text-clean font-display font-black text-2xl leading-tight">
                      {first.name}
                    </h3>
                    {first.description && (
                      <p className="text-ghost text-sm mt-2 leading-relaxed">
                        {first.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remaining items — compact */}
                {rest.map((p) => (
                  <div key={p._id} className="bg-ink">
                    {p.image ? (
                      <div className="h-32 bg-surface/50">
                        <img
                          src={urlFor(p.image).width(400).url()}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-surface/20" />
                    )}
                    <div className="p-4">
                      <h3 className="text-clean font-semibold text-sm">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="text-ghost text-xs mt-1 leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="text-ghost text-sm">
          No products found — add them in the Studio.
        </p>
      )}
    </div>
  );
}
