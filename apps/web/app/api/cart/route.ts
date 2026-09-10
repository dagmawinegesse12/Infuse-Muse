import { NextResponse } from 'next/server';
import { shopifyEnabled } from '@/lib/shopify';
import {
  CartError,
  addLines,
  createCart,
  getCart,
  removeLines,
  updateDiscountCodes,
  updateLine,
} from '@/lib/shopify-cart';
import type { CartRequest } from '@/lib/cart/cart-types';

/**
 * The browser's only door to the Shopify cart. Keeping it server-side means
 * the Storefront token stays out of the bundle and every response is the
 * cart as Shopify now holds it.
 */

const VARIANT_PREFIX = 'gid://shopify/ProductVariant/';
const CART_PREFIX = 'gid://shopify/Cart/';
const LINE_PREFIX = 'gid://shopify/CartLine/';
const MAX_QUANTITY = 50;
// Shopify codes are letters, digits and a few separators; anything else is noise.
const CODE_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

function parse(body: unknown): CartRequest | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const cartId = typeof b.cartId === 'string' && b.cartId.startsWith(CART_PREFIX) ? b.cartId : null;
  const lineId = typeof b.lineId === 'string' && b.lineId.startsWith(LINE_PREFIX) ? b.lineId : null;
  const quantity =
    typeof b.quantity === 'number' && Number.isInteger(b.quantity) ? b.quantity : null;

  switch (b.op) {
    case 'get':
      return cartId ? { op: 'get', cartId } : null;
    case 'add': {
      const variantId =
        typeof b.variantId === 'string' && b.variantId.startsWith(VARIANT_PREFIX) ? b.variantId : null;
      if (!variantId) return null;
      const qty = quantity ?? 1;
      if (qty < 1 || qty > MAX_QUANTITY) return null;
      return { op: 'add', cartId, variantId, quantity: qty };
    }
    case 'update':
      if (!cartId || !lineId || quantity === null || quantity < 0 || quantity > MAX_QUANTITY) {
        return null;
      }
      return { op: 'update', cartId, lineId, quantity };
    case 'remove':
      return cartId && lineId ? { op: 'remove', cartId, lineId } : null;
    case 'discount': {
      if (!cartId || typeof b.code !== 'string') return null;
      const code = b.code.trim().toUpperCase();
      if (code !== '' && !CODE_PATTERN.test(code)) return null;
      return { op: 'discount', cartId, code };
    }
    default:
      return null;
  }
}

export async function POST(request: Request) {
  if (!shopifyEnabled) {
    return bad('The shop is not connected yet.', 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request body.');
  }

  const req = parse(body);
  if (!req) return bad('Invalid cart request.');

  try {
    switch (req.op) {
      case 'get':
        return NextResponse.json({ cart: await getCart(req.cartId) });
      case 'add': {
        const line = { merchandiseId: req.variantId, quantity: req.quantity };
        // A stored cart can have expired or been checked out; start over then.
        const existing = req.cartId ? await addLines(req.cartId, [line]) : null;
        const cart = existing ?? (await createCart([line]));
        // Shopify drops a sold-out variant without a userError, which would
        // read as a successful add to an unchanged bag. Say what happened.
        if (!cart.lines.some((l) => l.variantId === req.variantId)) {
          return bad('This blend has just sold out.');
        }
        return NextResponse.json({ cart });
      }
      case 'update':
        return NextResponse.json({ cart: await updateLine(req.cartId, req.lineId, req.quantity) });
      case 'remove':
        return NextResponse.json({ cart: await removeLines(req.cartId, [req.lineId]) });
      case 'discount': {
        const cart = await updateDiscountCodes(req.cartId, req.code ? [req.code] : []);
        // Shopify keeps an unknown code on the cart flagged inapplicable.
        // Take it off again and tell the customer, rather than showing a
        // code that does nothing.
        if (cart && req.code && !cart.discountCodes.some((d) => d.applicable)) {
          await updateDiscountCodes(req.cartId, []);
          return bad('That code is not valid for this bag.');
        }
        return NextResponse.json({ cart });
      }
    }
  } catch (error) {
    if (error instanceof CartError) return bad(error.message);
    console.error('[cart] Shopify error:', error);
    return bad('The shop did not respond. Please try again.', 502);
  }
}
