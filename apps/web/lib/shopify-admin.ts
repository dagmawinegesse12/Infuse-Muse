import { admitTag, orderGid, toTicketOrder, type AdminOrderNode, type TicketOrder } from './tickets';

/**
 * Shopify Admin API, for the ticket and check-in pages only.
 *
 * The "Opening Pour check-in" app lives in the owner's Dev Dashboard and uses
 * the client-credentials grant: the app's id and secret are exchanged for an
 * access token that lasts about a day. Server-only; none of this reaches the
 * browser. Scopes: read_orders, write_orders, read_products, read_customers.
 */
const API_VERSION = '2026-04';
const EARLIEST_ORDER = '2026-10-01';

let cached: { token: string; expiresAt: number } | null = null;

export function adminConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_ADMIN_CLIENT_ID &&
      process.env.SHOPIFY_ADMIN_CLIENT_SECRET
  );
}

async function accessToken(force = false): Promise<string> {
  if (!force && cached && cached.expiresAt - 5 * 60_000 > Date.now()) return cached.token;

  const res = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SHOPIFY_ADMIN_CLIENT_ID as string,
      client_secret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET as string,
      grant_type: 'client_credentials',
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Shopify token request failed (${res.status}).`);
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error('Shopify returned no access token.');
  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cached.token;
}

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!adminConfigured()) throw new Error('Shopify Admin access is not configured.');

  const call = async (force: boolean) =>
    fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': await accessToken(force),
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

  let res = await call(false);
  // A token can be revoked or rotated: get a fresh one once before giving up.
  if (res.status === 401) res = await call(true);
  if (!res.ok) throw new Error(`Shopify Admin responded ${res.status}.`);

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] | string };
  if (json.errors) {
    throw new Error(Array.isArray(json.errors) ? json.errors.map((e) => e.message).join('; ') : json.errors);
  }
  if (!json.data) throw new Error('Shopify returned no data.');
  return json.data;
}

const BASE_FIELDS = `
  id
  name
  email
  cancelledAt
  displayFinancialStatus
  tags
  billingAddress { name }
  lineItems(first: 50) { nodes { currentQuantity product { productType } } }
`;
// A sale rung up in Shopify POS leaves the order's own email empty and keeps
// the guest's on the customer, which needs read_customers.
const CUSTOMER_FIELDS = `customer { email displayName }`;

/* If Shopify refuses the customer fields (scope missing or withdrawn), drop
   them for the life of this server rather than break every ticket lookup. */
let customerAccess = true;

const customerDenied = (error: unknown) =>
  error instanceof Error && /access denied|read_customers|customer/i.test(error.message);

async function orderQuery<T>(build: (fields: string) => string, variables: Record<string, unknown>): Promise<T> {
  if (customerAccess) {
    try {
      return await adminFetch<T>(build(`${BASE_FIELDS} ${CUSTOMER_FIELDS}`), variables);
    } catch (error) {
      if (!customerDenied(error)) throw error;
      console.error('[shopify-admin] customer fields refused; continuing without them:', error);
      customerAccess = false;
    }
  }
  return adminFetch<T>(build(BASE_FIELDS), variables);
}

export async function fetchTicketOrder(orderId: string): Promise<TicketOrder | null> {
  const data = await orderQuery<{ order: AdminOrderNode | null }>(
    (fields) => `query Order($id: ID!) { order(id: $id) { ${fields} } }`,
    { id: orderGid(orderId) }
  );
  return data.order ? toTicketOrder(data.order) : null;
}

/** "Find my tickets": the order number alone is guessable, so the email must match too. */
export async function findTicketOrder(orderNumber: string, email: string): Promise<TicketOrder | null> {
  const digits = orderNumber.replace(/\D/g, '');
  if (!digits || digits.length > 9) return null;
  const data = await orderQuery<{ orders: { nodes: AdminOrderNode[] } }>(
    (fields) => `query Find($q: String!) { orders(first: 5, query: $q) { nodes { ${fields} } } }`,
    { q: `name:${digits}` }
  );
  const wanted = email.trim().toLowerCase();
  const order = data.orders.nodes
    .filter((n) => n.name === `#${digits}`)
    .map(toTicketOrder)
    .find((o) => o.email?.toLowerCase() === wanted);
  if (!order) return null;
  return order.status === 'none' ? null : order;
}

/** Every order with Opening Pour tickets, newest first, for the door's guest list. */
export async function listTicketOrders(): Promise<TicketOrder[]> {
  const orders: TicketOrder[] = [];
  let after: string | null = null;
  for (let page = 0; page < 5; page++) {
    const data: {
      orders: { nodes: AdminOrderNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
    } = await orderQuery(
      (fields) => `query List($after: String, $q: String!) {
        orders(first: 100, after: $after, sortKey: CREATED_AT, reverse: true, query: $q) {
          nodes { ${fields} }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after, q: `created_at:>=${EARLIEST_ORDER}` }
    );
    for (const node of data.orders.nodes) {
      const order = toTicketOrder(node);
      if (order.status !== 'none') orders.push(order);
    }
    if (!data.orders.pageInfo.hasNextPage) break;
    after = data.orders.pageInfo.endCursor;
  }
  return orders;
}

/** Marks one ticket as let in, or takes it back if `admitted` is false. */
export async function setAdmitted(orderId: string, position: number, admitted: boolean): Promise<void> {
  const mutation = admitted
    ? `mutation Add($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`
    : `mutation Rm($id: ID!, $tags: [String!]!) { tagsRemove(id: $id, tags: $tags) { userErrors { message } } }`;
  const data = await adminFetch<Record<string, { userErrors: { message: string }[] }>>(mutation, {
    id: orderGid(orderId),
    tags: [admitTag(position)],
  });
  const errors = Object.values(data)[0]?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
}

/** Adds one tag to an order. */
export async function addOrderTag(orderId: string, tag: string): Promise<void> {
  const data = await adminFetch<{ tagsAdd: { userErrors: { message: string }[] } }>(
    `mutation Add($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
    { id: orderGid(orderId), tags: [tag] }
  );
  if (data.tagsAdd.userErrors.length) {
    throw new Error(data.tagsAdd.userErrors.map((e) => e.message).join('; '));
  }
}

/** Test hook: forget the cached token. */
export function resetAdminToken() {
  cached = null;
}
