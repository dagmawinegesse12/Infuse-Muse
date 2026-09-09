import Link from 'next/link';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';
import { MUSES } from '@/lib/muses';
import { MusePlate } from '@/components/muse-plate';

/**
 * The five archetypes, run edge to edge with no gaps — a wall of images rather
 * than a row of cards. Names sit on the artwork itself.
 *
 * Five into two columns leaves an orphan on narrow screens, so the last plate
 * spans the full width there and takes a wider crop to stop it towering.
 */

export function Muses() {
  return (
    <section className="pb-[var(--chapter)]">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-label t-label--accent">The Archetypes</p>
              <h2 className="t-head mt-4 max-w-lg">
                Five archetypes and what they inspire.
              </h2>
            </div>
            <QuietLink href="/muses">The collection</QuietLink>
          </div>
        </Reveal>
      </div>

      <Reveal delay={90}>
        <div className="bleed mt-14 grid grid-cols-2 lg:grid-cols-5">
          {MUSES.map((muse, i) => (
            <Link
              key={muse.slug}
              href={`/muses/${muse.slug}`}
              className="group block last:col-span-2 lg:last:col-span-1"
            >
              <div className="plate plate--hover relative aspect-[4/3] sm:aspect-[2/3]">
                <MusePlate muse={muse} sizes="(max-width: 1024px) 50vw, 20vw" />
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
