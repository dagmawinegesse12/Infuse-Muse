/**
 * The four named works.
 *
 * NOTE — `blurb` is placeholder copy written to keep the pages from reading as
 * empty. It is not brand-approved. Replace each line (and `pairsWith`, which is
 * a guess at the tonal match) with the real story before launch.
 */
export type Muse = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  blurb: string;
  /** Slug of the blend this work is shown alongside. */
  pairsWith: string;
};

export const MUSES: Muse[] = [
  {
    slug: 'the-free-spirit',
    name: 'The Free Spirit',
    image: '/images/muses/the-free-spirit.jpg',
    alt: 'A deep green horse in profile, mane streaming, painted against warm peach',
    blurb:
      'Movement held still. Painted in the house green against a warm ground, for the part of a morning that refuses to be scheduled.',
    pairsWith: 'peach-me-green',
  },
  {
    slug: 'the-poet',
    name: 'The Poet',
    image: '/images/muses/the-poet.jpg',
    alt: 'Two hands writing a letter in a bound journal with a fountain pen',
    blurb:
      'A letter mid-sentence. The quietest of the four, and the one that most needs a cup going cold beside it.',
    pairsWith: 'rose-vitalitea',
  },
  {
    slug: 'the-dreamer',
    name: 'The Dreamer',
    image: '/images/muses/the-dreamer.jpg',
    alt: 'A woman with a full amber halo of hair, face lifted, eyes closed',
    blurb:
      'Head tilted back, eyes closed, hair caught like late light. Painted for the pause rather than the plan.',
    pairsWith: 'lavender-lullaby',
  },
  {
    slug: 'romance',
    name: 'Romance',
    image: '/images/muses/romance.jpg',
    alt: 'Two clasped hands in deep red against burnt orange, a ring catching the light',
    blurb:
      'Two hands and a single point of gold. The warmest of the set, and the least willing to explain itself.',
    pairsWith: 'coco-breeze',
  },
];

export function getMuse(slug: string): Muse | undefined {
  return MUSES.find((m) => m.slug === slug);
}
