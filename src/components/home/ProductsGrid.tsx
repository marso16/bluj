import { urlFor } from '@/lib/sanity/client'
import Link from 'next/link'
import type { Product } from '@/lib/sanity/types'

const LABEL: Record<string, string> = { fuel: 'Fuel', convenience: 'Convenience', deli: 'Deli', food: 'Food' }

export default function ProductsGrid({ products }: { products: Product[] }) {
  const featured = products.filter(p => p.featured).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">What We Offer</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl">Products</h2>
          </div>
          <Link href="/products" className="text-charge text-sm font-medium hover:text-charge/70 transition-colors hidden md:block">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((p, i) => (
            <div key={p._id}
              className={`bg-surface rounded-lg overflow-hidden border border-ink/50 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              {p.image && (
                <div className={`bg-ink/50 ${i === 0 ? 'h-56 md:h-72' : 'h-32'}`}>
                  <img src={urlFor(p.image).width(600).url()} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <span className="text-ghost text-xs uppercase tracking-wider">{LABEL[p.category] ?? p.category}</span>
                <h3 className="text-clean font-semibold mt-1">{p.name}</h3>
                {i === 0 && p.description && <p className="text-ghost text-sm mt-2 leading-relaxed">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
