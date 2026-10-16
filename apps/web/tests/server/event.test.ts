import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EVENT,
  MAX_TICKETS_PER_ORDER,
  dateLabel,
  googleCalendarUrl,
  mapLinks,
  saleState,
  ticketsInCart,
  timeLabel,
} from '@/lib/event';

describe('event details', () => {
  it('labels the date and time in Toronto time', () => {
    expect(dateLabel()).toBe('Sunday, November 15, 2026');
    expect(timeLabel()).toBe('4 pm to 8 pm');
  });

  it('starts at 21:00 UTC, which is 4 pm Toronto standard time', () => {
    expect(EVENT.startsAt.toISOString()).toBe('2026-11-15T21:00:00.000Z');
    expect(EVENT.endsAt.toISOString()).toBe('2026-11-16T01:00:00.000Z');
  });

  it('links to the venue on both map apps', () => {
    const { google, apple } = mapLinks();
    expect(google).toContain('87+Wade+Ave,+Toronto,+ON+M6H+1P5');
    expect(apple).toContain('87+Wade+Ave,+Toronto,+ON+M6H+1P5');
  });

  it('builds a Google Calendar link', () => {
    const url = googleCalendarUrl('https://infuseandmuse.com/events');
    expect(url).toContain('dates=20261115T210000Z%2F20261116T010000Z');
  });
});

describe('saleState', () => {
  const on = { availableForSale: true };
  const before = new Date('2026-11-01T12:00:00-05:00');

  it('is not on sale until the ticket product is live', () => {
    expect(saleState(before, null)).toBe('not-on-sale');
  });

  it('sells while the ticket is available', () => {
    expect(saleState(before, on)).toBe('on-sale');
  });

  it('shows sold out when Shopify says unavailable', () => {
    expect(saleState(before, { availableForSale: false })).toBe('sold-out');
  });

  it('closes sales at 2 pm on the day, even with tickets left', () => {
    expect(saleState(new Date('2026-11-15T13:59:00-05:00'), on)).toBe('on-sale');
    expect(saleState(new Date('2026-11-15T14:00:00-05:00'), on)).toBe('closed');
  });

  it('is over once the event ends', () => {
    expect(saleState(new Date('2026-11-15T20:00:00-05:00'), on)).toBe('past');
    expect(saleState(new Date('2026-11-16T09:00:00-05:00'), null)).toBe('past');
  });
});

describe('ticketsInCart', () => {
  it('counts only the ticket variant', () => {
    const lines = [
      { variantId: 'T', quantity: 2 },
      { variantId: 'X', quantity: 5 },
    ];
    expect(ticketsInCart(lines, 'T')).toBe(2);
    expect(ticketsInCart([], 'T')).toBe(0);
  });
});

