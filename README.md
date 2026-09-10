# Infuse & Muse Starter

Production-minded starter for **Infuse & Muse**, a boutique tea business in **Mississauga, Canada**.

## Phase 1: brief assumptions

- Infuse & Muse launches as a premium small-batch tea brand serving Mississauga and the GTA.
- The business needs a CMS-first workflow rather than a code-first product catalog.
- Shopify (headless, via the Storefront API) owns products, inventory, cart, checkout, shipping and tax. See `docs/SHOPIFY.md`.
- Sanity is retained because it is flexible, editor-friendly, and pairs well with Next.js on Vercel.

## Phase 2: final stack choice

- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **Commerce:** Shopify Storefront API (products, cart, hosted checkout)
- **CMS/backend:** Sanity Studio
- **Hosting:** Vercel
- **Local content fallback:** built-in demo data so the storefront is populated before CMS setup

## Phase 3: architecture

```
infuse-and-muse/
├── apps/
│   ├── web/      # Next.js storefront
│   └── studio/   # Sanity CMS
├── docs/         # asset usage notes
├── .env.example
└── README.md
```

## What is included

- **Storefront:** Next.js 14 + TypeScript + Tailwind CSS
- **CMS:** Sanity Studio
- **Commerce:** Shopify Storefront API client (`apps/web/lib/shopify.ts`), cart proxy (`app/api/cart`), hosted Shopify checkout
- **Hosting target:** Vercel
- **Demo content:** included in the storefront, so the UI looks populated immediately
- **CMS schemas:** products, categories, homepage, FAQ, announcements, site settings

## Assumptions

- Infuse & Muse is a local premium tea brand serving Mississauga / GTA customers.
- Shopify handles payment, shipping rates, GST/HST and order records; the site never touches card data.
- Sanity is used because the owner needs flexible editing for blends, homepage sections, FAQs, featured products, and announcements without engineering help.
- The first six uploaded images are approved production assets. TikTok screenshots are reference-only and are not included in the live project.
- The sixth approved tea image was assigned the demo starter name **Minted Stillness** because no product name was supplied for it.

## Approved production images used

- `logo-hero.png`
- `rose-vitalitea.png`
- `peach-me-green.png`
- `lavender-lullaby.png`
- `coco-breeze.png`
- `minted-stillness.png`

## Reference-only images excluded from production

The TikTok screenshots were used for inspiration only and are not included in the site build.

## Local setup

```bash
npm install
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
npm run dev:web
npm run dev:studio
```

Storefront: `http://localhost:3000`
Studio: `http://localhost:3333`

The storefront works immediately with included demo content even before Sanity is connected.

## Shopify local testing

Put the store domain and a Storefront API token in `apps/web/.env.local`
(see `.env.example`). Products, the bag and the Checkout button then run
against the real store; complete a test order with Shopify's Bogus Gateway
or Shopify Payments test mode. Without those variables the site shows local
demo content and nothing can be added to the bag.


## Phase 4: implementation notes

- Products, categories, homepage content, FAQ, announcement, and site settings are modeled in Sanity.
- The storefront reads products from Shopify when configured, then Sanity, and falls back to local demo content when env vars are absent.
- Product detail pages, collection routes, robots, sitemap, metadata, and schema markup are included.
- The bag is a Shopify cart (`apps/web/lib/shopify-cart.ts`, proxied by `app/api/cart/route.ts`); Checkout sends the customer to Shopify's hosted checkout.

## Phase 5: local run instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Copy environment files

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
```

### 3) Run the storefront

```bash
npm run dev:web
```

### 4) Run the CMS

In a second terminal:

```bash
npm run dev:studio
```

### 5) Optional: seed Sanity base content

After creating a Sanity project and adding valid tokens:

```bash
npm --workspace apps/studio run seed
```

### 6) Test checkout locally

With the Shopify variables set, add a blend to the bag and press Checkout; the
order completes on Shopify and appears under Orders in the admin.

The storefront is available at `http://localhost:3000` and the CMS is available at `http://localhost:3333`.

## Important note on validation

This handoff includes a complete runnable starter repo, but dependency installation and full runtime verification were not executed inside this container because external package downloads are unavailable here. The codebase is structured to be run locally after `npm install`.
