import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/metadata';
import { MUSES } from '@/lib/muses';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';

export const metadata = createMetadata({
  title: 'The Muses | Infuse & Muse',
  description: 'Four named works, and the blends that answer to them.',
  path: '/muses',
});

export default function MusesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Muses"
        title="Four portraits, and the blends that answer to them."
        lede="Each work names a mood the house keeps returning to."
      />

      <div className="bleed grid grid-cols-2 lg:grid-cols-4">
        {MUSES.map((muse, i) => (
          <Reveal key={muse.slug} delay={i * 80}>
            <Link href={`/muses/${muse.slug}`} className="group block">
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
