import type { Category, FAQItem, HomepageContent, Product, SiteSettings } from "./types";

/**
 * Content supplied by the owner on the returned content form, 9 September 2026.
 * See docs/CONTENT-INTAKE.md for the full transcription and the open questions.
 *
 * Collections were replaced by Archetypes: the five named works are now the
 * category system rather than a separate Floral / Fruity / Wellness taxonomy.
 */
export const demoCategories: Category[] = [
  { _id: "arch-romantic", title: "The Romantic", slug: "the-romantic", description: "Unhurried devotion. Not the performance of love, but the architecture of it." },
  { _id: "arch-dreamer", title: "The Dreamer", slug: "the-dreamer", description: "The threshold between waking and sleep, kept open on purpose." },
  { _id: "arch-free-spirit", title: "The Free Spirit", slug: "the-free-spirit", description: "Attention with nothing holding it down." },
  { _id: "arch-poet", title: "The Poet", slug: "the-poet", description: "Language as excavation. Reaching past the obvious word for the true one." },
  { _id: "arch-old-soul", title: "The Old-Soul", slug: "the-old-soul", description: "Loyalty extended toward whatever has already proven itself worth keeping." }
];

/**
 * ALLERGENS: the owner left this blank for every blend on the content form.
 * These are food products containing cardamom, clove, cacao and vanilla, so the
 * declaration cannot be guessed. The product page shows an explicit "not yet
 * confirmed" note while these are empty. Do not invent values.
 */
