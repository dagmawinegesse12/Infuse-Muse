import { createMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export const metadata = createMetadata({
  title: 'The Maison',
  description:
    'How Infuse & Muse began — a granddaughter, a slow winter, and a cup made with intention.',
  path: '/about',
});

/**
 * The owner struck both opening paragraphs and all three pillars on the content
 * form, and supplied a founder story in their place. That story is now the page.
 *
 * It is set as one narrow column of narrative with a single line lifted out of
 * it — the turn the whole story rests on — rather than broken into cards. The
 * writing is personal and first-person; cards would flatten it.
 */
const STORY: string[] = [
  'When my mother and grandmother came to visit me in Toronto from Ethiopia, the winter slowed everything down. My grandmother, who has always loved tea, would drink three to five cups a day. I found myself preparing it for her daily — at first using tea bags, out of habit. But something about that did not feel right.',
  'As I learned more about what we consume so routinely, I began to question the quality of something as simple as tea. So I made a small shift: I started brewing loose leaf instead.',
  'What began as a simple change turned into something more intentional.',
  'Because she was not moving as much during the colder months, I wanted her tea to do more than comfort her — I wanted it to support her. I experimented. I replaced what did not resonate. I adapted to her preferences. When she did not enjoy green tea, I softened it. I added hibiscus to help her body release excess fluid. When she grew tired of eating bananas daily, I introduced goji berries for their natural richness in potassium.',
  'One blend turned into another. Ingredients became expressions.',
];

const CLOSING: string[] = [
  'And somewhere in that process, tea became more than tea. It became a space — an oasis where time slows down, where intention matters, and where every cup holds both function and feeling.',
  'Infuse & Muse is an extension of that experience.',
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
        <div className="mx-auto max-w-measure">
          <Reveal>
            <p className="t-head">Infuse &amp; Muse was born in a quiet moment of care.</p>
          </Reveal>

          <div className="mt-12 space-y-7">
            {STORY.map((paragraph, i) => (
              <Reveal key={i} delay={60 + i * 50}>
                <p className="t-body">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The hinge of the story, given its own air. */}
        <Reveal delay={120}>
          <figure
            className="mx-auto mt-[clamp(3.5rem,7vw,6rem)] max-w-3xl border-y py-[clamp(3rem,6vw,5rem)] text-center"
            style={{ borderColor: 'var(--rule)' }}
          >
            <blockquote className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-[1.12]">
              Care became ritual.
            </blockquote>
          </figure>
        </Reveal>

        <div className="mx-auto mt-[clamp(3.5rem,7vw,6rem)] max-w-measure space-y-7">
          {CLOSING.map((paragraph, i) => (
            <Reveal key={i} delay={i * 70}>
              <p className="t-body t-body--lead">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mx-auto mt-16 flex max-w-measure flex-wrap gap-x-12 gap-y-8">
            <QuietLink href="/products">Browse the blends</QuietLink>
            <QuietLink href="/muses">The Archetypes</QuietLink>
            <QuietLink href="/contact">Get in touch</QuietLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
