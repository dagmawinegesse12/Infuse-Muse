import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

/** The chapter opening. One paragraph, a great deal of air, nothing else. */
export function Manifesto() {
  return (
    <section className="chapter shell">
      <div className="mx-auto max-w-measure text-center">
        <Reveal>
          <p className="t-label t-label--accent">Infuse &amp; Muse</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="t-head mt-8">
            Tea is the smallest possible ceremony. We build ours around the pause,
            not the cup.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="t-body t-body--lead mt-8">
            Every blend is composed in small batches in Mississauga — leaf, petal and
            root chosen for how a room feels once the water goes on. Nothing here is
            in a hurry.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-12">
            <QuietLink href="/about">Read our story</QuietLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
