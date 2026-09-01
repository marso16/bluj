import { urlFor } from '@/lib/sanity/client'
import type { Promotion } from '@/lib/sanity/types'

export default function FeaturedPromotion({ promotion }: { promotion: Promotion | null }) {
  if (!promotion) return null

  return (
    <section className="py-2 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-lg overflow-hidden min-h-64 flex items-end p-10"
          style={{
            backgroundImage: promotion.image ? `url(${urlFor(promotion.image).width(1400).url()})` : undefined,
            backgroundColor: 'var(--color-surface)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
          <div className="relative">
            <p className="text-glow text-xs uppercase tracking-widest mb-2">Current Offer</p>
            <h2 className="font-display font-black text-clean text-4xl md:text-6xl leading-none">{promotion.title}</h2>
            {promotion.description && <p className="text-clean/70 mt-3 max-w-lg">{promotion.description}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
