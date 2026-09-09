import Link from 'next/link';
import { createMetadata } from '@/lib/metadata';
import { MUSES } from '@/lib/muses';
import { MusePlate } from '@/components/muse-plate';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';

export const metadata = createMetadata({
  title: 'The Archetypes',
  description: 'Five archetypes, and the blends that answer to them.',
  path: '/muses',
});

export default function MusesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Archetypes"
        title="Five archetypes and what they inspire."
        lede="Each work names a mood the house keeps returning to."
      />

      <div className="bleed grid grid-cols-2 lg:grid-cols-5">
        {MUSES.map((muse, i) => (
          <Reveal key={muse.slug} delay={i * 80}>
            <Link
              href={`/muses/${muse.slug}`}
              className="group block last:col-span-2 lg:last:col-span-1"
            >
              <div className="plate plate--hover relative aspect-[4/3] sm:aspect-[2/3]">
                <MusePlate muse={muse} sizes="(max-width: 1024px) 50vw, 20vw" />
                <div className="plate__veil" />
                <div className="absolute inset-x-0 bottom-0 p-[clamp(1rem,1.8vw,1.75rem)]">
                  <p className="t-numeral">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="t-sub mt-2" style={{ color: 'var(--on-media)' }}>
                    {muse.name}
                  </h2>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="pb-[var(--chapter)]" />
    </>
  );
}
