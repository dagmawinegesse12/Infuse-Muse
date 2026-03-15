import { sanityClient, sanityEnabled } from "./sanity";
import {
  demoCategories,
  demoFaqs,
  demoHomepage,
  demoProducts,
  demoSiteSettings,
} from "./demo-data";
import type {
  Category,
  FAQItem,
  HomepageContent,
  Product,
  SiteSettings,
} from "./types";

const productProjection = `
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  description,
  "image": image.asset->url,
  "alt": coalesce(image.alt, title),
  priceCents,
  currency,
  featured,
  seasonal,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  tastingNotes,
  ingredients,
  caffeineLevel,
  seoTitle,
  seoDescription
`;

export async function getProducts(): Promise<Product[]> {
  if (!sanityEnabled || !sanityClient) return demoProducts;

  try {
    const products = await sanityClient.fetch<Product[]>(
      `*[_type == "product"] | order(featured desc, title asc){${productProjection}}`
    );

    if (!products || products.length === 0) return demoProducts;

    return products.map((product) => {
      const fallback = demoProducts.find((p) => p.slug === product.slug);

      return {
        ...product,
        image:
          product.image ||
          fallback?.image ||
          "/images/products/rose-vitalitea.png",
        alt: product.alt || fallback?.alt || product.title,
      };
    });
  } catch {
    return demoProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const fallback = demoProducts.find((product) => product.slug === slug) ?? null;

  if (!sanityEnabled || !sanityClient) return fallback;

  try {
    const product = await sanityClient.fetch<Product | null>(
      `*[_type == "product" && slug.current == $slug][0]{${productProjection}}`,
      { slug }
    );

    if (!product) return fallback;

    return {
      ...product,
      image: product.image || fallback?.image || "/images/products/rose-vitalitea.png",
      alt: product.alt || fallback?.alt || product.title,
    };
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!sanityEnabled || !sanityClient) return demoCategories;

  try {
    const categories = await sanityClient.fetch<Category[]>(
      `*[_type == "category"] | order(title asc){
        _id,
        title,
        "slug": slug.current,
        description
      }`
    );

    return categories && categories.length > 0 ? categories : demoCategories;
  } catch {
    return demoCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const fallback = demoCategories.find((category) => category.slug === slug) ?? null;

  if (!sanityEnabled || !sanityClient) return fallback;

  try {
    const category = await sanityClient.fetch<Category | null>(
      `*[_type == "category" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        description
      }`,
      { slug }
    );

    return category || fallback;
  } catch {
    return fallback;
  }
}

export async function getHomepage(): Promise<HomepageContent> {
  if (!sanityEnabled || !sanityClient) return demoHomepage;

  try {
    const homepage = await sanityClient.fetch<HomepageContent | null>(
      `*[_type == "homepage"][0]{
        eyebrow,
        headline,
        subheadline,
        ctaPrimary,
        ctaSecondary,
        featuredSlugs,
        seasonalSlugs,
        announcement
      }`
    );

    if (!homepage) return demoHomepage;

    return {
      ...demoHomepage,
      ...homepage,
      featuredSlugs:
        homepage.featuredSlugs?.length ? homepage.featuredSlugs : demoHomepage.featuredSlugs,
      seasonalSlugs:
        homepage.seasonalSlugs?.length ? homepage.seasonalSlugs : demoHomepage.seasonalSlugs,
    };
  } catch {
    return demoHomepage;
  }
}

export async function getFaqs(): Promise<FAQItem[]> {
  if (!sanityEnabled || !sanityClient) return demoFaqs;

  try {
    const faqs = await sanityClient.fetch<FAQItem[]>(
      `*[_type == "faq"] | order(orderRank asc, question asc){
        _id,
        question,
        answer
      }`
    );

    return faqs && faqs.length > 0 ? faqs : demoFaqs;
  } catch {
    return demoFaqs;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!sanityEnabled || !sanityClient) return demoSiteSettings;

  try {
    const settings = await sanityClient.fetch<Partial<SiteSettings> | null>(
      `*[_type == "siteSettings"][0]{
        businessName,
        tagline,
        city,
        region,
        country,
        address,
        email,
        phone,
        instagramUrl
      }`
    );

    if (!settings) return demoSiteSettings;

    return {
      ...demoSiteSettings,
      ...settings,
    };
  } catch {
    return demoSiteSettings;
  }
}