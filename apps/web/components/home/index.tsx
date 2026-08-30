import { getProducts } from '@/lib/data';
import { Hero } from '@/components/home/hero';
import { Manifesto } from '@/components/home/manifesto';
import { FeaturedBlends } from '@/components/home/featured-blends';
import { ChapterPlate } from '@/components/home/chapter-plate';
import { Muses } from '@/components/home/muses';
import { Ritual } from '@/components/home/ritual';
import { Seasonal } from '@/components/home/seasonal';
import { Service } from '@/components/home/service';
import { JournalRail } from '@/components/home/journal-rail';
import { Invitation } from '@/components/home/invitation';

/**
 * One homepage, rendered in whichever tonality the surrounding SiteShell sets.
 * Nothing below here reads the theme — it all resolves through CSS variables.
 */
export async function Home() {
  const products = await getProducts();

  const featured = products.filter((p) => p.featured);
  const seasonal = products.filter((p) => p.seasonal);

  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedBlends products={(featured.length ? featured : products).slice(0, 3)} />
      <Muses />
      <ChapterPlate />
      <Ritual />
      <Seasonal products={seasonal.length ? seasonal : products.slice(0, 2)} />
      <Service />
      <JournalRail />
      <Invitation />
    </>
  );
}
