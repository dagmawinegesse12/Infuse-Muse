# Deploying the owner demo to Vercel

Nothing here has been pushed. These are the steps to run when you are ready.

## 1. Import the repository

This is an npm workspaces monorepo. In Vercel:

- **Root Directory** — leave at the repository root (`vercel.json` builds
  `apps/web` from there). Do *not* set it to `apps/web`; the lockfile lives at
  the root and the install would fail.
- **Framework Preset** — Next.js (detected).
- **Node.js Version** — 22.x. The repo pins this in `.nvmrc`.
  Next 14 refuses to build on Node 16, which is the machine default here.

## 2. Environment variables

Copy from `.env.example`. The demo needs, at minimum:

| Variable | Value for the demo | Why |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | the Vercel URL | canonical links, sitemap, Stripe redirects |
| `WAITLIST_MODE` | `off` | **without this every route redirects to /waitlist and the owner sees nothing but the signup page** |
| `STRIPE_SECRET_KEY` | `sk_test_…` | checkout; use test mode for the demo |
| `RESEND_API_KEY` | `re_…` | waitlist, contact form, order email |
| `EMAIL_FROM` | `onboarding@resend.dev` | fine for testing; a verified domain is needed for real sends |
| `CONTACT_INBOX` | the owner's address | where the contact form delivers |

Sanity variables can stay empty — the site falls back to `lib/demo-data.ts`,
which is what the demo shows today.

## 3. Stripe webhook (only if you want confirmation emails in the demo)

1. Add an endpoint in the Stripe dashboard: `https://<vercel-url>/api/webhook`
2. Subscribe to `checkout.session.completed`
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`

Without it, checkout still works end to end; only the confirmation email is
skipped. The success page reads line items directly from Stripe, so the order
summary still renders.

## 4. Before making the site public

`WAITLIST_MODE=off` exposes everything, including `/preview/parchment` (an
internal design comparison). `robots.ts` already disallows it, but delete the
route before a real launch.

## Known gaps at time of writing

- **Font licence.** `ErotiqueAlternateTrial-*.ttf` are trial files. Every digit
  glyph is a "TRIAL ONLY / ZETAFONTS.COM" watermark. Nothing on the site
  currently sets numerals in the display face, so nothing renders a watermark —
  but the licence must be bought before launch, or the family swapped.
- **Muse copy** in `lib/muses.ts` is placeholder text, not brand-approved.
- **Contact form** needs `RESEND_API_KEY` + `CONTACT_INBOX` or it returns 503
  and tells the visitor to email directly. It never silently drops a message.
