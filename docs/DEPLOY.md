# Publishing the owner demo

The production site (`infuseandmuse.com`) is already live and gated to
`/waitlist`. The demo must not disturb it. This document is the procedure for
that specific situation — an existing Vercel project, plus a preview branch.

## How the isolation works

Vercel production-deploys **only** the production branch. Every other branch
builds to its own Preview URL, on a `*.vercel.app` hostname, with
`X-Robots-Tag: noindex` set automatically. The custom domain is never involved.

    main                     → production → infuseandmuse.com   (gated)
    demo/storefront-revamp   → preview    → *.vercel.app        (open)

The gate itself is `WAITLIST_MODE` in `middleware.ts`: anything other than the
exact string `off` redirects every route to `/waitlist`. Production leaves it
unset, so production stays gated even if this branch is merged.

## 1. Confirm the production branch (do this first)

**Settings → Git → Production Branch** must read `main`.

If it reads anything else — or if "Automatically expose System Environment
Variables" style branch rules have been changed — stop. Every assumption below
depends on `main` being the only branch that can reach the live domain.

## 2. Add environment variables, scoped to Preview

**Settings → Environment Variables.** For each row below, tick **Preview**
only. Leave Production and Development unchecked.

| Variable | Preview value | Notes |
|---|---|---|
| `WAITLIST_MODE` | `off` | Opens the storefront. **Never tick Production.** |
| `NEXT_PUBLIC_SITE_URL` | the preview URL | canonical links, sitemap, Stripe redirects |
| `STRIPE_SECRET_KEY` | `sk_test_…` | test mode, so demo checkouts cost nothing |
| `RESEND_API_KEY` | `re_…` | contact form and order email |
| `EMAIL_FROM` | `onboarding@resend.dev` | fine for testing |
| `CONTACT_INBOX` | your address | where the contact form delivers |

There is no publishable-key row: checkout creates the session server-side and
redirects to `session.url`, so Stripe.js never runs in the browser and
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is unused.

Leave `RESEND_AUDIENCE_ID` **unset on Preview**. If the preview inherits the
production audience, anyone testing the demo signup writes a real contact into
the live waitlist. With it unset the form returns a handled 503 instead.

Sanity variables can stay empty; the site falls back to `lib/demo-data.ts`,
which is what the demo shows.

The build no longer fails when these are missing — Stripe and Resend clients
construct lazily — but the demo will not function properly without them.

## 3. Redeploy the branch

Environment variables are read at build time, so a deployment made before you
added them will not pick them up.

**Deployments → filter to `demo/storefront-revamp` → ⋯ → Redeploy.**
Leave "Use existing Build Cache" unchecked.

## 4. Give the owner the link

Copy the deployment URL. Then check **Settings → Deployment Protection**:

- *Vercel Authentication = Disabled* → the URL works for anyone.
- *Vercel Authentication = Enabled* (default on Pro) → the owner hits a login
  wall. Either set Preview protection to Disabled, or use the deployment's
  **Share** button to mint a bypass link.

## 5. Node version

**Settings → General → Node.js Version → 22.x.** The repo pins this in
`.nvmrc`. Next 14 will not build on Node 16.

## Optional: Stripe webhook

Only needed if you want order confirmation emails in the demo.

1. Stripe dashboard → add endpoint `https://<preview-url>/api/webhook`
2. Subscribe to `checkout.session.completed`
3. Put the signing secret in `STRIPE_WEBHOOK_SECRET` (Preview only)

Without it, checkout still completes; only the confirmation email is skipped.
The success page reads line items from Stripe directly, so the order summary
still renders.

## Before this ever becomes the real site

- **Font licence.** `ErotiqueAlternateTrial-*.ttf` are trial files: every digit
  glyph is a "TRIAL ONLY / ZETAFONTS.COM" watermark. Nothing currently sets
  numerals in the display face, so nothing renders a watermark today — but the
  family must be licensed or swapped before launch.
- **Muse copy** in `lib/muses.ts` is placeholder text, not brand-approved.
- **Delete `/preview/parchment`**, an internal design comparison. `robots.ts`
  disallows it, but `WAITLIST_MODE=off` makes it reachable.
- **Product content** is demo data until the owner returns the content form.
