import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORDER_NODE = (name: string, email: string) => ({
  id: 'gid://shopify/Order/7246079099120',
  name,
  email,
  cancelledAt: null,
  displayFinancialStatus: 'PAID',
  tags: [],
  billingAddress: { name: 'Jane Doe' },
  lineItems: { nodes: [{ currentQuantity: 2, product: { productType: 'Event ticket' } }] },
});

function stubShopify(handlers: { orders?: unknown[]; tokenStatuses?: number[]; denyCustomer?: boolean }) {
  const calls: string[] = [];
  const statuses = [...(handlers.tokenStatuses ?? [])];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      if (url.endsWith('/oauth/access_token')) {
        calls.push('token');
        return new Response(JSON.stringify({ access_token: 'tok-' + calls.length, expires_in: 86399 }));
      }
      const { query } = JSON.parse(init.body as string);
      calls.push(query.includes('tagsAdd') ? 'tagsAdd' : query.includes('tagsRemove') ? 'tagsRemove' : 'query');
      const status = statuses.shift();
      if (status) return new Response('nope', { status });
      if (handlers.denyCustomer && query.includes('customer {')) {
        calls.push('denied');
        return new Response(
          JSON.stringify({
            data: null,
            errors: [{ message: 'Access denied for customer field. Required access: `read_customers` access scope.' }],
          })
        );
      }
      if (query.includes('tagsAdd') || query.includes('tagsRemove')) {
        return new Response(JSON.stringify({ data: { tagsAdd: { userErrors: [] }, tagsRemove: { userErrors: [] } } }));
      }
      return new Response(
        JSON.stringify({
          data: { orders: { nodes: handlers.orders ?? [], pageInfo: { hasNextPage: false, endCursor: null } } },
        })
      );
    })
  );
  return calls;
}

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'example.myshopify.com');
  vi.stubEnv('SHOPIFY_ADMIN_CLIENT_ID', 'id');
  vi.stubEnv('SHOPIFY_ADMIN_CLIENT_SECRET', 'secret');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Shopify Admin client', () => {
  it('asks for a token once and reuses it', async () => {
    const calls = stubShopify({ orders: [] });
    const { listTicketOrders } = await import('@/lib/shopify-admin');
    await listTicketOrders();
    await listTicketOrders();
    expect(calls.filter((c) => c === 'token')).toHaveLength(1);
  });

  it('gets a fresh token once if Shopify rejects the cached one', async () => {
    const calls = stubShopify({ orders: [], tokenStatuses: [401] });
    const { listTicketOrders } = await import('@/lib/shopify-admin');
    await expect(listTicketOrders()).resolves.toEqual([]);
    expect(calls.filter((c) => c === 'token')).toHaveLength(2);
  });

  it('reports when it is not configured', async () => {
    vi.stubEnv('SHOPIFY_ADMIN_CLIENT_SECRET', '');
    const { adminConfigured, listTicketOrders } = await import('@/lib/shopify-admin');
    expect(adminConfigured()).toBe(false);
    await expect(listTicketOrders()).rejects.toThrow(/not configured/);
  });

  it('finds an order only when the email matches, ignoring case and spaces', async () => {
    stubShopify({ orders: [ORDER_NODE('#1042', 'Jane@Example.com')] });
    const { findTicketOrder } = await import('@/lib/shopify-admin');
    expect(await findTicketOrder('1042', '  jane@example.com ')).toMatchObject({ name: '#1042', total: 2 });
    expect(await findTicketOrder('#1042', 'someone-else@example.com')).toBeNull();
  });

  it('does not match a different order number that merely contains the digits', async () => {
    stubShopify({ orders: [ORDER_NODE('#11042', 'jane@example.com')] });
    const { findTicketOrder } = await import('@/lib/shopify-admin');
    expect(await findTicketOrder('1042', 'jane@example.com')).toBeNull();
  });

  it('keeps tea-only orders out of the guest list', async () => {
    const tea = ORDER_NODE('#1043', 'x@example.com');
    tea.lineItems.nodes[0].product.productType = '';
    stubShopify({ orders: [ORDER_NODE('#1042', 'jane@example.com'), tea] });
    const { listTicketOrders } = await import('@/lib/shopify-admin');
    expect((await listTicketOrders()).map((o) => o.name)).toEqual(['#1042']);
  });

  it('uses the customer email and name for a POS sale, whose order has no email of its own', async () => {
    const pos = {
      ...ORDER_NODE('#1042', ''),
      email: null,
      billingAddress: null,
      customer: { email: 'guest@example.com', displayName: 'Testing Lastname' },
    };
    stubShopify({ orders: [pos] });
    const { findTicketOrder, listTicketOrders } = await import('@/lib/shopify-admin');
    expect((await listTicketOrders())[0]).toMatchObject({ email: 'guest@example.com', holder: 'Testing Lastname' });
    expect(await findTicketOrder('1042', 'guest@example.com')).toMatchObject({ name: '#1042' });
  });

  it('carries on without customer fields if Shopify refuses them, and stops asking', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const calls = stubShopify({ orders: [ORDER_NODE('#1042', 'jane@example.com')], denyCustomer: true });
    const { listTicketOrders } = await import('@/lib/shopify-admin');
    expect((await listTicketOrders()).map((o) => o.email)).toEqual(['jane@example.com']);
    await listTicketOrders();
    expect(calls.filter((c) => c === 'denied')).toHaveLength(1);
    vi.restoreAllMocks();
  });

  it('asks for the customer when it may', async () => {
    let asked = '';
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit) => {
        if (url.endsWith('/oauth/access_token')) return new Response(JSON.stringify({ access_token: 't' }));
        asked = JSON.parse(init.body as string).query;
        return new Response(JSON.stringify({ data: { order: null } }));
      })
    );
    const { fetchTicketOrder } = await import('@/lib/shopify-admin');
    await fetchTicketOrder('7246079099120');
    expect(asked).toContain('customer { email displayName }');
  });

  it('adds and removes the checked-in tag', async () => {
    const calls = stubShopify({});
    const { setAdmitted } = await import('@/lib/shopify-admin');
    await setAdmitted('7246079099120', 2, true);
    await setAdmitted('7246079099120', 2, false);
    expect(calls.filter((c) => c.startsWith('tags'))).toEqual(['tagsAdd', 'tagsRemove']);
  });
});
