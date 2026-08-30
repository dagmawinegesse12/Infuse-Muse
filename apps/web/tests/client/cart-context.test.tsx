import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { CartProvider, useCart } from '@/lib/cart/cart-context';

const STORAGE_KEY = 'infuse-and-muse-cart';

const rose = { id: 'p1', slug: 'rose', name: 'Rose VitaliTea', image: '/r.png', price: 1800 };
const mint = { id: 'p2', slug: 'mint', name: 'Minted Stillness', image: '/m.png', price: 1650 };

const wrapper = ({ children }: PropsWithChildren) => <CartProvider>{children}</CartProvider>;

async function mountCart() {
  const view = renderHook(() => useCart(), { wrapper });
  // The provider hydrates from localStorage in an effect; wait for it.
  await waitFor(() => expect(view.result.current.state.hydrated).toBe(true));
  return view;
}

describe('cart', () => {
  beforeEach(() => window.localStorage.clear());

  it('throws when used outside a provider', () => {
    // React logs the thrown error; silence it for this assertion only.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(/within a CartProvider/);
    spy.mockRestore();
  });

  it('starts empty', async () => {
    const { result } = await mountCart();
    expect(result.current.state.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('adds an item with a default quantity of one', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(1);
  });

  it('accumulates quantity instead of duplicating a line', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    act(() => result.current.addItem(rose));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(2);
  });

  it('opens the drawer when something is added', async () => {
    const { result } = await mountCart();
    expect(result.current.state.isOpen).toBe(false);
    act(() => result.current.addItem(rose));
    expect(result.current.state.isOpen).toBe(true);
  });

  it('computes subtotal across mixed lines and quantities', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem({ ...rose, quantity: 2 }));
    act(() => result.current.addItem(mint));
    expect(result.current.subtotal).toBe(1800 * 2 + 1650);
    expect(result.current.itemCount).toBe(3);
  });

  it('drops the line when quantity is stepped to zero', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    act(() => result.current.setQuantity(rose.id, 0));
    expect(result.current.state.items).toHaveLength(0);
  });

  it('drops the line on a negative quantity rather than going below zero', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    act(() => result.current.setQuantity(rose.id, -3));
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('removes and clears', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    act(() => result.current.addItem(mint));
    act(() => result.current.removeItem(rose.id));
    expect(result.current.state.items).toHaveLength(1);
    act(() => result.current.clearCart());
    expect(result.current.state.items).toHaveLength(0);
  });

  it('persists to localStorage', async () => {
    const { result } = await mountCart();
    act(() => result.current.addItem(rose));
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('p1');
    });
  });

  it('rehydrates a previous session', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...rose, quantity: 3 }])
    );
    const { result } = await mountCart();
    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(5400);
  });

  it('survives corrupt stored data instead of crashing', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    const { result } = await mountCart();
    expect(result.current.state.items).toEqual([]);
  });
});
