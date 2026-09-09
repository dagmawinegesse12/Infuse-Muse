# Content Form — Owner Responses, Decoded

Source: `Infuse-and-Muse-Content-Form.docx`, returned 9 September 2026.
Status: **transcribed and analysed. No code changed yet.**

Blank answers mean the placeholder stands. That is the form's stated rule, and
a lot came back blank — including every legal and policy confirmation.

---

## Read this first — three things that block a launch

**1. The launch date is three days away.**
Part I shows `12 September 2026`, and it sits in the *placeholder* column — the
only filled middle cell in that section, so the owner almost certainly typed it
into the wrong box. Taken at face value that is 12 September 2026, three days
from now. Given the state below, that date is not achievable. Confirm what they
actually mean before anything else.

**2. Allergen information is blank for all five products.**
This is a food product. The site currently asserts "Prepared in a kitchen that
also handles nuts, dairy and gluten" and the owner did not confirm it. Several
blends contain cardamom, clove, cacao nibs and vanilla. **Cannot sell without
this.**

**3. No product photography, and one product has no photo at all.**
Every "Photograph file name" is blank, and all of Part H is blank. `Classic
Thyme` is a new product with no image in the repo. `Minted Stillness` is
discontinued, so its photo is now dead weight.

---

## Products — the range has changed

**`Minted Stillness` is gone. `Classic Thyme` is new.**
That changes routing: `minted-stillness` retires, `classic-thyme` is added.
Everything in `lib/demo-data.ts` needs replacing.

| | Rose VitaliTea | Lavender Lullaby | Peach Me Green | Coco Breeze | Classic Thyme |
|---|---|---|---|---|---|
| Slug | `rose-vitalitea` | `lavender-lullaby` | `peach-me-green` | `coco-breeze` | `classic-thyme` **new** |
| Archetype | The Romantic | The Dreamer | The Free Spirit | The Poet | The Old-Soul |
| Price | $25.52 +HST | $33.60 +HST | $28.81 +HST | $29.95 +HST | $33.03 +HST |
| Size | 75 g | 75 g | 75 g | 75 g | 100 g |
| Caffeine | Herbal (none) | Herbal (none) | High | Herbal (none) | High |
| Featured | Yes | Yes | No | No | Yes |
| Seasonal | No | No | No | No | No |
| Allergens | **blank** | **blank** | **blank** | **blank** | **blank** |
| Photo | **blank** | **blank** | **blank** | **blank** | **blank** |

### Price notes

Every price is odd — $25.52, $28.81, $29.95, $33.03, $33.60. These read as
cost-plus calculations rather than chosen shelf prices. Recommend rounding
($26 / $29 / $30 / $33 / $34) unless there is a reason not to. Prices are also
roughly **40–75% above the placeholders**, which changes how the range reads.

All quoted "+ HST", so prices display tax-exclusive and tax is added at
checkout. Normal for Canada, and Shopify handles it — but it depends on the HST
number, which is still blank.

### Caffeine levels changed materially

`Rose VitaliTea` was Medium (black tea); it is now **Herbal (none)** — the
ingredients confirm a rooibos base, no black tea. `Coco Breeze` likewise moved
from Medium to Herbal. `Peach Me Green` is High. The placeholder copy that
describes these as black-tea blends is now wrong.

### Ingredients — supplied for all five

- **Rose VitaliTea** — Rooibos, horsetail herb, rose petals, hibiscus, cardamom, cinnamon, dried apples, vanilla
- **Lavender Lullaby** — Butterfly pea flower, chamomile, lavender buds, rose buds, cardamom, orange peel, clove, vanilla
- **Peach Me Green** — Gyokuro green tea, rose hip, dried apples, calendula petals, cornflower petals (blue), natural peach flavour
- **Coco Breeze** — Dried mint, cacao nibs, orange peel, nettle leaf, calendula petals, saffron threads
- **Classic Thyme** — Earl Grey Creme, clove, cardamom, cinnamon, dried thyme, star anise

### Brewing guidance — supplied, needs a field

The site has no brewing field. Line breaks were lost in the form, so the raw
text runs together; parsed:

| Product | Temperature | Steep | Amount |
|---|---|---|---|
| Rose VitaliTea | 95–100 °C | 4–5 min | 1 tsp / 250 ml |
| Lavender Lullaby | 95–100 °C | 4–5 min | 1 tsp / 250 ml |
| Peach Me Green | 60–70 °C | 4–5 min | 1 tsp / 250 ml |
| Coco Breeze | 95–100 °C | 5–7 min | 1 tsp / 250 ml |
| Classic Thyme | 95–100 °C | 3–4 min | 1 tsp / 250 ml |

### Copy quality

Short and full descriptions are thin — mostly one sentence where the form asked
for 250–400 characters, and several are shorter than the placeholders they
replace. `Lavender Lullaby`'s description opens by restating the name, and
misspells it ("Lallaby"). `Peach Me Green` gives one tasting note where three
were asked for. This needs an editing pass with the owner, not a straight paste.

---

## The big structural change — Collections become Archetypes

