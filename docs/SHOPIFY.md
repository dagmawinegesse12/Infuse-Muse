# Shopify Integration — Assessment & Costs

Status: prepared 9 September 2026 for the owner meeting. **Updated 10 September:**
the account exists (Basic, $1/mo until 31 Oct 2026, then $49; card rate
2.8% + $0.30). Metafields, five archetype collections and five products are in
the admin, Active and published to the Headless channel only. The Headless app
is installed and the site reads products through `apps/web/lib/shopify.ts`
(Storefront API, falls back to Sanity then local data). The bag is a Shopify
cart (`lib/shopify-cart.ts` behind `app/api/cart`) and Checkout hands off to
Shopify's hosted checkout; Stripe, the order webhook and our order email are
gone. Still open on the owner's side: Shopify Payments, shipping rates and
tax number, stock counts, photos in Shopify, domain.

## Why this came up

The owner asked to add Shopify. Worth understanding what is actually being
solved, because it is larger than a payment-processor swap.

**The current checkout cannot ship a physical product.**
`app/api/checkout/route.ts` sets `billing_address_collection: 'auto'` and
nothing else — no `shipping_address_collection`, no `shipping_options`, no
`automatic_tax`. A customer can pay and we never learn where to send the tea.

Meanwhile the live copy promises otherwise:

- `app/(site)/shipping-returns/page.tsx` — "Shipping is calculated at checkout, before you pay."
- `app/(site)/terms/page.tsx` — prices "exclude applicable taxes."

Neither is true of the code. Shopify is a good answer to that gap, not a
lateral move.

## Gap analysis

| | Today | With Shopify |
|---|---|---|
| Product content | Sanity + `lib/demo-data.ts` fallback | Shopify, or split (see decision) |
| Price | Single `priceCents`, flat | Per-variant |
| Variants | **None** | Native |
| Inventory | **None — can oversell infinitely** | Tracked, auto-decrement |
| Shipping address | **Never collected** | Collected and rated |
| Shipping rates | **None** | Carrier-calculated or flat |
| GST/HST | **Not charged** | Automatic by province |
| Order records | **Nowhere** — Stripe dashboard + one email | Real order admin |
| Discount codes | None | Native |
| Refunds | Manual in Stripe, site unaware | Native |
| Customer accounts | None | Native |

The bolded rows are what make a launch operationally and legally risky.

## Recommended shape — headless (Storefront API)

Keep the Next.js site exactly as designed. Shopify becomes the commerce
backend behind it: products, inventory, cart, hosted checkout. All brand and
design work survives untouched. Stripe leaves our codebase entirely — Shopify
Payments is Stripe underneath, so nothing is lost commercially.

Rejected alternatives:

- **Buy Button embed** — cheap, destroys the design. Their iframe, their type.
- **Shopify for inventory + keep Stripe** — two sources of truth for price and
  stock. Guarantees drift.
- **Full Shopify theme** — discards the entire custom build.

## The decision the meeting must make

**Who owns product content — Sanity or Shopify?**

Shopify natively owns title, price, images, SKU, inventory, weight. It has no
home for our brand fields (`tastingNotes`, `ingredients`, `caffeineLevel`,
`seoTitle`, plus the archetype pairings in `lib/muses.ts`). Two options:

1. **Shopify owns everything**, narrative fields as Shopify *metafields*. One
   admin, one login. Metafield editing is clunkier than Sanity's studio.
2. **Split** — Shopify owns commerce, Sanity keeps narrative, joined on product
   handle. Better authoring, two logins, and a failure mode where a product
   exists in one and not the other (page renders but cannot sell).

**Recommendation: option 1.** For a five-product catalogue, two admins is real
overhead, and the split failure mode is nasty.

Useful question for the owner: *when a blend sells out at 11pm, where do you
expect to go to mark it sold out?*

## Costs

Figures are the right shape; confirm live against Shopify's Canadian pricing
page. Pricing changes regularly.

### Plan

| Plan | ~CAD/mo (annual) | ~CAD/mo (monthly) | Verdict |
|---|---|---|---|
| Starter | ~$7 | — | No — no real storefront, limited API |
| **Basic** | **~$38** | **~$51** | **Correct tier.** Storefront API included |
| Grow | ~$105 | ~$140 | Only for lower txn rates at volume |
| Advanced | ~$400 | ~$530 | No |
| Plus | ~$3,000+ | — | No |

Annual billing saves ~25% but locks in twelve months. Pay monthly for the first
quarter, then switch once volume is real.

### Transaction fees — the part that surprises people

Shopify Payments Canada: **~2.9% + $0.30 CAD** per online transaction on Basic.

**Stripe Canada charges 2.9% + $0.30 too.** Shopify Payments *is* Stripe
underneath. Switching costs nothing extra per sale.

> The true incremental cost of Shopify over what we have today is the plan fee:
> roughly **$38–51 CAD/month**. That is the whole story.

Trap: using a **third-party gateway instead of Shopify Payments adds ~2% on
Basic**. At $9,000/mo that is $180/mo burned for no benefit. Use Shopify Payments.

### The cost everyone forgets