export const demoProducts: Product[] = [
  {
    _id: "prod-rose", title: "Rose VitaliTea", slug: "rose-vitalitea",
    shortDescription: "A romantic floral blend.",
    description: "Rose VitaliTea is a fragrant herbal blend with floral notes, crafted for slow mornings and elegant afternoons.",
    image: "/images/products/rose-vitalitea-emerald.jpg", imageLight: "/images/products/rose-vitalitea-light.jpg",
    alt: "Rose VitaliTea tin, pink with gold foil lettering",
    gallery: [{ src: "/images/products/rose-vitalitea-detail.jpg", alt: "A glass bowl of brewed amber tea beside a bowl of dried pink rose petals on a wooden board, with a gold spoon" }],
    priceCents: 2552, currency: "CAD", size: "75 g",
    brewing: { temperature: "95–100 °C", time: "4–5 minutes", amount: "1 tsp per 250 ml" },
    allergens: "",
    featured: true, seasonal: false,
    categorySlug: "the-romantic", categoryTitle: "The Romantic",
    tastingNotes: ["Soft floral", "Velvety", "Sweet"],
    ingredients: ["Rooibos", "Horsetail herb", "Rose petals", "Hibiscus", "Cardamom", "Cinnamon", "Dried apples", "Vanilla"],
    caffeineLevel: "Herbal",
    seoTitle: "Rose VitaliTea | Floral Herbal Tea Blend",
    seoDescription: "Shop Rose VitaliTea, a caffeine-free rooibos and rose blend from Infuse & Muse."
  },
  {
    _id: "prod-lavender", title: "Lavender Lullaby", slug: "lavender-lullaby",
    shortDescription: "A calming evening blend.",
    description: "An evening blend for winding down the day and waking the imagination.",
    image: "/images/products/lavender-lullaby-emerald.jpg", imageLight: "/images/products/lavender-lullaby-light.jpg",
    alt: "Lavender Lullaby tin, deep violet with gold foil lettering",
    gallery: [{ src: "/images/products/lavender-lullaby-detail.jpg", alt: "A glass bowl of brewed tea, turquoise from butterfly pea flower, beside a bowl of chamomile and rose buds on a wooden board" }],
    priceCents: 3360, currency: "CAD", size: "75 g",
    brewing: { temperature: "95–100 °C", time: "4–5 minutes", amount: "1 tsp per 250 ml" },
    allergens: "",
    featured: true, seasonal: false,
    categorySlug: "the-dreamer", categoryTitle: "The Dreamer",
    tastingNotes: ["Floral", "Honeyed", "Velvety"],
    ingredients: ["Butterfly pea flower", "Chamomile", "Lavender buds", "Rose buds", "Cardamom", "Orange peel", "Clove", "Vanilla"],
    caffeineLevel: "Herbal",
    seoTitle: "Lavender Lullaby | Caffeine-Free Evening Tea",
    seoDescription: "Shop Lavender Lullaby, a caffeine-free evening blend from Infuse & Muse."
  },
  {
    _id: "prod-peach", title: "Peach Me Green", slug: "peach-me-green",
    shortDescription: "A fruity tropical blend.",
    description: "Peach Me Green balances crisp green tea with ripe peach character and floral aromatics.",
    image: "/images/products/peach-me-green-emerald.jpg", imageLight: "/images/products/peach-me-green-light.jpg",
    alt: "Peach Me Green tin, coral orange with gold foil lettering",
    gallery: [{ src: "/images/products/peach-me-green-detail.jpg", alt: "A glass bowl of brewed amber tea beside a bowl of green tea leaves, blue cornflower petals and dried peach on a wooden board" }],
    priceCents: 2881, currency: "CAD", size: "75 g",
    brewing: { temperature: "60–70 °C", time: "4–5 minutes", amount: "1 tsp per 250 ml" },
    allergens: "",
    featured: false, seasonal: false,
    categorySlug: "the-free-spirit", categoryTitle: "The Free Spirit",
    tastingNotes: ["Fruity"],
    ingredients: ["Gyokuro green tea", "Rose hip", "Dried apples", "Calendula petals", "Cornflower petals", "Natural peach flavour"],
    caffeineLevel: "High",
    seoTitle: "Peach Me Green | Peach Green Tea Blend",
    seoDescription: "Shop Peach Me Green, a gyokuro green tea blend with peach from Infuse & Muse."
  },
  {
    _id: "prod-coco", title: "Coco Breeze", slug: "coco-breeze",
    shortDescription: "A cool, cacao-rich blend.",
    description: "Coco Breeze is a mint cacao blend with an earthy undertone.",
    image: "/images/products/coco-breeze-emerald.jpg", imageLight: "/images/products/coco-breeze-light.jpg",
    alt: "Coco Breeze tin, dark espresso brown with gold foil lettering",
    gallery: [{ src: "/images/products/coco-breeze-detail.jpg", alt: "A glass bowl of brewed amber tea beside a bowl of dried mint, cacao nibs and yellow calendula petals on a wooden board" }],
    priceCents: 2995, currency: "CAD", size: "75 g",
    brewing: { temperature: "95–100 °C", time: "5–7 minutes", amount: "1 tsp per 250 ml" },
    allergens: "",
    featured: false, seasonal: false,
    categorySlug: "the-poet", categoryTitle: "The Poet",
    tastingNotes: ["Mint", "Chocolate", "Earthy"],
    ingredients: ["Dried mint", "Cacao nibs", "Orange peel", "Nettle leaf", "Calendula petals", "Saffron threads"],
    caffeineLevel: "Herbal",
    seoTitle: "Coco Breeze | Mint and Cacao Tea Blend",
    seoDescription: "Shop Coco Breeze, a caffeine-free mint and cacao blend from Infuse & Muse."
  },
  {
    // PHOTOGRAPH PENDING — no image was supplied for this new product. The file
    // below is the retired Minted Stillness shot, standing in so the grid and
    // the product page render. It shows the wrong blend. Replace before launch.
    _id: "prod-thyme", title: "Classic Thyme", slug: "classic-thyme",
    shortDescription: "An Earl Grey blend layered with spice and wisdom.",
    description: "Classic Thyme is a rich, creamy Earl Grey, layered with a spice combination used in East Africa for centuries.",
    image: "/images/products/classic-thyme-emerald.jpg", imageLight: "/images/products/classic-thyme-light.jpg",
    alt: "Classic Thyme tin, oxblood red with gold foil lettering",
    priceCents: 3303, currency: "CAD", size: "100 g",
    brewing: { temperature: "95–100 °C", time: "3–4 minutes", amount: "1 tsp per 250 ml" },
    allergens: "",
    featured: true, seasonal: false,
    categorySlug: "the-old-soul", categoryTitle: "The Old-Soul",
    tastingNotes: ["Spiced", "Bergamot", "Velvety"],
    ingredients: ["Earl Grey crème", "Clove", "Cardamom", "Cinnamon", "Dried thyme", "Star anise"],
    caffeineLevel: "High",
    seoTitle: "Classic Thyme | Spiced Earl Grey Blend",
    seoDescription: "Shop Classic Thyme, a spiced Earl Grey crème blend from Infuse & Muse."
  }
];

export const demoHomepage: HomepageContent = {
  eyebrow: "",
  headline: "Redefining Stillness",
  subheadline: "Tea is the last unhurried thing left to us. We built a house around it.",
  ctaPrimary: "The Blends",
  ctaSecondary: "The Archetypes",
  featuredSlugs: ["rose-vitalitea", "lavender-lullaby", "classic-thyme"],
  seasonalSlugs: [],
  announcement: ""
};

export const demoFaqs: FAQItem[] = [
  { _id: "faq-1", question: "Do you offer local pickup?", answer: "Not at the moment. Every order is shipped." },
  { _id: "faq-2", question: "Are your teas available for gifting?", answer: "Yes. Infuse & Muse blends are positioned for premium gifting, small occasions, and tea tasting moments. Gift wrapping is hand-tied and comes with a written card." },
  { _id: "faq-3", question: "How should I store the teas?", answer: "Store tea in a cool, dry place away from direct light and moisture. Airtight storage is best for preserving aroma." }
];

export const demoSiteSettings: SiteSettings = {
  businessName: "Infuse & Muse Inc.", tagline: "Redefining Stillness", city: "", region: "ON", country: "CA",
  // Business address was left blank on the content form; the legal pages need one.
  address: "Ontario, Canada", email: "contact@infuseandmuse.com", phone: "", instagramUrl: "https://www.instagram.com/infuse_and_muse"
};
