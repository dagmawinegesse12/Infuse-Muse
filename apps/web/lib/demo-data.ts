import type { Category, FAQItem, HomepageContent, Product, SiteSettings } from "./types";

export const demoCategories: Category[] = [
  { _id: "cat-floral", title: "Floral Blends", slug: "floral-blends", description: "Soft, aromatic blends designed for slow evenings and reflective mornings." },
  { _id: "cat-fruity", title: "Fruity Blends", slug: "fruity-blends", description: "Bright fruit-forward teas with layered sweetness and a clean finish." },
  { _id: "cat-wellness", title: "Wellness Blends", slug: "wellness-blends", description: "Comforting botanical blends for rest, focus, and daily ritual." }
];

export const demoProducts: Product[] = [
  {
    _id: "prod-rose", title: "Rose VitaliTea", slug: "rose-vitalitea",
    shortDescription: "A romantic floral blend with rose petals and full-bodied black tea.",
    description: "Rose VitaliTea is a fragrant black tea blend layered with rose petals for a luxurious cup that feels both uplifting and intimate. Crafted for slow mornings, gifting, and elegant afternoon rituals.",
    image: "/images/products/rose-vitalitea.png", alt: "Glass cup of rose tea with petals beside a teapot on a dark green background",
    priceCents: 1800, currency: "CAD", featured: true, seasonal: false,
    categorySlug: "floral-blends", categoryTitle: "Floral Blends",
    tastingNotes: ["Rose petal", "Velvety black tea", "Soft floral finish"],
    ingredients: ["Black tea", "Rose petals", "Botanical garnish"], caffeineLevel: "Medium",
    seoTitle: "Rose VitaliTea | Floral Tea Blend in Mississauga",
    seoDescription: "Shop Rose VitaliTea, a premium floral black tea blend from Infuse & Muse in Mississauga."
  },
  {
    _id: "prod-peach", title: "Peach Me Green", slug: "peach-me-green",
    shortDescription: "A green tea blend with peach notes and a bright, juicy finish.",
    description: "Peach Me Green balances crisp green tea with ripe peach character and floral aromatics. It is designed for refreshment and a lighter everyday tea experience.",
    image: "/images/products/peach-me-green.png", alt: "Glass cup of peach green tea with peach slices and loose leaves on a dark green background",
    priceCents: 1700, currency: "CAD", featured: true, seasonal: false,
    categorySlug: "fruity-blends", categoryTitle: "Fruity Blends",
    tastingNotes: ["Ripe peach", "Fresh green tea", "Clean finish"],
    ingredients: ["Green tea", "Peach essence", "Botanical petals"], caffeineLevel: "Medium"
  },
  {
    _id: "prod-lavender", title: "Lavender Lullaby", slug: "lavender-lullaby",
    shortDescription: "A calming evening blend with lavender and floral botanicals.",
    description: "Lavender Lullaby is crafted for stillness. The cup is soft, aromatic, and soothing, making it an ideal bedtime or wind-down ritual tea.",
    image: "/images/products/lavender-lullaby.png", alt: "Blue-toned lavender tea in a glass cup with dried petals on a dark green background",
    priceCents: 1900, currency: "CAD", featured: true, seasonal: true,
    categorySlug: "wellness-blends", categoryTitle: "Wellness Blends",
    tastingNotes: ["Lavender", "Botanical sweetness", "Cooling floral aroma"],
    ingredients: ["Herbal blend", "Lavender", "Dried flowers"], caffeineLevel: "Herbal"
  },
  {
    _id: "prod-coco", title: "Coco Breeze", slug: "coco-breeze",
    shortDescription: "A warm comfort blend with spiced depth and creamy character.",
    description: "Coco Breeze brings together cozy spice, dark tea structure, and dessert-like roundness. It is built for colder weather, gifting, and indulgent tea moments.",
    image: "/images/products/coco-breeze.png", alt: "Spiced tea with cinnamon and herbs in a glass cup beside a teapot",
    priceCents: 2100, currency: "CAD", featured: false, seasonal: true,
    categorySlug: "wellness-blends", categoryTitle: "Wellness Blends",
    tastingNotes: ["Warm spice", "Toasted sweetness", "Rich finish"],
    ingredients: ["Black tea", "Cinnamon", "Botanical herbs"], caffeineLevel: "Medium"
  },
  {
    _id: "prod-minted", title: "Minted Stillness", slug: "minted-stillness",
    shortDescription: "A cooling mint-forward blend designed for clarity and reset.",
    description: "Minted Stillness is a bright and grounding tea with fresh mint character and a clean, smooth finish. It fits perfectly into a mid-day pause or post-meal ritual.",
    image: "/images/products/minted-stillness.png", alt: "Fresh mint tea in a glass cup with mint leaves and teapot on a dark green background",
    priceCents: 1650, currency: "CAD", featured: false, seasonal: false,
    categorySlug: "wellness-blends", categoryTitle: "Wellness Blends",
    tastingNotes: ["Fresh mint", "Gentle sweetness", "Clean finish"],
    ingredients: ["Green tea", "Mint leaves", "Botanical petals"], caffeineLevel: "Low"
  }
];

export const demoHomepage: HomepageContent = {
  eyebrow: "Small-batch tea rituals from Mississauga",
  headline: "Tea for your soul and your scroll.",
  subheadline: "Infuse & Muse creates premium blends that feel calming, artistic, and intentional — designed for daily stillness, gifting, and shared moments.",
  ctaPrimary: "Shop blends",
  ctaSecondary: "Our story",
  featuredSlugs: ["rose-vitalitea", "peach-me-green", "lavender-lullaby"],
  seasonalSlugs: ["lavender-lullaby", "coco-breeze"],
  announcement: "New seasonal blends available now. Local pickup in Mississauga."
};

export const demoFaqs: FAQItem[] = [
  { _id: "faq-1", question: "Do you offer local pickup in Mississauga?", answer: "Yes. Local pickup can be arranged in Mississauga. Add pickup instructions to the homepage banner or checkout notes as your process evolves." },
  { _id: "faq-2", question: "Are your teas available for gifting?", answer: "Yes. Infuse & Muse blends are positioned for premium gifting, small occasions, and tea tasting moments." },
  { _id: "faq-3", question: "How should I store the teas?", answer: "Store tea in a cool, dry place away from direct light and moisture. Airtight storage is best for preserving aroma." },
  { _id: "faq-4", question: "Can seasonal blends be updated easily?", answer: "Yes. Seasonal and featured product flags are modeled in the CMS so the owner can update them without changing code." }
];

export const demoSiteSettings: SiteSettings = {
  businessName: "Infuse & Muse", tagline: "Redefining Stillness", city: "Mississauga", region: "ON", country: "CA",
  address: "Mississauga, Ontario, Canada", email: "hello@infuseandmuse.ca", phone: "+1 905-555-0189", instagramUrl: "https://www.tiktok.com/@infuseandmuse"
};
