import Stripe from 'stripe';

/**
 * Stripe client singleton.
 * STRIPE_SECRET_KEY must be set in .env.local before this module is used.
 * The key is only read at runtime (server-side), never exposed to the browser.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');
