import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';
import { MUSES } from '@/lib/muses';

/**
 * The four named works, run edge to edge with no gaps — a wall of images
 * rather than a row of cards. Names sit on the photographs themselves.
 */

export function Muses() {
  return (
    <section className="pb-[var(--chapter)]">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-label t-label--accent">The Muses</p>
              <h2 className="t-head mt-4 max-w-lg">
                Four portraits, and the blends that answer to them.
              </h2>
            </div>
            <QuietLink href="/muses">The collection</QuietLink>
          </div>
        </Reveal>
      </div>

      <Reveal delay={90}>
        <div className="bleed mt-14 grid grid-cols-2 lg:grid-cols-4">
          {MUSES.map((muse, i) => (
            <Link key={muse.slug} href={`/muses/${muse.slug}`} className="group block">
              <div className="plate plate--hover relative aspect-[2/3]">
                <Image
                  src={muse.image}
                  alt={muse.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="plate__veil" />
                <div className="absolute inset-x-0 bottom-0 p-[clamp(1rem,1.8vw,1.75rem)]">
                  <p className="t-numeral" style={{ opacity: 0.85 }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="t-sub mt-2" style={{ color: 'var(--on-media)' }}>
                    {muse.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
