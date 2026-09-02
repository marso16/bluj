import { getLocation, getLocations } from "@/lib/sanity/queries";
import OpenIndicator from "@/components/home/OpenIndicator";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((l) => ({ slug: l.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loc = await getLocation(slug);
  if (!loc) return { title: "Location Not Found" };
  return {
    title: loc.name,
    description: `BluJ ${loc.name}, ${loc.address}. Fuel, convenience, and deli.`,
    openGraph: { title: `${loc.name} | BluJ`, description: loc.address },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug);
  if (!loc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "name": `BluJ ${loc.name}`,
    "address": { "@type": "PostalAddress", "streetAddress": loc.address, "addressCountry": "US" },
    ...(loc.phone ? { "telephone": loc.phone } : {}),
    ...(loc.lat && loc.lng ? { "geo": { "@type": "GeoCoordinates", "latitude": loc.lat, "longitude": loc.lng } } : {}),
    "openingHoursSpecification": (loc.hours ?? [])
      .filter(h => !h.closed)
      .map(h => ({ "@type": "OpeningHoursSpecification", "dayOfWeek": `https://schema.org/${h.day}`, "opens": h.open, "closes": h.close })),
    "url": `https://bluj.com/locations/${loc.slug.current}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="max-w-4xl mx-auto px-6 py-24">
      <Link
        href="/locations"
        className="text-ghost text-[10px] uppercase tracking-[0.2em] hover:text-clean transition-colors mb-10 block"
      >
        ← All Locations
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
        <div>
          <p className="text-ghost text-xs uppercase tracking-widest mb-2">BluJ Station</p>
          <h1 className="font-display font-black text-clean text-5xl md:text-7xl leading-none">
            {loc.name}
          </h1>
          <p className="text-ghost mt-4">{loc.address}</p>
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

      <div className="h-px bg-glow/20 mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Hours */}
        {loc.hours?.length > 0 && (
          <div>
            <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-6">Hours</p>
            <div className="flex flex-col gap-2">
              {DAYS.map((day) => {
                const entry = loc.hours.find((h) => h.day === day);
                return (
                  <div key={day} className="flex justify-between text-sm border-b border-surface/50 pb-2">
                    <span className="text-ghost">{day}</span>
                    <span className="text-clean tabular-nums">
                      {entry?.closed ? "Closed" : entry ? `${entry.open} – ${entry.close}` : "N/A"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fuel + Amenities */}
        <div className="flex flex-col gap-8">
          {loc.fuelPrices && loc.fuelPrices.length > 0 && (
            <div>
              <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-4">Fuel Prices</p>
              <div className="grid grid-cols-2 gap-px bg-surface/30">
                {loc.fuelPrices.map((fp) => (
                  <div key={fp.grade} className="bg-ink px-4 py-4 flex flex-col gap-1">
                    <p className="text-ghost text-[10px] uppercase tracking-[0.2em]">{fp.grade}</p>
                    <p className="font-display font-black text-glow text-2xl leading-none">${fp.price.toFixed(3)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loc.amenities?.length > 0 && (
            <div>
              <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-4">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {loc.amenities.map((a) => (
                  <span key={a} className="text-ghost text-[11px] uppercase tracking-[0.1em] bg-surface px-3 py-1.5">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="mt-12 border-t border-surface/50 pt-12">
        <p className="text-ghost text-[11px] uppercase tracking-[0.2em] mb-4">Map</p>
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed&z=15`}
          width="100%"
          height="320"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full block"
          style={{ filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)" }}
          title={`Map for ${loc.name}`}
        />
      </div>
    </div>
    </>
  );
}
