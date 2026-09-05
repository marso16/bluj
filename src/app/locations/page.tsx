import { getLocations } from "@/lib/sanity/queries";
import NearestLocation from "@/components/locations/NearestLocation";
import LocationsGrid from "@/components/locations/LocationsGrid";
import AllLocationsMap from "@/components/locations/AllLocationsMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find your nearest BluJ gas station in New Hampshire and Vermont. View hours, fuel prices, and directions.",
  openGraph: { title: "Locations | BluJ", description: "Find your nearest BluJ. Hours, fuel prices, and maps." },
};
export const revalidate = 60;

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">
        Where To Find Us
      </p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-6">
        Locations
      </h1>
      <div className="mb-16">
        <NearestLocation locations={locations} />
      </div>

      <AllLocationsMap locations={locations} />

      <LocationsGrid locations={locations} />

      {locations.length === 0 && (
        <p className="text-ghost text-sm">
          No locations found. Add them in the Studio.
        </p>
      )}
    </div>
  );
}
