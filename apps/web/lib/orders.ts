import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';

export type OrderItem = { name: string; qty: number; unit: number };

/** Stripe rejects any metadata value longer than this. */
export const STRIPE_METADATA_VALUE_LIMIT = 500;

/**
 * Pack an order into a metadata value that is guaranteed to fit.
 *
 * Metadata is only a convenience copy — Stripe's own line items are the source
 * of truth (see resolveOrderItems). A long cart is therefore truncated rather
 * than allowed to overflow the limit, which would make session creation fail
 * and take checkout down entirely.
 */
export function buildOrderMetadata(items: OrderItem[]): string {
  const compact = items.map((i) => ({ name: i.name.slice(0, 60), qty: i.qty, unit: i.unit }));

  let end = compact.length;
  while (end > 0) {
    const candidate = JSON.stringify(compact.slice(0, end));
    if (candidate.length <= STRIPE_METADATA_VALUE_LIMIT) return candidate;
    end -= 1;
  }
  return '[]';
}

/**
 * The authoritative item list for a completed session.
 *
 * Prefers Stripe's line items, which have no length ceiling and reflect what
 * was actually charged. Falls back to the metadata copy only when that call
 * fails, so a confirmation email is still possible.
 */
export async function resolveOrderItems(session: Stripe.Checkout.Session): Promise<OrderItem[]> {
  try {
    const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, { limit: 100 });
    const resolved = lineItems.data.map((line) => ({
      name: line.description ?? 'Item',
      qty: line.quantity ?? 1,
      unit: line.price?.unit_amount ?? 0,
    }));
    if (resolved.length) return resolved;
  } catch (error) {
    console.warn('[orders] Could not list line items for', session.id, error);
  }

  try {
    const raw = session.metadata?.orderItems;
    return raw ? (JSON.parse(raw) as OrderItem[]) : [];
  } catch {
    console.warn('[orders] Could not parse orderItems metadata for', session.id);
    return [];
  }
}