Part C (Collections) is marked **"remove"** on every row. Part D redefines the
four artworks:

> "They are the Archetypes. Essentially they are like a category for tea blends.
> Right now there is only one blend belonging to an archetype but there will be
> more in the future."

So the taxonomy changes from **Floral / Fruity / Wellness** to five archetypes,
and the Muses stop being purely editorial — they become the category system.

**Tension to resolve:** the owner also answered "Keep it editorial and keep the
link" when asked whether these pages should be shoppable. So archetypes are
categories, but their pages should not become product listings. Worth one
direct question — this affects `lib/muses.ts`, the `category` schema in
`apps/studio/schemaTypes/category.ts`, and the `/collections` routes.

**There is no artwork for The Old-Soul.** There are four paintings and now five
archetypes. A fifth is needed, or Classic Thyme has an archetype page with no
image.

### Pairings, all changed

| Archetype | Was (our guess) | Now |
|---|---|---|
| The Free Spirit | Peach Me Green | Peach Me Green (unchanged) |
| The Poet | Rose VitaliTea | **Coco Breeze** |
| The Dreamer | Lavender Lullaby | Lavender Lullaby (unchanged) |
| The Romantic *(was "Romance")* | Coco Breeze | **Rose VitaliTea** |
| The Old-Soul **new** | — | Classic Thyme |

Descriptions for all five are supplied and are strong — genuinely good writing,
noticeably better than the placeholders. Light proofing needed (a stray `/` in
The Dreamer, "conversion" for "conversation" in The Free Spirit, a missing full
stop or two). Artist credit: **"Remove"** — no crediting anywhere.

---

## Home page — roughly half of it is being removed

| Section | Answer |
|---|---|
| A1 Opening screen | Eyebrow **"Remove for now"**. Second button → **"The Archetypes"**. Title and first button left blank, so `Redefining Stillness` / `THE BLENDS` stand |
| A2 Opening statement | **Rewritten** — see below |
| A3 Featured blends | Heading **"remove"**. Featured trio left blank, but per-product flags now say **Rose VitaliTea, Lavender Lullaby, Classic Thyme** — contradicts the placeholder trio |
| A4 The Muses | Label → **"The Archetypes"**, heading → **"Five archetypes and what they inspire"** |
| A5 Feature panel | **remove** (every row) |
| A6 How to brew | **remove** (every row) |
| A7 Seasonal / limited | **remove** (every row) |
| A8 What you offer | Only **Gift wrapping** survives ("With a written card"). Local pickup, Small batch, Private blending all **remove** |
| A9 Journal | **"Remove (but we will bring it back)"** — keep the code, hide the section |
| A10 Mailing list | Label → **"The Correspondence"**, rest blank |
| A11 Footer | **Rewritten** — see below |

**This guts the page.** Ten sections become roughly five, and A8 drops from four
promises to one, which will look broken in a four-column layout. Flag it: the
home page will feel thin and needs a rethink, not just deletions.

### New copy, verbatim

- **A2 statement** — "Tea is the last unhurried thing left to us. We built a house around it."
- **A2 paragraph** — "Small batch, loose leaf, asking nothing of you but attention. Every blend exists to protect that pause that follows. Luxury, here is time reclaimed."
- **A2 link** — "The Prologue"
- **A11 footer** — "Small batch, loose leaf, blended in Canada. Everything in service of a single luxury: the stillness"
- **A11 location** — "Ontario. Canada"
- **A11 closing** — "Redefining Stillness"

Notes: the footer paragraph **stops mid-sentence** — needs an ending. The A2
paragraph has double spaces and "Luxury, here is time reclaimed" probably wants
a comma after "here". "Every blend exists to protect that pause that follows"
has a dangling "that follows" — reads like an edit left half-finished.

Also: **location changes from "Mississauga · Ontario · Canada" to "Ontario.
Canada"**, and the footer now says "blended in Canada" rather than "in
Mississauga". Combined with pickup being removed, the owner appears to be
deliberately de-emphasising the city. That is a brand decision with reach — it
touches the About page, the FAQ, the contact page and the local SEO in
`seoDescription` fields.

---

## About page — the founder story is the win

Paragraphs 1 and 2 and all three points are **"remove"**. Page title and
introduction left blank, so placeholders stand.

In their place the owner supplied a **long founder story** — mother and
grandmother visiting Toronto from Ethiopia, a slow winter, three to five cups a
day, switching from bags to loose leaf, then adapting blends to her: softening
green tea, hibiscus for fluid retention, goji berries for potassium when she
tired of bananas.

This is the best material in the entire form. It is specific, warm and true, and
it explains the brand better than any placeholder. It should probably drive the
About page and feed the home page too.

Two things to raise: it says **Toronto**, while the business is Mississauga —
consistent with the de-emphasis above, but confirm. And it is long; it needs
structuring into sections rather than dropping in as one block.

---

## FAQ, contact and business details

