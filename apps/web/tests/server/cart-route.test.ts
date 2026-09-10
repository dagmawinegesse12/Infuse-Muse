import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartNode } from '@/lib/shopify-cart';

const VARIANT = 'gid://shopify/ProductVariant/11';
const CART = 'gid://shopify/Cart/abc';
const LINE = 'gid://shopify/CartLine/1';

const cartNode = (over: Partial<CartNode> = {}): CartNode => ({
  id: CART,
  checkoutUrl: 'https://example.myshopify.com/cart/c/abc',
  totalQuantity: 2,
  cost: { subtotalAmount: { amount: '59.90', currencyCode: 'CAD' } },
  discountCodes: [],
  discountAllocations: [],
  lines: {
    nodes: [
      {
        id: LINE,
        quantity: 2,
        discountAllocations: [],
        merchandise: {
          id: VARIANT,
          price: { amount: '29.95', currencyCode: 'CAD' },
          product: { handle: 'coco-breeze', title: 'Coco Breeze', featuredImage: null },
        },
      },
    ],
  },
  ...over,
});

/** A fake Storefront endpoint that answers by the mutation name in the query. */
function fakeShopify(handlers: Record<string, (vars: Record<string, unknown>) => unknown>) {
  const calls: { field: string; variables: Record<string, unknown> }[] = [];
  const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
    const { query, variables } = JSON.parse(init.body as string);
    const field = Object.keys(handlers).find((name) => query.includes(`${name}(`));
    if (!field) throw new Error(`No handler for query: ${query.slice(0, 60)}`);
    calls.push({ field, variables });
    return new Response(JSON.stringify({ data: { [field]: handlers[field](variables) } }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

async function post(body: unknown) {
  const { POST } = await import('@/app/api/cart/route');
  return POST(new Request('http://localhost/api/cart', { method: 'POST', body: JSON.stringify(body) }));
}

describe('POST /api/cart', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'example.myshopify.com');
    vi.stubEnv('SHOPIFY_STOREFRONT_PRIVATE_TOKEN', 'test-token');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('refuses when the shop is not configured', async () => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', '');
    const res = await post({ op: 'add', variantId: VARIANT, quantity: 1 });
    expect(res.status).toBe(503);
  });

  it('rejects malformed requests before touching Shopify', async () => {
    const calls = fakeShopify({});
    expect((await post({ op: 'add', variantId: 'not-a-gid' })).status).toBe(400);
    expect((await post({ op: 'add', variantId: VARIANT, quantity: 0 })).status).toBe(400);
    expect((await post({ op: 'update', cartId: CART, lineId: LINE, quantity: 1.5 })).status).toBe(400);
    expect((await post({ op: 'nope' })).status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('creates a cart on the first add and maps it to cents', async () => {
    const calls = fakeShopify({ cartCreate: () => ({ cart: cartNode(), userErrors: [] }) });
    const res = await post({ op: 'add', cartId: null, variantId: VARIANT, quantity: 2 });
    const { cart } = await res.json();

    expect(res.status).toBe(200);
    expect(calls[0].field).toBe('cartCreate');
    expect(calls[0].variables).toEqual({ lines: [{ merchandiseId: VARIANT, quantity: 2 }] });
    expect(cart.subtotal).toBe(5990);
    expect(cart.lines[0]).toMatchObject({ id: LINE, price: 2995, quantity: 2, slug: 'coco-breeze' });
    // Shopify has no photo, so the line borrows the site's own image.
    expect(cart.lines[0].image).toBe('/images/products/coco-breeze.jpg');
  });

  it('adds to an existing cart, and starts over if that cart is gone', async () => {
    const calls = fakeShopify({
      cartLinesAdd: () => ({ cart: null, userErrors: [] }),
      cartCreate: () => ({ cart: cartNode(), userErrors: [] }),
    });
    const res = await post({ op: 'add', cartId: CART, variantId: VARIANT, quantity: 1 });

    expect(res.status).toBe(200);
    expect(calls.map((c) => c.field)).toEqual(['cartLinesAdd', 'cartCreate']);
  });

  it('turns a zero quantity into a removal', async () => {
    const calls = fakeShopify({
      cartLinesRemove: () => ({ cart: cartNode({ lines: { nodes: [] } }), userErrors: [] }),
    });
    const res = await post({ op: 'update', cartId: CART, lineId: LINE, quantity: 0 });

    expect(res.status).toBe(200);
    expect(calls[0].field).toBe('cartLinesRemove');
    expect(calls[0].variables).toEqual({ cartId: CART, lineIds: [LINE] });
  });

  it("surfaces Shopify's own words for a user error", async () => {
    fakeShopify({
      cartLinesAdd: () => ({ cart: null, userErrors: [{ message: 'This product is sold out.' }] }),
    });
    const res = await post({ op: 'add', cartId: CART, variantId: VARIANT, quantity: 1 });

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('This product is sold out.');
  });

  it('reports a sold-out variant that Shopify silently dropped', async () => {
    // Observed live: cartCreate with a sold-out variant returns a cart with
    // no lines and no userErrors.
    fakeShopify({ cartCreate: () => ({ cart: cartNode({ lines: { nodes: [] } }), userErrors: [] }) });
    const res = await post({ op: 'add', cartId: null, variantId: VARIANT, quantity: 1 });

    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/sold out/);
  });

  it('applies a code and reports the saving from the line allocations', async () => {
    const discounted = cartNode({
      discountCodes: [{ code: 'INFUSEFAMILY', applicable: true }],
      lines: {
        nodes: [{ ...cartNode().lines.nodes[0], discountAllocations: [{ discountedAmount: { amount: '17.97' } }] }],
      },
    });
    const calls = fakeShopify({ cartDiscountCodesUpdate: () => ({ cart: discounted, userErrors: [] }) });
    const res = await post({ op: 'discount', cartId: CART, code: ' infusefamily ' });
    const { cart } = await res.json();

    expect(res.status).toBe(200);
    expect(calls[0].variables).toEqual({ cartId: CART, discountCodes: ['INFUSEFAMILY'] });
    expect(cart.discountCodes).toEqual([{ code: 'INFUSEFAMILY', applicable: true }]);
    expect(cart.discount).toBe(1797);
    expect(cart.total).toBe(5990 - 1797);
  });

  it('rejects a code Shopify marks inapplicable and clears it again', async () => {
    const calls = fakeShopify({
      cartDiscountCodesUpdate: (vars) => ({
        cart: cartNode({
          discountCodes: (vars.discountCodes as string[]).map((code) => ({ code, applicable: false })),
        }),
        userErrors: [],
      }),
    });
    const res = await post({ op: 'discount', cartId: CART, code: 'NOPE' });

    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/not valid/);
    expect(calls.map((c) => c.variables.discountCodes)).toEqual([['NOPE'], []]);
  });

  it('clears codes when given an empty one, and rejects junk', async () => {
    const calls = fakeShopify({ cartDiscountCodesUpdate: () => ({ cart: cartNode(), userErrors: [] }) });
    expect((await post({ op: 'discount', cartId: CART, code: '' })).status).toBe(200);
    expect(calls[0].variables.discountCodes).toEqual([]);
    expect((await post({ op: 'discount', cartId: CART, code: 'bad code!' })).status).toBe(400);
    expect((await post({ op: 'discount', code: 'X' })).status).toBe(400);
  });

  it('answers null for a cart Shopify no longer has', async () => {
    fakeShopify({ cart: () => null });
    const res = await post({ op: 'get', cartId: CART });
    expect(await res.json()).toEqual({ cart: null });
  });

  it('never caches a cart call', async () => {
    fakeShopify({ cart: () => cartNode() });
    await post({ op: 'get', cartId: CART });
    const init = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(init.cache).toBe('no-store');
  });
});
