import { getProducts } from "@/lib/sanity/queries";
import ProductsFilter from "@/components/products/ProductsFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Fuel, deli, convenience items, and more at every BluJ location across NH and VT.",
  openGraph: { title: "Products | BluJ", description: "Fuel, deli, convenience items, and more at every BluJ location." },
};
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">At Every Location</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-12">Products</h1>
      <ProductsFilter products={products} />
    </div>
  );
}
