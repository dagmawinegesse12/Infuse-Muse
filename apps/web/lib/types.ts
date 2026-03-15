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
  image: string;
  alt: string;
  priceCents: number;
  currency: string;
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
