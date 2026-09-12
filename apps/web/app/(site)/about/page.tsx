import Image from 'next/image';
import { createMetadata } from '@/lib/metadata';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export const metadata = createMetadata({
  title: 'The Prologue',
  description:
    'How Infuse & Muse began: a granddaughter, a slow winter, and a cup made with intention.',
  path: '/about',
});

/**
 * Two sections: The Muse, then the Prologue.
 *
 * THE MUSE is the founder story the owner gave in Part E of the returned
 * content form, under a field headed "Founder story? (The Muse)". "The Muse" is
 * her grandmother, so the portrait and the story are set side by side rather
 * than stacked: the picture stays with the words it belongs to, sticky beside
 * the column on wide screens.
 *
 * THE PROLOGUE is the brand statement she sent separately. It is written as
 * verse, so the line breaks are hers and are preserved with `whitespace-pre-line`
 * rather than reflowed into prose.
 *
 * On the copy. The founder story is her wording verbatim: an earlier pass had
 * swapped em dashes for her commas and full stops and expanded her
 * contractions, and that was undone. Do not tidy it again. The Prologue is the
 * documented exception: three em dashes she typed became commas (the site
 * carries none anywhere), and it was then lightly warmed at the client's
 * request, softening the most declarative lines while keeping her structure,
 * her line breaks and her strongest phrases. Her original is in the chat
 * history if any of it needs to come back.
 *
 * The h1 is her opening sentence in The Muse. It is the real statement of the
 * page and it sits at the top.
 */
const STORY: string[] = [
  "When my mother and grandmother came to visit me in Toronto from Ethiopia, the winter slowed everything down. My grandmother, who has always loved tea, would drink three to five cups a day. I found myself preparing it for her daily. At first, using tea bags out of habit. But something about that didn't feel right.",
  'As I learned more about what we consume so routinely, I began to question the quality of something as simple as tea. So I made a small shift, I started brewing loose leaf instead.',
  'What began as a simple change turned into something more intentional.',
  "Because she wasn't moving as much during the colder months, I wanted her tea to do more than comfort her, I wanted it to support her. I experimented. I replaced what didn't resonate. I adapted to her preferences. When she didn't enjoy green tea, I softened it. I added hibiscus to help her body release excess fluid. When she grew tired of eating bananas daily, I introduced goji berries for their natural richness in potassium.",
  'One blend turned into another. Ingredients became expressions.',
];

const CLOSING: string[] = [
  'And somewhere in that process, tea became more than tea. It became a space, an oasis where time slows down, where intention matters, and where every cup holds both function and feeling.',
  'Infuse & Muse is an extension of that experience.',
];

/** Her verse, one entry per stanza. Newlines are her line breaks; keep them. */
const PROLOGUE: string[] = [
  'There is a quiet we have forgotten.\nNot silence, but stillness.\nThe kind that lingers between moments.\nThe kind that softens time, slows the breath, and asks you to be present.',
  'Infuse & Muse was born in that space.',
  'Tea, to us, is not just something to drink.\nIt is something to enter.\nA ritual. A passage. A return.',
  'Each blend is composed the way a perfumer composes a scent,\nlayered, intentional, evocative.\nBotanicals are chosen not only for taste,\nbut for how they unfold, how they feel,\nand how they turn a moment into something you remember.',
  'We love the art of infusion.\nThe patience of steeping.\nThe beauty of waiting.',
  'Because in waiting, there is awareness.\nAnd in awareness, there is luxury.',
  'It is not excess.\nIt is care.\nThe quiet luxury of being fully present.',
  'Infuse & Muse is for anyone who wants more than something to drink,\nfor anyone who looks for atmosphere, meaning, and a pause in the day.\nFor anyone who knows that indulgence\nis not about having more,\nbut about noticing more.',
  "We don't just make tea.\nWe make the moment around it.",
];

export default function AboutPage() {
  return (
    <>
      <section className="shell pb-[var(--chapter)] pt-[var(--header-clear)]">
        <Reveal>
          <p className="t-label t-label--accent">The Muse</p>
        </Reveal>

        <div className="mt-8 grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
          {/* Her portrait, beside the story rather than above it. The print is
              old, creased and scratched, so it is held to a single narrow
              column: at this size the damage reads as age, not as a bad scan.
              Sticky on wide screens so her face stays with the text. */}
          <Reveal delay={80}>
            <figure className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="relative aspect-[4/5] w-full max-w-[22rem] overflow-hidden">
                <Image
                  src="/images/the-muse.jpg"
                  alt="A black and white portrait of the founder's grandmother as a young woman"
                  fill
                  priority
                  sizes="(min-width: 1024px) 22rem, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="t-body mt-6">My grandmother.</figcaption>
            </figure>
          </Reveal>

          <div className="max-w-measure">
            <Reveal>
              <h1 className="t-head">Infuse &amp; Muse was born in a quiet moment of care.</h1>
            </Reveal>

            <div className="mt-10 space-y-7">
              {STORY.map((paragraph, i) => (
                <Reveal key={i} delay={60 + i * 50}>
                  <p className="t-body">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* The hinge of the story, lifted out of the flow. */}
            <Reveal delay={120}>
              <figure
                className="my-[clamp(2.5rem,5vw,4rem)] border-y py-[clamp(2rem,4vw,3rem)]"
                style={{ borderColor: 'var(--rule)' }}
              >
                <blockquote className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.14]">
                  Care became ritual.
                </blockquote>
              </figure>
            </Reveal>

            <div className="space-y-7">
              {CLOSING.map((paragraph, i) => (
                <Reveal key={i} delay={i * 70}>
                  {/* Plain t-body like the paragraphs above it: t-body--lead
                      carries a different ink as well as a larger size, and this
                      page reads in one colour throughout. */}
                  <p className="t-body">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="shell border-t pb-[var(--chapter)] pt-[clamp(3rem,6vw,5rem)]"
        style={{ borderColor: 'var(--rule)' }}
      >
        <Reveal>
          <p className="t-label t-label--accent">The Prologue</p>
        </Reveal>

        <div className="mt-10 max-w-measure space-y-8">
          {PROLOGUE.map((stanza, i) => (
            <Reveal key={i} delay={60 + i * 40}>
              {/* Every stanza takes the same ink; the opening one no longer
                  leads in a heavier colour. */}
              <p className="t-body whitespace-pre-line">{stanza}</p>
            </Reveal>
          ))}
        </div>

        {/* Her sign-off, set as a mark rather than another paragraph. */}
        <Reveal delay={120}>
          <div className="mt-[clamp(3rem,6vw,4.5rem)]">
            <p className="t-label t-label--accent">Infuse &amp; Muse</p>
            <p className="t-sub mt-3">Redefining stillness.</p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-8">
            <QuietLink href="/products">Browse the blends</QuietLink>
            <QuietLink href="/muses">The Archetypes</QuietLink>
            <QuietLink href="/contact">Get in touch</QuietLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
