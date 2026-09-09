import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

/**
 * "At your service".
 *
 * The owner struck three of the four promises on the content form — local
 * pickup, small batch and private blending — leaving only gift wrapping. One
 * card stranded in a four-column grid reads as a rendering fault, so the band
 * is now a single centred statement: the promise set in the display face,
 * carried between two hairlines. Restore the grid if more promises come back.
 */
export function Service() {
  return (
    <section
      className="bleed border-y py-[clamp(3.5rem,7vw,6rem)]"
      style={{ borderColor: 'var(--rule)', background: 'var(--ground-2)' }}
    >
      <div className="shell">
        <div className="mx-auto max-w-measure text-center">
          <Reveal>
            <p className="t-label t-label--accent">At your service</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="t-head mt-8">Gift wrapping</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="t-body t-body--lead mt-6">
              Hand-tied, with a written card.
            </p>
          </Reveal>
          <Reveal delay={230}>
            <div className="mt-10">
              <QuietLink href="/contact">Arrange it</QuietLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
