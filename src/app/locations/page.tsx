import { getLocations } from '@/lib/sanity/queries'
import OpenIndicator from '@/components/home/OpenIndicator'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Locations | BluJ' }
export const revalidate = 60

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default async function LocationsPage() {
  const locations = await getLocations()

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">Where To Find Us</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-16">Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(loc => (
          <div key={loc._id} className="bg-surface p-8 border border-ink/50 hover:border-charge/20 transition-colors duration-300">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-clean font-display font-black text-3xl leading-none">{loc.name}</h2>
                <p className="text-ghost mt-2">{loc.address}</p>
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-charge text-sm mt-1 block hover:text-charge/70 transition-colors">
                    {loc.phone}
                  </a>
                )}
              </div>
              <div className="flex-shrink-0 mt-1">
                <OpenIndicator hours={loc.hours ?? []} />
              </div>
            </div>

            {loc.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-5">
                {loc.amenities.map(a => (
                  <span key={a} className="text-ghost text-[11px] uppercase tracking-[0.1em] bg-ink px-2.5 py-1">{a}</span>
                ))}
              </div>
            )}

            {loc.hours?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-ink/50">
                <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-4">Hours</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                  {DAYS.map(day => {
                    const entry = loc.hours.find(h => h.day === day)
                    return (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-ghost">{day.slice(0, 3)}</span>
                        <span className="text-clean tabular-nums">
                          {entry?.closed ? 'Closed' : entry ? `${entry.open} – ${entry.close}` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-ink/50">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed&z=15`}
                width="100%"
                height="200"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full block"
                style={{ filter: 'invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
                title={`Map for ${loc.name}`}
              />
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <p className="text-ghost text-sm">No locations found — add them in the Studio.</p>
      )}
    </div>
  )
}
