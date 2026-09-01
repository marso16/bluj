import Link from 'next/link'
import OpenIndicator from './OpenIndicator'
import type { Location } from '@/lib/sanity/types'

export default function LocationsStrip({ locations }: { locations: Location[] }) {
  return (
    <section className="py-20 px-6 border-t border-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl">Locations</h2>
          </div>
          <Link href="/locations" className="text-charge text-sm font-medium hover:text-charge/70 transition-colors hidden md:block">
            All locations + maps →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {locations.map(loc => (
            <div key={loc._id}
              className="snap-start flex-shrink-0 w-72 bg-surface rounded-lg p-6 border border-ink/50 hover:border-charge/30 transition-colors duration-200">
              <OpenIndicator hours={loc.hours ?? []} />
              <h3 className="text-clean font-semibold mt-3 text-lg leading-tight">{loc.name}</h3>
              <p className="text-ghost text-sm mt-1 leading-relaxed">{loc.address}</p>
              {loc.phone && (
                <a href={`tel:${loc.phone}`} className="text-charge text-sm mt-3 block hover:text-charge/70 transition-colors">
                  {loc.phone}
                </a>
              )}
              {loc.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {loc.amenities.map(a => (
                    <span key={a} className="text-ghost text-xs bg-ink px-2 py-0.5 rounded-sm">{a}</span>
                  ))}
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-glow text-xs uppercase tracking-[0.15em] mt-5 block hover:text-glow/70 transition-colors"
              >
                Get directions →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
