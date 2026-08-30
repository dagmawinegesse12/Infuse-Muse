import Stripe from 'stripe';

/**
 * Lazily-constructed Stripe client.
 *
 * `new Stripe('')` throws "Neither apiKey nor config.authenticator provided",
 * so building the client at module scope makes every route that imports it
 * fail to import when STRIPE_SECRET_KEY is unset. Next.js imports route
 * handlers while collecting page data, so that turns a missing key into a hard
 * `next build` failure — breaking preview deploys, CI, and fresh clones.
 * Constructing on first use keeps the build green and defers the failure to an
 * actual checkout request, where it can be handled and reported.
 *
 * The key is only ever read server-side; it is never exposed to the browser.
 */
let client: Stripe | null = null;

export const stripeEnabled = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  if (!client) client = new Stripe(key);
  return client;
}
