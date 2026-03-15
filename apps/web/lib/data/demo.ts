export type TeaProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  category: string;
  accent: string;
  featured?: boolean;
  seasonal?: boolean;
  benefits: string[];
  ingredients: string[];
};

export const products: TeaProduct[] = [
  {
    id: 'rose-vitalitea',
    slug: 'rose-vitalitea',
    name: 'Rose VitaliTea',
    shortDescription: 'A soft floral blend with a bright, restorative finish.',
    description:
      'Rose VitaliTea layers fragrant petals with green tea for a delicate cup that feels calm, romantic, and quietly energizing.',
    price: 18,
    image: '/images/rose-vitalitea.png',
    category: 'Floral',
    accent: 'from-rose-100/80 to-emerald-50/70',
    featured: true,
    benefits: ['Floral aroma', 'Light caffeine', 'Elegant daily ritual'],
    ingredients: ['Rose petals', 'Green tea', 'Natural botanicals']
  },
  {
    id: 'peach-me-green',
    slug: 'peach-me-green',
    name: 'Peach Me Green',
    shortDescription: 'Juicy peach notes over a crisp green tea body.',
    description:
      'Peach Me Green is bright and refreshing, designed for slow mornings, desk-side sipping, and light afternoon resets.',
    price: 17,
    image: '/images/peach-me-green.png',
    category: 'Green Tea',
    accent: 'from-amber-100/80 to-emerald-50/70',
    featured: true,
    benefits: ['Fresh fruit profile', 'Smooth finish', 'Balanced lift'],
    ingredients: ['Green tea', 'Peach', 'Calendula']
  },
  {
    id: 'lavender-lullaby',
    slug: 'lavender-lullaby',
    name: 'Lavender Lullaby',
    shortDescription: 'A soothing herbal cup crafted for evening calm.',
    description:
      'Lavender Lullaby blends lavender and chamomile into a grounding infusion with a soft botanical finish.',
    price: 19,
    image: '/images/lavender-lullaby.png',
    category: 'Herbal',
    accent: 'from-violet-100/80 to-emerald-50/70',
    featured: true,
    seasonal: true,
    benefits: ['Caffeine free', 'Bedtime ritual', 'Soft herbal sweetness'],
    ingredients: ['Lavender', 'Chamomile', 'Lemon balm']
  },
  {
    id: 'coco-breeze',
    slug: 'coco-breeze',
    name: 'Coco Breeze',
    shortDescription: 'A creamy tropical blend with an airy finish.',
    description:
      'Coco Breeze is a gentle, indulgent blend that feels like a small retreat in the middle of the day.',
    price: 20,
    image: '/images/coco-breeze.png',
    category: 'Signature',
    accent: 'from-stone-100/80 to-emerald-50/70',
    seasonal: true,
    benefits: ['Comforting body', 'Dessert-like aroma', 'Relaxed afternoon sip'],
    ingredients: ['Coconut', 'Black tea', 'Vanilla']
  }
];

export const siteContent = {
  announcement: 'Free local pickup in Mississauga on featured seasonal blends this week.',
  testimonial: {
    quote:
      'Infuse & Muse feels less like buying tea and more like being invited into a beautiful ritual. The blends are thoughtful, calming, and memorable.',
    author: 'Local customer · Mississauga'
  },
  faqs: [
    {
      question: 'Do you offer local pickup in Mississauga?',
      answer:
        'Yes. We support local pickup for select orders and seasonal drops. Pickup details can be added to the site settings and contact page.'
    },
    {
      question: 'Are all teas caffeinated?',
      answer:
        'No. Some signature blends are caffeinated while herbal options like Lavender Lullaby are caffeine free.'
    },
    {
      question: 'Can I buy gifts or curated bundles?',
      answer:
        'The storefront is structured to support gift boxes and seasonal bundles as separate product types or collections.'
    }
  ]
};

export const currency = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD'
});
