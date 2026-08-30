import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';

// vi.mock is hoisted above ordinary consts, so the spy has to be hoisted too.
const { listLineItems } = vi.hoisted(() => ({ listLineItems: vi.fn() }));
vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { listLineItems } } },
}));

import {
  buildOrderMetadata,
  resolveOrderItems,
  STRIPE_METADATA_VALUE_LIMIT,
} from '@/lib/orders';

const session = (metadata?: Record<string, string>) =>
  ({ id: 'cs_test_1', metadata }) as unknown as Stripe.Checkout.Session;

describe('buildOrderMetadata', () => {
  it('round-trips a small order unchanged', () => {
    const items = [{ name: 'Rose VitaliTea', qty: 2, unit: 1800 }];
    expect(JSON.parse(buildOrderMetadata(items))).toEqual(items);
  });

  it('never exceeds the Stripe metadata limit, however large the cart', () => {
    for (const count of [1, 10, 25, 100]) {
      const items = Array.from({ length: count }, (_, i) => ({
        name: `A very long blend name number ${i} for padding`,
        qty: 3,
        unit: 1800,
      }));
      expect(buildOrderMetadata(items).length).toBeLessThanOrEqual(
        STRIPE_METADATA_VALUE_LIMIT
      );
    }
  });

  it('truncates from the end, keeping the earliest items', () => {
    const items = Array.from({ length: 40 }, (_, i) => ({
      name: `Blend ${i}`, qty: 1, unit: 1000,
    }));
    const parsed = JSON.parse(buildOrderMetadata(items));
    expect(parsed.length).toBeLessThan(40);
    expect(parsed[0].name).toBe('Blend 0');
  });

  it('caps absurdly long single names rather than overflowing', () => {
    const meta = buildOrderMetadata([{ name: 'x'.repeat(400), qty: 1, unit: 1 }]);
    expect(meta.length).toBeLessThanOrEqual(STRIPE_METADATA_VALUE_LIMIT);
  });

  it('emits valid JSON even in the degenerate case', () => {
    expect(() => JSON.parse(buildOrderMetadata([]))).not.toThrow();
  });
});

describe('resolveOrderItems', () => {
  beforeEach(() => {
    listLineItems.mockReset();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('prefers Stripe line items over metadata', async () => {
    listLineItems.mockResolvedValue({
      data: [{ description: 'Rose VitaliTea', quantity: 2, price: { unit_amount: 1800 } }],
    });
    const items = await resolveOrderItems(
      session({ orderItems: JSON.stringify([{ name: 'STALE', qty: 9, unit: 1 }]) })
    );
    expect(items).toEqual([{ name: 'Rose VitaliTea', qty: 2, unit: 1800 }]);
  });

  it('returns every line item, past the old 500-char metadata ceiling', async () => {
    listLineItems.mockResolvedValue({
      data: Array.from({ length: 40 }, (_, i) => ({
        description: `Blend ${i}`, quantity: 1, price: { unit_amount: 1000 },
      })),
    });
    expect(await resolveOrderItems(session())).toHaveLength(40);
  });

  it('falls back to metadata when the Stripe call fails', async () => {
    listLineItems.mockRejectedValue(new Error('network'));
    const items = await resolveOrderItems(
      session({ orderItems: JSON.stringify([{ name: 'Rose', qty: 1, unit: 1800 }]) })
    );
    expect(items).toEqual([{ name: 'Rose', qty: 1, unit: 1800 }]);
  });

  it('falls back when Stripe returns no lines', async () => {
    listLineItems.mockResolvedValue({ data: [] });
    const items = await resolveOrderItems(
      session({ orderItems: JSON.stringify([{ name: 'Mint', qty: 1, unit: 1650 }]) })
    );
    expect(items).toEqual([{ name: 'Mint', qty: 1, unit: 1650 }]);
  });

  it('returns an empty list rather than throwing on corrupt metadata', async () => {
    listLineItems.mockRejectedValue(new Error('network'));
    expect(await resolveOrderItems(session({ orderItems: '{not json' }))).toEqual([]);
  });

  it('tolerates missing quantity and price on a line', async () => {
    listLineItems.mockResolvedValue({ data: [{ description: null }] });
    expect(await resolveOrderItems(session())).toEqual([{ name: 'Item', qty: 1, unit: 0 }]);
  });
});
