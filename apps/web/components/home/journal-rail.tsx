import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/system/reveal';

const ENTRIES: Array<{ title: string; copy: string; image: string; href: string }> = [
  {
    title: 'On the rose harvest',
    copy: 'Why we buy petals by the season rather than the year, and what it costs us.',
    image: '/images/products/rose-vitalitea.png',
    href: '/products/rose-vitalitea',
  },
  {
    title: 'The case for loose leaf',
    copy: 'A bag holds dust. A leaf holds oil. The difference is most of the flavour.',
    image: '/images/products/peach-me-green.png',
    href: '/products/peach-me-green',
  },
  {
    title: 'Blending for the evening',
    copy: 'Composing a cup for the hour when nobody wants to be woken up.',
    image: '/images/products/lavender-lullaby.png',
    href: '/products/lavender-lullaby',
  },
  {
    title: 'Spice, restrained',
    copy: 'Warmth without the syrup — how Coco Breeze stays a tea, not a dessert.',
    image: '/images/products/coco-breeze.png',
    href: '/products/coco-breeze',
  },
  {
    title: 'A note on water',
    copy: 'The ingredient nobody lists, and the one that decides the cup.',
    image: '/images/products/minted-stillness.png',
    href: '/products/minted-stillness',
  },
];

/** Horizontal rail, snap-scrolled, scrollbar hidden. */
export function JournalRail() {
  return (
    <section id="journal" className="chapter">
      <div className="shell">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="t-label t-label--accent">Journal</p>
              <h2 className="t-head mt-4">Inside Infuse &amp; Muse</h2>
            </div>
            <p className="t-label hidden sm:block">Scroll →</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="rail mt-14">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group block w-[78vw] sm:w-[42vw] lg:w-[26vw]"
            >
              <div className="plate plate--hover relative aspect-[4/5]">
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 26vw"
                  className="object-cover"
                />
              </div>
              <h3 className="t-sub mt-5">{entry.title}</h3>
              <p className="t-body mt-2">{entry.copy}</p>
            </Link>
          ))}
          {/* Trailing air so the last card can snap clear of the edge. */}
          <div aria-hidden className="w-[var(--gutter)] shrink-0" />
        </div>
      </Reveal>
    </section>
  );
}
