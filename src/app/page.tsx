import { getLocations, getActivePromotion, getProducts, getWeeklySpecials, getSiteSettings } from '@/lib/sanity/queries'
import Hero from '@/components/home/Hero'
import FuelPriceBoard from '@/components/home/FuelPriceBoard'
import LocationsStrip from '@/components/home/LocationsStrip'
import FeaturedPromotion from '@/components/home/FeaturedPromotion'
import WeeklySpecials from '@/components/home/WeeklySpecials'
import ProductsGrid from '@/components/home/ProductsGrid'
import EmploymentTeaser from '@/components/home/EmploymentTeaser'

export const revalidate = 60

export default async function HomePage() {
  const [locations, promotion, products, specials, settings] = await Promise.all([
    getLocations(),
    getActivePromotion(),
    getProducts(),
    getWeeklySpecials(),
    getSiteSettings(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <FuelPriceBoard locations={locations} />
      <LocationsStrip locations={locations} />
      <FeaturedPromotion promotion={promotion} />
      <WeeklySpecials specials={specials} />
      <ProductsGrid products={products} />
      <EmploymentTeaser />
    </>
  )
}
