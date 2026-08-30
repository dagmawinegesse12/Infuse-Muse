import Image from 'next/image';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

/**
 * Full-bleed inverted chapter break. Flipping ground and ink here is what keeps
 * a long page from reading as one continuous scroll.
 */
export function ChapterPlate() {
  return (
    <section
      className="bleed grid lg:grid-cols-2"
      style={{ background: 'var(--plate)', color: 'var(--plate-ink)' }}
    >
      <div className="plate relative order-2 min-h-[58vw] lg:order-1 lg:min-h-[36rem]">
        <Image
          src="/images/products/lavender-lullaby.png"
          alt="Lavender Lullaby in a glass cup with dried petals"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="order-1 flex items-center px-[var(--gutter)] py-[clamp(4rem,9vw,8rem)] lg:order-2">
        <div className="max-w-measure">
          <Reveal>
            <p className="t-label" style={{ color: 'var(--plate-ink)', opacity: 0.6 }}>
              On stillness
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="t-head mt-6" style={{ color: 'var(--plate-ink)' }}>
              Where lavender meets the last hour of the day
            </h2>
          </Reveal>
          <Reveal delay={170}>
            <p className="t-body mt-7" style={{ color: 'var(--plate-ink)', opacity: 0.72 }}>
              Lavender Lullaby was built backwards — from the quiet we wanted at the end
              of an evening, to the botanicals that could produce it. Soft, aromatic and
              entirely caffeine free.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-10">
              <QuietLink href="/products/lavender-lullaby" tone="plate">
                Discover the blend
              </QuietLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
