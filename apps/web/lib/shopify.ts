import type { Product } from "./types";

/**
 * Shopify Storefront API — read-only product layer.
 *
 * The store is the owner's; the tokens come from the Headless sales channel
 * (Sales channels → Headless → My Store Headless → Storefront API). Server-side
 * we prefer the private token; the public one works too and is what the cart
 * will use client-side once it moves to Shopify's Cart API.
 *
 * The Storefront API only returns products that are **Active** and published
 * to the Headless channel. Drafts are invisible here by design.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-04";

export const shopifyEnabled = Boolean(domain && (privateToken || publicToken));

/** Seconds a product read is cached before Next refetches it. */
const REVALIDATE_SECONDS = 60;

/**
 * Product reads are cached and tagged so a Shopify webhook can purge them
 * (see app/api/revalidate). Cart calls must never be cached: pass
 * `{ cache: "no-store" }`.
 */
export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { cache?: "no-store" } = {}
): Promise<T> {
  if (!shopifyEnabled) throw new Error("Shopify is not configured.");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (privateToken) headers["Shopify-Storefront-Private-Token"] = privateToken;
  else headers["X-Shopify-Storefront-Access-Token"] = publicToken as string;

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(options.cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate: REVALIDATE_SECONDS, tags: ["shopify"] } }),
  });

  if (!res.ok) throw new Error(`Shopify responded ${res.status}.`);

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Shopify returned no data.");
  return json.data;
}

// Keys match the `custom.*` product metafield definitions in the owner's store.
const METAFIELD_KEYS = [
  "short_description",
  "tasting_notes",
  "ingredients",
  "caffeine_level",
  "brew_temperature",
  "brew_time",
  "brew_amount",
  "allergens",
] as const;

type MetafieldKey = (typeof METAFIELD_KEYS)[number];

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  featuredImage { url altText }
  seo { title description }
  collections(first: 10) { nodes { handle title } }
  variants(first: 1) {
    nodes {
      id
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
    }
  }
  metafields(identifiers: [${METAFIELD_KEYS.map(
    (key) => `{ namespace: "custom", key: "${key}" }`
  ).join(", ")}]) { key value }
`;

export type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  seo: { title: string | null; description: string | null };
  collections: { nodes: { handle: string; title: string }[] };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
  /** Same order as the identifiers; null where the product has no value. */
  metafields: ({ key: string; value: string } | null)[];
};

const CAFFEINE_LEVELS: Product["caffeineLevel"][] = ["Low", "Medium", "High", "Herbal"];

/** List metafields arrive as a JSON-encoded string array. */
function parseList(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Shopify product → site Product.
 *
 * `fallback` is the local record with the same handle. Shopify has no photos
 * yet and no notion of featured/seasonal, so those come from the fallback until
 * the owner supplies them in the store.
 */
export function mapShopifyProduct(node: ShopifyProductNode, fallback?: Product | null): Product {
  const fields = new Map<MetafieldKey, string>();
  for (const field of node.metafields) {
    if (field) fields.set(field.key as MetafieldKey, field.value);
  }

  const variant = node.variants.nodes[0];
  const size = variant?.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value;
  const collection =
    node.collections.nodes.find((c) => c.handle.startsWith("the-")) ?? node.collections.nodes[0];
  const caffeine = fields.get("caffeine_level") as Product["caffeineLevel"] | undefined;
  // Launch workflow: a blend with our own pair of photos (one per theme)
  // keeps it even once the owner uploads photos in Shopify — those serve
  // checkout, order emails and the admin. A Shopify photo shows on the site
  // only for products without a local pair, such as accessories.
  const ownPair = Boolean(fallback?.imageLight);

  return {
    _id: node.id,
    title: node.title,
    slug: node.handle,
    shortDescription: fields.get("short_description") || fallback?.shortDescription || "",
    description: node.description || fallback?.description || "",
    image:
      (ownPair ? fallback?.image : node.featuredImage?.url) ||
      fallback?.image ||
      "/images/products/rose-vitalitea-emerald.jpg",
    imageLight: ownPair ? fallback?.imageLight : undefined,
    // The extra gallery photographs are ours, like the pair, so they travel
    // with it: a Shopify-backed page keeps them rather than dropping to a
    // single shot.
    gallery: ownPair ? fallback?.gallery : undefined,
    alt: (ownPair ? fallback?.alt : node.featuredImage?.altText) || fallback?.alt || node.title,
    priceCents: variant ? Math.round(Number(variant.price.amount) * 100) : fallback?.priceCents ?? 0,
    currency: variant?.price.currencyCode || fallback?.currency || "CAD",
    variantId: variant?.id,
    availableForSale: variant?.availableForSale,
    size: size || fallback?.size || "",
    brewing: {
      temperature: fields.get("brew_temperature") || fallback?.brewing.temperature || "",
      time: fields.get("brew_time") || fallback?.brewing.time || "",
      amount: fields.get("brew_amount") || fallback?.brewing.amount || "",
    },
    // Never fall back for allergens: an empty value renders "not yet confirmed".
    allergens: fields.get("allergens") || "",
    featured: fallback?.featured ?? false,
    seasonal: fallback?.seasonal ?? false,
    categorySlug: collection?.handle || fallback?.categorySlug || "",
    categoryTitle: collection?.title || fallback?.categoryTitle || "",
    tastingNotes: parseList(fields.get("tasting_notes")),
    ingredients: parseList(fields.get("ingredients")),
    caffeineLevel:
      caffeine && CAFFEINE_LEVELS.includes(caffeine) ? caffeine : fallback?.caffeineLevel ?? "Herbal",
    seoTitle: node.seo.title || fallback?.seoTitle,
    seoDescription: node.seo.description || fallback?.seoDescription,
  };
}

export async function fetchShopifyProducts(): Promise<ShopifyProductNode[]> {
  const data = await storefrontFetch<{ products: { nodes: ShopifyProductNode[] } }>(
    `query Products { products(first: 100) { nodes { ${PRODUCT_FIELDS} } } }`
  );
  return data.products.nodes;
}

export async function fetchShopifyProduct(handle: string): Promise<ShopifyProductNode | null> {
  const data = await storefrontFetch<{ product: ShopifyProductNode | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle }
  );
  return data.product;
}
