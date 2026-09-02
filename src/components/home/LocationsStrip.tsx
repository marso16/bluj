import Link from 'next/link'
import OpenIndicator from './OpenIndicator'
import NearestLocation from '@/components/locations/NearestLocation'
import type { Location } from '@/lib/sanity/types'

export default function LocationsStrip({ locations }: { locations: Location[] }) {
  return (
    <section className="py-20 border-t border-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl">Locations</h2>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link href="/locations" className="text-charge text-sm font-medium hover:text-charge/70 transition-colors hidden md:block">
              All locations + maps →
            </Link>
            <NearestLocation locations={locations} />
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {locations.map(loc => {
            const regular = loc.fuelPrices?.find(f => f.grade === 'Regular')
            return (
              <Link
                key={loc._id}
                href="/locations"
                className="snap-start flex-shrink-0 w-64 bg-ink p-6 flex flex-col gap-3 border-l-2 border-transparent border-r border-r-surface hover:border-l-glow hover:bg-surface transition-all duration-200 group"
              >
                <OpenIndicator hours={loc.hours ?? []} />
                <h3 className="font-display font-black text-clean text-2xl leading-none group-hover:text-glow transition-colors">
                  {loc.name}
                </h3>
                <p className="text-ghost text-xs leading-relaxed">{loc.address}</p>
                {loc.phone && <p className="text-charge text-xs">{loc.phone}</p>}
                {regular && (
                  <p className="text-ghost text-[10px] uppercase tracking-[0.1em]">
                    Regular <span className="text-glow font-display font-black text-sm">${regular.price.toFixed(3)}</span>
                  </p>
                )}
                {loc.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-surface">
                    {loc.amenities.map(a => (
                      <span key={a} className="text-ghost text-[10px] uppercase tracking-[0.1em] bg-surface px-2 py-0.5">{a}</span>
                    ))}
                  </div>
                )}
                <p className="text-glow text-[10px] uppercase tracking-[0.2em]">View map →</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
