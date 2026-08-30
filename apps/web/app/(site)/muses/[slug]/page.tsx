import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { MUSES, getMuse } from '@/lib/muses';
import { getProductBySlug } from '@/lib/data';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export function generateStaticParams() {
  return MUSES.map((muse) => ({ slug: muse.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const muse = getMuse(params.slug);
  if (!muse) {
    return createMetadata({
      title: 'Not found | Infuse & Muse',
      description: 'This work could not be found.',
      path: `/muses/${params.slug}`,
    });
  }
  return createMetadata({
    title: `${muse.name} | The Muses`,
    description: muse.blurb,
    path: `/muses/${muse.slug}`,
    image: muse.image,
  });
}

export default async function MusePage({ params }: { params: { slug: string } }) {
  const muse = getMuse(params.slug);
  if (!muse) notFound();

  const pairing = await getProductBySlug(muse.pairsWith);

  return (
    <div className="grid lg:grid-cols-2">
      <div className="plate relative min-h-[80vw] lg:sticky lg:top-0 lg:h-screen lg:min-h-0">
        <Image
          src={muse.image}
          alt={muse.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="px-[var(--gutter)] pb-[clamp(5rem,9vw,8rem)] pt-[clamp(3rem,7vw,8rem)] lg:pt-[var(--header-clear)]">
        <div className="max-w-measure">
          <Reveal>
            <p className="t-label t-label--accent">The Muses</p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="t-display mt-6">{muse.name}</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="t-body t-body--lead mt-8">{muse.blurb}</p>
          </Reveal>

          {pairing ? (
            <Reveal delay={210}>
              <div className="mt-14 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
                <p className="t-label">Poured alongside</p>
                <h2 className="t-head mt-4">{pairing.title}</h2>
                <p className="t-body mt-4">{pairing.shortDescription}</p>
                <div className="mt-8">
                  <QuietLink href={`/products/${pairing.slug}`}>See the blend</QuietLink>
                </div>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={260}>
            <div className="mt-14">
              <QuietLink href="/muses">All four works</QuietLink>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
