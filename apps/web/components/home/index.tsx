import { getProducts } from '@/lib/data';
import { Hero } from '@/components/home/hero';
import { Manifesto } from '@/components/home/manifesto';
import { FeaturedBlends } from '@/components/home/featured-blends';
import { Muses } from '@/components/home/muses';
import { Service } from '@/components/home/service';
import { Invitation } from '@/components/home/invitation';

/**
 * One homepage, rendered in whichever tonality the surrounding SiteShell sets.
 * Nothing below here reads the theme — it all resolves through CSS variables.
 *
 * The owner struck four sections on the content form of 9 September 2026:
 * the feature panel (ChapterPlate), the brewing steps (Ritual), the seasonal
 * band (Seasonal) and the journal rail (JournalRail). Their components are
 * left in the tree rather than deleted — the journal was marked "remove, but
 * we will bring it back" — so restoring any of them is an import away.
 */
export async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedBlends products={(featured.length ? featured : products).slice(0, 3)} />
      <Muses />
      <Service />
      <Invitation />
    </>
  );
}
