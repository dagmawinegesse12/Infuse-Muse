import { storefrontFetch } from "./shopify";
import { demoProducts } from "./demo-data";
import type { CartItem, CartSnapshot } from "./cart/cart-types";

/**
 * Shopify Cart API. The cart lives in Shopify; we hold only its id in the
 * browser and read prices, totals and the checkout URL back from here.
 * Every call is uncached — a cart is mutable state, not catalogue.
 */

/** Raised for problems Shopify explains (sold out, bad quantity…). Safe to show. */
export class CartError extends Error {}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  discountCodes { code applicable }
  discountAllocations { discountedAmount { amount } }
  lines(first: 50) {
    nodes {
      id
      quantity
      discountAllocations { discountedAmount { amount } }
      merchandise {
        ... on ProductVariant {
          id
          price { amount currencyCode }
          product { handle title featuredImage { url } }
        }
      }
    }
  }
`;

export type CartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  discountCodes: { code: string; applicable: boolean }[];
  discountAllocations: { discountedAmount: { amount: string } }[];
  lines: {
    nodes: {
      id: string;
      quantity: number;
      discountAllocations: { discountedAmount: { amount: string } }[];
      merchandise: {
        id: string;
        price: { amount: string; currencyCode: string };
        product: { handle: string; title: string; featuredImage: { url: string } | null };
      };
    }[];
  };
};

type CartPayload = { cart: CartNode | null; userErrors: { message: string }[] };

const toCents = (amount: string) => Math.round(Number(amount) * 100);

export function mapCart(cart: CartNode): CartSnapshot {
  const lines: CartItem[] = cart.lines.nodes.map((line) => {
    const { merchandise } = line;
    // Shopify has no photos yet, so borrow the site's own image by handle.
    const local = demoProducts.find((p) => p.slug === merchandise.product.handle);
    return {
      id: line.id,
      variantId: merchandise.id,
      slug: merchandise.product.handle,
      name: merchandise.product.title,
      image: merchandise.product.featuredImage?.url || local?.image || "",
      price: toCents(merchandise.price.amount),
      quantity: line.quantity,
    };
  });

  // An order-level code is allocated across the lines; a cart-level one sits
  // on the cart. Summing both gives what the customer actually saves.
  const sumAllocations = (a: { discountedAmount: { amount: string } }[]) =>
    a.reduce((sum, d) => sum + toCents(d.discountedAmount.amount), 0);
  const discount =
    sumAllocations(cart.discountAllocations) +
    cart.lines.nodes.reduce((sum, l) => sum + sumAllocations(l.discountAllocations), 0);
  const subtotal = toCents(cart.cost.subtotalAmount.amount);

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    currency: cart.cost.subtotalAmount.currencyCode,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    discountCodes: cart.discountCodes.map((d) => ({ code: d.code, applicable: d.applicable })),
    lines,
  };
}

/** Runs a cart mutation; null when the cart no longer exists (expired or checked out). */
async function mutate(
  field: string,
  query: string,
  variables: Record<string, unknown>
): Promise<CartSnapshot | null> {
  const data = await storefrontFetch<Record<string, CartPayload>>(query, variables, {
    cache: "no-store",
  });
  const payload = data[field];
  if (payload.userErrors?.length) {
    throw new CartError(payload.userErrors.map((e) => e.message).join(" "));
  }
  return payload.cart ? mapCart(payload.cart) : null;
}

export type LineInput = { merchandiseId: string; quantity: number };

export async function getCart(id: string): Promise<CartSnapshot | null> {
  const data = await storefrontFetch<{ cart: CartNode | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id },
    { cache: "no-store" }
  );
  return data.cart ? mapCart(data.cart) : null;
}

export async function createCart(lines: LineInput[]): Promise<CartSnapshot> {
  const cart = await mutate(
    "cartCreate",
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { lines }
  );
  if (!cart) throw new Error("Shopify returned no cart from cartCreate.");
  return cart;
}

export function addLines(cartId: string, lines: LineInput[]): Promise<CartSnapshot | null> {
  return mutate(
    "cartLinesAdd",
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines }
  );
}

export function updateLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<CartSnapshot | null> {
  if (quantity < 1) return removeLines(cartId, [lineId]);
  return mutate(
    "cartLinesUpdate",
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
}

/**
 * Replaces the cart's discount codes. Pass [] to clear. Shopify does not
 * error on an unknown code; it comes back with `applicable: false`.
 */
export function updateDiscountCodes(cartId: string, codes: string[]): Promise<CartSnapshot | null> {
  return mutate(
    "cartDiscountCodesUpdate",
    `mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart { ${CART_FIELDS} } userErrors { message }
      }
    }`,
    { cartId, discountCodes: codes }
  );
}

export function removeLines(cartId: string, lineIds: string[]): Promise<CartSnapshot | null> {
  return mutate(
    "cartLinesRemove",
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { cartId, lineIds }
  );
}