The site runs on **Vercel Hobby, which is licensed for non-commercial use
only.** The moment this takes real money it needs **Vercel Pro, ~$20 USD/mo**.
Not Shopify's fault, applies to any launch, easy to miss. It also removes the
shareable-link friction documented in `DEPLOY.md`.

### Everything else, recurring

| Service | Cost | Notes |
|---|---|---|
| Vercel Pro | ~$20 USD/mo | Required at launch |
| Sanity | $0 | Free tier ample; **$0 and retired** if Shopify owns content |
| Resend | $0 → $20 USD/mo | Free covers 3,000/mo. Only if we keep the custom order email |
| Domain | ~$20/yr | Already owned |
| Shopify apps | $0–50/mo | Most small stores end with 2–3. Budget, do not commit |
| Stripe | **removed** | No monthly fee today anyway |

### One-time

- **Zetafonts Erotique licence** — the live blocker. Trial fonts render digits
  as "TRIAL ONLY / ZETAFONTS.COM", which lands on every price on the site.
  Likely €100–400 for the three weights, depending on pageview tier. *Needs a
  real quote.*
- **Development** — ~1.5–2 weeks focused, once the Shopify account is ready.
- **Shopify Payments onboarding** — $0, but it is KYC (bank details, ID) and
  takes several business days. Free, but on the critical path. Start first.

### Modelled at three volumes

Assuming ~$45 CAD average order and Basic at ~$51/mo monthly:

| | 50 orders/mo | 200 orders/mo | 500 orders/mo |
|---|---|---|---|
| Revenue | $2,250 | $9,000 | $22,500 |
| Shopify plan | $51 | $51 | $51 |
| Transaction fees | $80 | $321 | $803 |
| Vercel Pro | ~$27 | ~$27 | ~$27 |
| **Total** | **~$158** | **~$399** | **~$881** |
| **% of revenue** | **7.0%** | **4.4%** | **3.9%** |

At ~500 orders it is worth modelling **Grow** — the lower transaction rate
starts to outrun the higher plan fee somewhere in that region.

### One-sentence version for the owner

> Shopify costs about **$50/month more than what we do now** — transaction fees
> are identical because Shopify Payments is Stripe underneath — and in exchange
> we get inventory, shipping rates, tax collection and order records, none of
> which currently exist.

The costs that should actually worry them sit outside Shopify entirely: the
font licence and Vercel Pro.

## Owner prerequisites — before any code changes

### Business and legal

1. Shopify account, plan chosen. Store currency CAD.
2. Legal business name — **`Infuse & Muse Inc.`** per the content form.
3. **CRA Business Number / GST-HST registration.** Shopify cannot charge tax
   correctly without it. **Still blank on the content form** — and the owner's
   prices are all quoted "+ HST", so they intend to charge it. Chase this.
4. Bank account + ID for Shopify Payments (KYC — start early).
5. Countries shipped to. Canada only, or US as well? **Blank on the form.**
6. **Package weights.** Products are 75 g and 100 g net; we need gross packed
   weight per unit for carrier rating. Carrier choice (Canada Post vs flat rate),
   and any free-shipping threshold.
7. Return/refund policy confirmed. **Every policy row on the content form came
   back blank** — see `CONTENT-INTAKE.md`.
8. Final SKUs, per-variant prices, opening stock counts.
9. Checkout on `checkout.infuseandmuse.com` or Shopify's domain.

### In the Shopify admin

10. Create a **custom app** → generate a **Storefront API access token**.
    Scopes: `unauthenticated_read_product_listings`,
    `unauthenticated_read_product_inventory`,
    `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
11. Create products with handles matching our slugs so URLs and SEO survive:
    `rose-vitalitea`, `peach-me-green`, `lavender-lullaby`, `coco-breeze`,
    `classic-thyme`. **Note `minted-stillness` is discontinued and
    `classic-thyme` is new** — see `CONTENT-INTAKE.md`.
12. Define metafields for tasting notes / ingredients / caffeine level /
    brewing guidance / allergens, if Shopify owns product content.
13. Add the developer as a scoped staff member — not owner, not full admin.

### Verify these five live at the meeting

1. Basic tier price in CAD, and that Storefront API is included
2. Shopify Payments Canada rate (the 2.9% + $0.30)
3. Third-party gateway penalty on Basic
4. Whether checkout on their own subdomain needs a higher tier
5. Zetafonts quote for the weights we ship

## What gets deleted when we build

`lib/stripe.ts`, `app/api/checkout/route.ts`, `app/api/webhook/route.ts`,
`lib/orders.ts`, and both Stripe test files. `lib/cart/cart-context.tsx` is
rewritten against Shopify's Cart API. `lib/data.ts` gains a Shopify query layer.

**Trap:** Shopify sends its own order-confirmation email. Ours
(`lib/email/templates/order-confirmation.ts`) is nicer. Decide deliberately
which one sends, or customers get two.

## Effort

~1.5–2 weeks focused, once the account is ready.

| Task | Estimate |
|---|---|
| Storefront API client + product layer replacing `lib/data.ts` | 1–2 days |
| Cart migration to Shopify Cart API | ~2 days |
| Checkout handoff + success/cancel pages | ~0.5 day |
| Content model decision + metafields wiring | 1–2 days |
| Stripe removal + test rewrites | ~1 day |
| QA with real test orders | ~1 day |
