import { Reveal } from '@/components/system/reveal';

const STEPS: Array<[string, string, string]> = [
  ['I', 'Measure', 'One heaped teaspoon for every cup. Loose, never bagged — the leaf needs room to open.'],
  ['II', 'Steep', 'Three to five minutes, off the boil. Longer draws the tannin forward; shorter keeps it floral.'],
  ['III', 'Sit', 'The part most people skip. The blend is designed for the minutes after it is poured.'],
];

/** Numbered editorial rows separated by hairlines. No boxes, no cards. */
export function Ritual() {
  return (
    <section className="chapter shell">
      <Reveal>
        <p className="t-label t-label--accent">The Ritual</p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="t-head mt-4 max-w-lg">Three steps, one of which is doing nothing.</h2>
      </Reveal>

      <div className="mt-16">
        {STEPS.map(([numeral, title, copy], i) => (
          <Reveal key={title} delay={i * 90}>
            <div
              className="grid gap-4 border-t py-10 sm:grid-cols-[4rem_1fr] lg:grid-cols-[6rem_16rem_1fr] lg:gap-10"
              style={{ borderColor: 'var(--rule)' }}
            >
              <span className="t-numeral pt-1">{numeral}</span>
              <h3 className="t-sub">{title}</h3>
              <p className="t-body max-w-measure">{copy}</p>
            </div>
          </Reveal>
        ))}
        <hr className="rule" />
      </div>
    </section>
  );
}
