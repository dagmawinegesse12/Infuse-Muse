import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

const PILLARS: Array<[string, string]> = [
  [
    'Flavour, told plainly',
    'Every blend carries a name, a mood and a stated set of notes. No mystery, no filler.',
  ],
  [
    'Giftable by design',
    'From the packaging to the writing, the whole object is built to be handed to someone.',
  ],
  [
    'Rooted in Mississauga',
    'A local house with local roots — made for discovery, pickup and the people nearby.',
  ],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Maison"
        title="A tea house built around calm, beauty and everyday ritual."
        lede="Rooted in Mississauga. Made for people who think tea is less a drink than a moment."
      />

      <section className="shell pb-[var(--chapter)]">
        <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-8 lg:grid-cols-2">
          <Reveal>
            <p className="t-body t-body--lead">
              Infuse &amp; Muse was imagined as a boutique experience rather than a shelf of
              commodities. The blends centre on mood and on the quiet luxury of a cup made
              with intention.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="t-body t-body--lead">
              Each composition is named with personality and presented with care, so that
              gifting takes no effort at all — for a friend, for a ritual, or for yourself.
            </p>
          </Reveal>
        </div>

        <div className="mt-[clamp(4rem,8vw,7rem)]">
          {PILLARS.map(([title, copy], i) => (
            <Reveal key={title} delay={i * 90}>
              <div
                className="grid gap-4 border-t py-10 lg:grid-cols-[6rem_20rem_1fr] lg:gap-10"
                style={{ borderColor: 'var(--rule)' }}
              >
                <span className="t-numeral pt-1">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="t-sub">{title}</h2>
                <p className="t-body max-w-measure">{copy}</p>
              </div>
            </Reveal>
          ))}
          <hr className="rule" />
        </div>

        <Reveal>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-8">
            <QuietLink href="/products">Browse the blends</QuietLink>
            <QuietLink href="/contact">Get in touch</QuietLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