| Field | Answer |
|---|---|
| Q1 local pickup | **"Not at the moment"** — pickup is off |
| Q4 seasonal blends | **remove** (it was a CMS question, not a customer one) |
| Q2, Q3, Q5, Q6, titles, intro | blank — placeholders stand |
| Contact email | **contact@infuseandmuse.com** (was `hello@`) |
| Legal name | **Infuse & Muse Inc.** — incorporated |
| Instagram | **@infuse_and_muse** — not linked anywhere on the site yet |
| Business address | **blank** |
| Telephone | **blank** |
| HST / Business number | **blank** |
| Pickup arrangements | **remove** |

**Pickup being dropped matters.** It is referenced across
`shipping-returns`, `contact`, the FAQ and several `seoDescription` strings, and
it was a genuine differentiator. All of that copy needs rewriting.

The blank address and HST number both block Shopify setup — see `SHOPIFY.md`.

---

## Policies — every single row came back blank

| Confirmation asked | Answer |
|---|---|
| Dispatch time | blank |
| Delivery, Ontario | blank |
| Delivery, rest of Canada | blank |
| Ship outside Canada? | blank |
| Returns window | blank |
| Who pays return postage | blank |
| Refund processing time | blank |
| **Allergen statement** | **blank** |
| Order record retention | blank |

Under the form's own rule these stand as written — meaning the site ships with
**our invented delivery windows, our invented returns policy and our invented
allergen statement** presented as the company's legal commitments.

That is not acceptable to launch on, and it is also exactly the data Shopify
needs to configure shipping and tax. This is the single biggest blocker after
the allergen question.

---

## Part I — almost entirely blank

Removals, omissions, forbidden words, admired brands and "anything else" are all
empty. Only the misplaced launch date is filled.

---

## What to take into the meeting

**Chase, in priority order:**

1. Allergen information for all five blends — legal blocker
2. Confirmation of all nine policy rows — legal blocker, and Shopify needs it
3. The real launch date
4. HST number and business address — blocks Shopify tax setup
5. Product photography, especially Classic Thyme which has none
6. A fifth artwork for The Old-Soul
7. Gross packed weight per unit — Shopify shipping rates need it, not net grams

**Decisions to get:**

8. Are archetype pages categories, listings, or editorial? The two answers conflict
9. Confirm the featured trio — per-product flags contradict A3
10. Is Mississauga being dropped on purpose? It reaches further than they may realise
11. Round the prices?
12. The home page loses half its sections — what replaces them?

**Ready to use as-is:** the five archetype descriptions, the founder story, the
A2 and A11 copy (after light proofing), ingredients, brewing guidance, sizes,
caffeine levels, the archetype pairings, the new contact email and legal name.

---

## Implementation status — applied 9 September 2026

Everything the form specified has been applied. What could not be applied is
listed below it, with the reason.

**Applied**

- Product range rebuilt: `Minted Stillness` retired, `Classic Thyme` added,
  all five names, prices, sizes, descriptions, tasting notes, ingredients,
  caffeine levels and brewing guidance from the form
- New `size`, `brewing` and `allergens` fields on the product model, the Sanity
  schema and the Sanity projection
- Pack size now shows on the product card and the product page; price is
  labelled "plus HST"
- Brewing guidance and an allergen block added to the product page
- Collections replaced by Archetypes as the taxonomy; `/collections` and
  `/collections/<slug>` now redirect so old links survive
- Five archetypes with the owner's descriptions and revised pairings;
  "Romance" renamed "The Romantic"; The Old-Soul added
- Home page: eyebrow removed, second hero button now "The Archetypes",
  new opening statement and paragraph, featured heading removed, archetype
  label and heading updated, mailing list relabelled "The Correspondence"
- Home sections removed: feature panel, brewing steps, seasonal band, journal
  rail. Their components remain in the tree so any can be restored by import
- Service band rebuilt as a single centred promise (gift wrapping only)
- About page rebuilt around the founder story
- FAQ: pickup answered "Not at the moment", the CMS question removed
- Contact details, footer copy, footer location, closing line, legal name,
  Instagram link
- Local pickup removed everywhere it was advertised, including the order email
- Contact address changed to `contact@infuseandmuse.com` site-wide

**Could not be applied**

| What | Why |
|---|---|
| Allergen declarations | Blank for all five. Cannot be invented for food. The product page states they are unconfirmed and points to contact |
| Policy confirmations | All nine blank. The invented placeholders still stand — unchanged, and still not owner-approved |
| Classic Thyme photograph | None supplied. The retired Minted Stillness image is standing in and shows the wrong blend |
| The Old-Soul artwork | None supplied. That plate renders as a typographic title card instead |
| Business address, HST number, telephone | Blank |
| Home page replacement sections | Four were removed and nothing was offered in their place |

**Judgement calls made**

- The About page keeps its placeholder title and lede, including "Rooted in
  Mississauga", because both were left blank and blank means the placeholder
  stands. It now sits above a founder story set in Toronto. Raise it.
- Deeper Mississauga references (privacy page, product SEO strings) were left
  alone — no replacement address was supplied.
- Prices are exactly as given, unrounded.
- Featured trio follows the per-product flags: Rose VitaliTea, Lavender
  Lullaby, Classic Thyme.
