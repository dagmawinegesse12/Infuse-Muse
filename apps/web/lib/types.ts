export type Category = {
  _id: string;
  title: string;
  slug: string;
  description: string;
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  /** Photograph for the night theme (the default). */
  image: string;
  /** Same product shot for the light theme. Absent means `image` serves both. */
  imageLight?: string;
  alt: string;
  /**
   * Further photographs, shown after the main shot in the product gallery.
   * Unlike `image`/`imageLight` these are theme-independent: they are stills on
   * a pale ground that read correctly in both themes. Absent or empty means the
   * product has one photograph and the gallery renders without arrows.
   */
  gallery?: { src: string; alt: string }[];
  priceCents: number;
  currency: string;
  /**
   * Shopify variant GID the cart adds. Absent on local fallback data, in
   * which case nothing can be bought and the add controls say so.
   */
  variantId?: string;
  /** False once Shopify reports the variant sold out. Absent means unknown. */
  availableForSale?: boolean;
  /** Net weight as sold, e.g. "75 g". */
  size: string;
  /** Water temperature, steeping time and dose. */
  brewing: { temperature: string; time: string; amount: string };
  /**
   * Allergen declaration. Empty until the owner supplies it — the product page
   * renders a "not yet confirmed" note rather than implying there are none.
   */
  allergens: string;
  featured?: boolean;
  seasonal?: boolean;
  categorySlug: string;
  categoryTitle: string;
  tastingNotes: string[];
  ingredients: string[];
  caffeineLevel: "Low" | "Medium" | "High" | "Herbal";
  seoTitle?: string;
  seoDescription?: string;
};

export type HomepageContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  featuredSlugs: string[];
  seasonalSlugs: string[];
  announcement: string;
};

export type FAQItem = { _id: string; question: string; answer: string; };

export type SiteSettings = {
  businessName: string;
  tagline: string;
  city: string;
  region: string;
  country: string;
  address: string;
  email: string;
  phone: string;
  instagramUrl: string;
};
