/**
 * The named works, now five, and no longer purely decorative.
 *
 * On the returned content form the owner redefined these as "the Archetypes …
 * essentially a category for tea blends", so they double as the site's
 * taxonomy: every product carries the slug of the archetype it belongs to.
 * The pages themselves stay editorial by request: they link to the blend
 * rather than listing products.
 *
 * Descriptions and pairings below are the owner's own words, restored to the
 * punctuation she actually used on the form. An earlier pass had replaced her
 * commas and full stops with em dashes, which is not how she writes. Leave
 * them alone.
 */
export type Muse = {
  slug: string;
  name: string;
  /**
   * Null where no artwork exists yet. The Old-Soul was added on the content
   * form without a painting; those plates render typographically instead of
   * showing a photograph.
   */
  image: string | null;
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
      'The Free Spirit moves by instinct, toward the coast no one recommended, the conversation that runs too long, the plan abandoned the moment something better appears. Freedom is not rebellion. It is simply the shape attention takes when nothing is holding it down.',
    pairsWith: 'peach-me-green',
  },
  {
    slug: 'the-poet',
    name: 'The Poet',
    image: '/images/muses/the-poet.jpg',
    alt: 'Two hands writing a letter in a bound journal with a fountain pen',
    blurb:
      'Language, for the Poet, is not decoration but excavation. Reaching past the obvious word for the true one. Willing to sit in silence until it arrives. It is simply how thought looks before it is ready to be read.',
    pairsWith: 'coco-breeze',
  },
  {
    slug: 'the-dreamer',
    name: 'The Dreamer',
    image: '/images/muses/the-dreamer.jpg',
    alt: 'A woman with a full amber halo of hair, face lifted, eyes closed',
    blurb:
      'The Dreamer occupies the threshold between waking and sleep, a territory the practical dismiss as distraction, but which functions in fact as a kind of fidelity: to a life still being drafted, to a self not yet finished arriving. This is not escapism. It is preparation conducted in a register most people have stopped listening to.',
    pairsWith: 'lavender-lullaby',
  },
  {
    slug: 'the-romantic',
    name: 'The Romantic',
    image: '/images/muses/romance.jpg',
    alt: 'Two clasped hands in deep red against burnt orange, a ring catching the light',
    blurb:
      'The Romantic is a study in unhurried devotion. Not the performance of love. The architecture of it. A letter drafted and reconsidered, a window left open through winter, a preference for one rose over an arrangement of many. Where others move toward conquest, the Romantic moves towards attention, treating tenderness as a discipline rather than a mood.',
    pairsWith: 'rose-vitalitea',
  },
  {
    // The painting arrived later than the other four. It is landscape where
    // they are portrait, so the grid crops it to the two figures; the full
    // composition shows on mobile, where the tile is 4:3.
    slug: 'the-old-soul',
    name: 'The Old-Soul',
    image: '/images/muses/the-old-soul.jpg',
    alt: 'An oil painting of an elderly white-haired man in conversation with a younger man across a desk, in a lamplit study lined with books',
    blurb:
      'The Old-Soul carries a gravity that seems borrowed from an earlier century. A preference for letters over messages, for rooms with history in their walls. This is not just nostalgia, it is loyalty extended toward whatever has already proven itself worth keeping.',
    pairsWith: 'classic-thyme',
  },
];

export function getMuse(slug: string): Muse | undefined {
  return MUSES.find((m) => m.slug === slug);
}