describe('POST /api/cart ticket cap', () => {
  const TICKET = 'gid://shopify/ProductVariant/99';
  const TEA = 'gid://shopify/ProductVariant/11';
  const CART = 'gid://shopify/Cart/abc';
  const LINE = 'gid://shopify/CartLine/1';
  const INVITE = 'let-me-in-123';

  const cartWith = (variant: string, quantity: number) => ({
    id: CART,
    checkoutUrl: 'https://example.myshopify.com/cart/c/abc',
    totalQuantity: quantity,
    cost: { subtotalAmount: { amount: '25.00', currencyCode: 'CAD' } },
    discountCodes: [],
    discountAllocations: [],
    lines: {
      nodes: [
        {
          id: LINE,
          quantity,
          discountAllocations: [],
          merchandise: {
            id: variant,
            price: { amount: '25.00', currencyCode: 'CAD' },
            product: { handle: 'tea-gathering-ticket', title: 'Tea Gathering Ticket', featuredImage: null },
          },
        },
      ],
    },
  });

  function fakeShopify(heldTickets: number) {
    const calls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        const { query, variables } = JSON.parse(init.body as string);
        let data: Record<string, unknown>;
        if (query.includes('product(')) {
          data = {
            product: {
              id: 'p',
              handle: 'tea-gathering-ticket',
              title: 'Tea Gathering Ticket',
              description: '',
              productType: 'Event ticket',
              featuredImage: null,
              seo: { title: null, description: null },
              collections: { nodes: [] },
              metafields: [],
              variants: {
                nodes: [
                  {
                    id: TICKET,
                    availableForSale: true,
                    price: { amount: '25.00', currencyCode: 'CAD' },
                    selectedOptions: [],
                  },
                ],
              },
            },
          };
        } else if (query.includes('cartLinesAdd(')) {
          calls.push('cartLinesAdd');
          data = { cartLinesAdd: { cart: cartWith(TICKET, heldTickets + 1), userErrors: [] } };
        } else if (query.includes('cartLinesUpdate(')) {
          calls.push('cartLinesUpdate');
          data = { cartLinesUpdate: { cart: cartWith(TICKET, 6), userErrors: [] } };
        } else if (query.includes('cartCreate(')) {
          calls.push('cartCreate');
          const [line] = variables.lines as { merchandiseId: string; quantity: number }[];
          data = { cartCreate: { cart: cartWith(line.merchandiseId, line.quantity), userErrors: [] } };
        } else {
          data = { cart: cartWith(TICKET, heldTickets) };
        }
        return new Response(JSON.stringify({ data }));
      })
    );
    return calls;
  }

  async function post(body: unknown) {
    const { POST } = await import('@/app/api/cart/route');
    return POST(new Request('http://localhost/api/cart', { method: 'POST', body: JSON.stringify(body) }));
  }

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'example.myshopify.com');
    vi.stubEnv('SHOPIFY_STOREFRONT_PRIVATE_TOKEN', 'test-token');
    vi.stubEnv('EVENT_INVITE_CODE', INVITE);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('allows a first order of exactly the cap', async () => {
    const calls = fakeShopify(0);
    const res = await post({ op: 'add', cartId: null, variantId: TICKET, quantity: MAX_TICKETS_PER_ORDER, invite: INVITE });
    expect(res.status).toBe(200);
    expect(calls).toContain('cartCreate');
  });

  it('refuses a seventh ticket in one add', async () => {
    const calls = fakeShopify(0);
    const res = await post({ op: 'add', cartId: null, variantId: TICKET, quantity: MAX_TICKETS_PER_ORDER + 1, invite: INVITE });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/up to 6 tickets/i);
    expect(calls).toHaveLength(0);
  });

  it('counts tickets already in the bag', async () => {
    const calls = fakeShopify(5);
    const res = await post({ op: 'add', cartId: CART, variantId: TICKET, quantity: 2, invite: INVITE });
    expect(res.status).toBe(400);
    expect(calls).not.toContain('cartLinesAdd');
  });

  it('lets a bag grow up to the cap', async () => {
    const calls = fakeShopify(5);
    const res = await post({ op: 'add', cartId: CART, variantId: TICKET, quantity: 1, invite: INVITE });
    expect(res.status).toBe(200);
    expect(calls).toContain('cartLinesAdd');
  });

  it('refuses raising the ticket line past the cap', async () => {
    const calls = fakeShopify(3);
    const res = await post({ op: 'update', cartId: CART, lineId: LINE, quantity: 7 });
    expect(res.status).toBe(400);
    expect(calls).not.toContain('cartLinesUpdate');
  });

  it('refuses a ticket without the private link code', async () => {
    const calls = fakeShopify(0);
    const none = await post({ op: 'add', cartId: null, variantId: TICKET, quantity: 1 });
    const wrong = await post({ op: 'add', cartId: null, variantId: TICKET, quantity: 1, invite: 'nope' });
    expect(none.status).toBe(403);
    expect(wrong.status).toBe(403);
    expect((await none.json()).error).toMatch(/by request/i);
    expect(calls).toHaveLength(0);
  });

  it('refuses every ticket when no invite code is configured', async () => {
    vi.stubEnv('EVENT_INVITE_CODE', '');
    const calls = fakeShopify(0);
    const res = await post({ op: 'add', cartId: null, variantId: TICKET, quantity: 1, invite: '' });
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it('does not limit other products', async () => {
    const calls = fakeShopify(0);
    const res = await post({ op: 'add', cartId: null, variantId: TEA, quantity: 10 });
    expect(res.status).toBe(200);
    expect(calls).toContain('cartCreate');
  });
});
