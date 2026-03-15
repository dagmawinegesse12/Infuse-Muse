import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
});

if (!process.env.SANITY_STUDIO_PROJECT_ID || !process.env.SANITY_API_WRITE_TOKEN) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const docs = [
  { _id: "siteSettings", _type: "siteSettings", businessName: "Infuse & Muse", tagline: "Redefining Stillness", city: "Mississauga", region: "ON", country: "CA", address: "Mississauga, Ontario, Canada", email: "hello@infuseandmuse.ca", phone: "+1 905-555-0189", instagramUrl: "https://www.tiktok.com/@infuseandmuse" },
  { _id: "homepage", _type: "homepage", eyebrow: "Small-batch tea rituals from Mississauga", headline: "Tea for your soul and your scroll.", subheadline: "Infuse & Muse creates premium blends that feel calming, artistic, and intentional — designed for daily stillness, gifting, and shared moments.", ctaPrimary: "Shop blends", ctaSecondary: "Our story", featuredSlugs: ["rose-vitalitea", "peach-me-green", "lavender-lullaby"], seasonalSlugs: ["lavender-lullaby", "coco-breeze"], announcement: "New seasonal blends available now. Local pickup in Mississauga." },
  { _id: "cat-floral", _type: "category", title: "Floral Blends", slug: { _type: "slug", current: "floral-blends" }, description: "Soft, aromatic blends designed for slow evenings and reflective mornings." },
  { _id: "cat-fruity", _type: "category", title: "Fruity Blends", slug: { _type: "slug", current: "fruity-blends" }, description: "Bright fruit-forward teas with layered sweetness and a clean finish." },
  { _id: "cat-wellness", _type: "category", title: "Wellness Blends", slug: { _type: "slug", current: "wellness-blends" }, description: "Comforting botanical blends for rest, focus, and daily ritual." },
  { _id: "faq-1", _type: "faq", question: "Do you offer local pickup in Mississauga?", answer: "Yes. Local pickup can be arranged in Mississauga.", orderRank: 1 },
  { _id: "faq-2", _type: "faq", question: "Are your teas available for gifting?", answer: "Yes. Infuse & Muse blends are positioned for premium gifting, small occasions, and tea tasting moments.", orderRank: 2 }
];

for (const doc of docs) await client.createOrReplace(doc);
console.log("Seeded base documents. Upload product images manually in Studio, then create product docs using the included schema.");
