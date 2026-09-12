/**
 * The boxed sets: a blend's tin packed with a strainer, a saucer, a spoon and an
 * infuser ball in the box.
 *
 * Each one is its own Shopify product rather than a variant of the blend, for
 * two reasons that are easy to undo by accident. Shopify sets the tax Category
 * per product, and the CRA zero-rates a mixed basket only when 90% or more of
 * its value is zero-rated — the accessories are over half the value here, so
 * the whole box is taxable while a tin on its own is not. A variant hanging off
 * a blend would inherit the tea category and ship untaxed. Separate products
 * also cost nothing in the cart, which reads one variant per product.
 *
 * The link between a blend and its set is the TITLE, not the handle: the
 * products were created by duplication and their handles are not uniformly
 * derived. If a title is ever edited in Shopify the pairing simply stops being
 * found, and the page falls back to selling the tin alone — see
 * `components/product/purchase.tsx`, which renders no control without a set.
 */
export const FULL_SET_SUFFIX = " Full Set";

/** True for the boxed sets, which are kept out of the blends listing. */
export function isFullSet(product: { title: string }): boolean {
  return product.title.endsWith(FULL_SET_SUFFIX);
}

/** The Shopify title of the set that belongs to a blend. */
export function fullSetTitleFor(blendTitle: string): string {
  return `${blendTitle}${FULL_SET_SUFFIX}`;
}

export type Slide = { src: string; alt: string };

/**
 * The pieces, shot on the same dark velvet as the boxes. They are identical
 * in every set, so they are shared rather than repeated per blend. Three
 * photographs cover four pieces: the saucer is shot beside the strainer it
 * belongs under.
 */
const PIECES: Slide[] = [
  {
    src: "/images/accessories/tea-strainer.jpg",
    alt: "A gold tea strainer beside its saucer on dark green velvet",
  },
  {
    src: "/images/accessories/tea-spoon.jpg",
    alt: "A gold tea spoon with a patterned handle on dark green velvet",
  },
  {
    src: "/images/accessories/infuser-ball.jpg",
    alt: "A gold mesh infuser ball on its chain, beside a lidded rest, on dark green velvet",
  },
];

/** The boxed set photographed with each blend's own tin. */
const BOXES: Record<string, Slide> = {
  "rose-vitalitea": {
    src: "/images/accessories/full-set-rose-vitalitea.jpg",
    alt: "The open box with the pink Rose VitaliTea tin, a strainer, a saucer, a spoon and an infuser ball in a fitted tray",
  },
  "lavender-lullaby": {
    src: "/images/accessories/full-set-lavender-lullaby.jpg",
    alt: "The open box with the violet Lavender Lullaby tin, a strainer, a saucer, a spoon and an infuser ball in a fitted tray",
  },
  "peach-me-green": {
    src: "/images/accessories/full-set-peach-me-green.jpg",
    alt: "The open box with the coral Peach Me Green tin, a strainer, a saucer, a spoon and an infuser ball in a fitted tray",
  },
  "coco-breeze": {
    src: "/images/accessories/full-set-coco-breeze.jpg",
    alt: "The open box with the dark brown Coco Breeze tin, a strainer, a saucer, a spoon and an infuser ball in a fitted tray",
  },
  "classic-thyme": {
    src: "/images/accessories/full-set-classic-thyme.jpg",
    alt: "The open box with the oxblood Classic Thyme tin, a strainer, a saucer, a spoon and an infuser ball in a fitted tray",
  },
};

/**
 * Slides for a blend's boxed set: its own box first, then the three pieces.
 * These photographs are ours, like the brew stills, so they live here rather
 * than being read back from Shopify — the Storefront query asks only for a
 * featured image.
 */
export function fullSetSlides(blendSlug: string): Slide[] {
  const box = BOXES[blendSlug];
  return box ? [box, ...PIECES] : [];
}

/** What the customer is being sold, in plain words. */
export const FULL_SET_CONTENTS =
  "The tea, a strainer, a saucer, a spoon and an infuser ball, in the box.";

/**
 * Shown whichever option is selected, not only once the set is chosen: it is
 * meant to reach someone still deciding, and a recommendation that appears
 * only after you have already switched has nothing left to recommend.
 */
export const FULL_SET_RECOMMENDATION =
  "If this is your first time with us, the full set is where we would start.";

/**
 * The owner's prices, from the Full Set table in content form three. Shopify
 * is the source of truth once the sets are Active; these exist only so the
 * page can be looked at on a dev server before that happens, and are never
 * read in production. If the two ever disagree, Shopify is right.
 */
const PREVIEW_PRICE_CENTS: Record<string, number> = {
  "rose-vitalitea": 7083,
  "peach-me-green": 7157,
  "classic-thyme": 7490,
  "coco-breeze": 7717,
  "lavender-lullaby": 8001,
};

/**
 * Stand-in records for a dev server, so the boxed-set control can be reviewed
 * before the products go Active in Shopify. `getFullSets` reaches for these
 * only when Shopify returned no sets AND this is a development build.
 *
 * Deliberately carries no `variantId`: nothing here can reach a real cart, so
 * the button reads "Unavailable" rather than pretending to sell a product that
 * does not exist yet. That is the tell that you are looking at a preview.
 */
export function previewFullSets<T extends { title: string; slug: string }>(
  blends: T[]
): T[] {
  return blends
    .filter((blend) => blend.slug in PREVIEW_PRICE_CENTS)
    .map((blend) => ({
      ...blend,
      _id: `preview-full-set-${blend.slug}`,
      title: fullSetTitleFor(blend.title),
      slug: `${blend.slug}-full-set`,
      priceCents: PREVIEW_PRICE_CENTS[blend.slug],
      variantId: undefined,
      availableForSale: true,
    }));
}
