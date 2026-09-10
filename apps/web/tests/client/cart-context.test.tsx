import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { CartProvider, useCart } from '@/lib/cart/cart-context';
import type { CartItem, CartRequest, CartSnapshot } from '@/lib/cart/cart-types';

const STORAGE_KEY = 'infuse-and-muse-cart-id';
const ROSE = 'gid://shopify/ProductVariant/1';
const MINT = 'gid://shopify/ProductVariant/2';
const PRICES: Record<string, { name: string; price: number }> = {
  [ROSE]: { name: 'Rose VitaliTea', price: 1800 },
  [MINT]: { name: 'Minted Stillness', price: 1650 },
};

/**
 * An in-memory stand-in for /api/cart. Behaves like Shopify: one cart, line
 * ids, subtotal computed server-side, null once the cart is "checked out".
 */
function fakeCartServer() {
  const carts = new Map<string, CartItem[]>();
  const codes = new Map<string, string>();
  let nextLine = 1;
  const snapshot = (id: string): CartSnapshot => {
    const lines = carts.get(id) ?? [];
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const code = codes.get(id);
    // The only real code is FAMILY, worth 30%.
    const discount = code === 'FAMILY' ? Math.round(subtotal * 0.3) : 0;
    return {
      id,
      checkoutUrl: `https://shop.example/checkout/${id}`,
      currency: 'CAD',
      subtotal,
      discount,
      total: subtotal - discount,
      discountCodes: code ? [{ code, applicable: code === 'FAMILY' }] : [],
      lines,
    };
  };
  const handle = (req: CartRequest): CartSnapshot | null => {
    switch (req.op) {
      case 'discount':
        if (req.code) codes.set(req.cartId, req.code);
        else codes.delete(req.cartId);
        return snapshot(req.cartId);
      case 'get':
        return carts.has(req.cartId) ? snapshot(req.cartId) : null;
      case 'add': {
        const id = req.cartId && carts.has(req.cartId) ? req.cartId : `gid://shopify/Cart/${carts.size + 1}`;
        const lines = carts.get(id) ?? [];
        const existing = lines.find((l) => l.variantId === req.variantId);
        if (existing) existing.quantity += req.quantity;
        else {
          const p = PRICES[req.variantId];
          lines.push({ id: `gid://shopify/CartLine/${nextLine++}`, variantId: req.variantId, slug: 'x', name: p.name, image: '', price: p.price, quantity: req.quantity });
        }
        carts.set(id, lines);
        return snapshot(id);
      }
      case 'update': {
        const lines = (carts.get(req.cartId) ?? [])
          .map((l) => (l.id === req.lineId ? { ...l, quantity: req.quantity } : l))
          .filter((l) => l.quantity > 0);
        carts.set(req.cartId, lines);
        return snapshot(req.cartId);
      }
      case 'remove':
        carts.set(req.cartId, (carts.get(req.cartId) ?? []).filter((l) => l.id !== req.lineId));
        return snapshot(req.cartId);
    }
  };
  const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
    const req = JSON.parse(init.body as string) as CartRequest;
    if (req.op === 'add' && req.variantId === 'gid://shopify/ProductVariant/sold-out') {
      return new Response(JSON.stringify({ error: 'This product is sold out.' }), { status: 400 });
    }
    if (req.op === 'discount' && req.code && req.code !== 'FAMILY') {
      return new Response(JSON.stringify({ error: 'That code is not valid for this bag.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ cart: handle(req) }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return { carts, codes, fetchMock };
}

const wrapper = ({ children }: PropsWithChildren) => <CartProvider>{children}</CartProvider>;

async function mountCart() {
  const view = renderHook(() => useCart(), { wrapper });
  await waitFor(() => expect(view.result.current.state.hydrated).toBe(true));
  return view;
}

describe('cart', () => {
  let server: ReturnType<typeof fakeCartServer>;

  beforeEach(() => {
    window.localStorage.clear();
    server = fakeCartServer();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('throws when used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(/within a CartProvider/);
    spy.mockRestore();
  });

  it('starts empty without calling the server', async () => {
    const { result } = await mountCart();
    expect(result.current.state.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.checkoutUrl).toBeNull();
    expect(server.fetchMock).not.toHaveBeenCalled();
  });

  it('adds an item, opens the drawer and takes prices from the server', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0]).toMatchObject({ name: 'Rose VitaliTea', price: 1800, quantity: 1 });
    expect(result.current.state.isOpen).toBe(true);
    expect(result.current.subtotal).toBe(1800);
    expect(result.current.checkoutUrl).toMatch(/^https:\/\/shop\.example\/checkout\//);
  });

  it('accumulates quantity instead of duplicating a line', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    await act(() => result.current.addItem({ variantId: ROSE }));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(2);
  });

  it('serialises rapid adds into one cart', async () => {
    const { result } = await mountCart();
    await act(async () => {
      await Promise.all([
        result.current.addItem({ variantId: ROSE }),
        result.current.addItem({ variantId: MINT }),
      ]);
    });
    expect(server.carts.size).toBe(1);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(1800 + 1650);
  });

  it('drops the line when quantity is stepped to zero', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    const lineId = result.current.state.items[0].id;
    await act(() => result.current.setQuantity(lineId, 0));
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.checkoutUrl).toBeNull();
  });

  it('removes a line and forgets the cart on clear', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    await act(() => result.current.addItem({ variantId: MINT }));
    await act(() => result.current.removeItem(result.current.state.items[0].id));
    expect(result.current.state.items).toHaveLength(1);
    act(() => result.current.clearCart());
    expect(result.current.state.items).toHaveLength(0);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('shows the server’s reason when an add fails and keeps the bag intact', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    await act(() => result.current.addItem({ variantId: 'gid://shopify/ProductVariant/sold-out' }));
    expect(result.current.state.error).toBe('This product is sold out.');
    expect(result.current.itemCount).toBe(1);
    expect(result.current.state.pending).toBe(false);
  });

  it('persists only the cart id', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('gid://shopify/Cart/1');
  });

  it('rehydrates a previous session from the server', async () => {
    server.carts.set('gid://shopify/Cart/9', [
      { id: 'gid://shopify/CartLine/9', variantId: ROSE, slug: 'x', name: 'Rose VitaliTea', image: '', price: 1800, quantity: 3 },
    ]);
    window.localStorage.setItem(STORAGE_KEY, 'gid://shopify/Cart/9');
    const { result } = await mountCart();
    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(5400);
  });

  it('forgets a cart Shopify no longer has (checked out or expired)', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'gid://shopify/Cart/gone');
    const { result } = await mountCart();
    expect(result.current.state.items).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('applies a code to the bag and shows the saving', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    await act(() => result.current.applyDiscount('family'));
    expect(result.current.state.discountCode).toBe('FAMILY');
    expect(result.current.state.discount).toBe(540);
    expect(result.current.state.total).toBe(1260);
    await act(() => result.current.removeDiscount());
    expect(result.current.state.discountCode).toBeNull();
    expect(result.current.state.total).toBe(1800);
  });

  it('tells the customer when a code is refused and keeps the bag', async () => {
    const { result } = await mountCart();
    await act(() => result.current.addItem({ variantId: ROSE }));
    await act(() => result.current.applyDiscount('NOPE'));
    expect(result.current.state.error).toMatch(/not valid/);
    expect(result.current.state.discountCode).toBeNull();
    expect(result.current.itemCount).toBe(1);
  });

  it('holds a code entered before there is a bag and applies it on the first add', async () => {
    const { result } = await mountCart();
    await act(() => result.current.applyDiscount('FAMILY'));
    expect(server.fetchMock).not.toHaveBeenCalled();
    await act(() => result.current.addItem({ variantId: ROSE }));
    expect(result.current.state.discountCode).toBe('FAMILY');
    expect(result.current.state.total).toBe(1260);
  });

  it('takes a code from a ?discount= share link and cleans the address bar', async () => {
    window.history.replaceState(null, '', '/?discount=family&x=1');
    const { result } = await mountCart();
    expect(window.location.search).toBe('?x=1');
    await act(() => result.current.addItem({ variantId: MINT }));
    expect(result.current.state.discountCode).toBe('FAMILY');
    // Used once; a later visit without the link must not re-apply it.
    expect(window.localStorage.getItem('infuse-and-muse-discount')).toBeNull();
    window.history.replaceState(null, '', '/');
  });

  it('survives an unreachable server on load', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'gid://shopify/Cart/1');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { result } = await mountCart();
    expect(result.current.state.items).toEqual([]);
  });
});
