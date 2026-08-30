import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createSession = vi.fn();
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: createSession } } }),
}));

const POST = async () => (await import('@/app/api/checkout/route')).POST;
const post = async (body: unknown) =>
  (await POST())(new Request('http://localhost/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }));

const validItem = {
  id: 'p1', slug: 'rose', name: 'Rose VitaliTea',
  image: '/r.png', price: 1800, quantity: 2,
};

describe('POST /api/checkout', () => {
  beforeEach(() => {
    vi.resetModules();
    createSession.mockReset();
    createSession.mockResolvedValue({ url: 'https://checkout.stripe.test/s/123' });
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('returns the Stripe session url on a valid cart', async () => {
    const res = await post({ items: [validItem] });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ url: 'https://checkout.stripe.test/s/123' });
  });

  it('sends price straight through as cents, not dollars', async () => {
    await post({ items: [validItem] });
    const arg = createSession.mock.calls[0][0];
    expect(arg.line_items[0].price_data.unit_amount).toBe(1800);
    expect(arg.line_items[0].quantity).toBe(2);
    expect(arg.line_items[0].price_data.currency).toBe('cad');
  });

  it('passes order items through metadata for the webhook email', async () => {
    await post({ items: [validItem] });
    const meta = JSON.parse(createSession.mock.calls[0][0].metadata.orderItems);
    expect(meta).toEqual([{ name: 'Rose VitaliTea', qty: 2, unit: 1800 }]);
  });

  it('keeps metadata inside Stripe’s 500-character limit for a large cart', async () => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      ...validItem, id: `p${i}`, name: `Blend number ${i}`,
    }));
    await post({ items });
    expect(createSession.mock.calls[0][0].metadata.orderItems.length).toBeLessThanOrEqual(500);
  });

  it('rejects an empty cart', async () => {
    const res = await post({ items: [] });
    expect(res.status).toBe(400);
    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const res = await post('{not json');
    expect(res.status).toBe(400);
  });

  it.each([
    ['a zero price', { ...validItem, price: 0 }],
    ['a negative price', { ...validItem, price: -500 }],
    ['a zero quantity', { ...validItem, quantity: 0 }],
    ['a non-numeric price', { ...validItem, price: '1800' }],
    ['a missing name', { ...validItem, name: undefined }],
  ])('rejects %s', async (_label, item) => {
    const res = await post({ items: [item] });
    expect(res.status).toBe(400);
    expect(createSession).not.toHaveBeenCalled();
  });

  it('fails closed when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const res = await post({ items: [validItem] });
    expect(res.status).toBe(500);
    expect(createSession).not.toHaveBeenCalled();
  });

  it('does not leak Stripe internals to the client on failure', async () => {
    createSession.mockRejectedValue(new Error('card_declined: secret_token_abc'));
    const res = await post({ items: [validItem] });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).not.toContain('secret_token_abc');
  });
});
