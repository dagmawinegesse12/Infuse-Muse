'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren
} from 'react';
import type { AddToCartInput, CartItem, CartRequest, CartSnapshot, CartState } from './cart-types';

/**
 * The bag is a Shopify cart. Only its id is kept in the browser; lines,
 * prices and the checkout URL come from the server on every change, so the
 * customer always sees what Shopify will charge.
 */
const STORAGE_KEY = 'infuse-and-muse-cart-id';

type CartAction =
  | { type: 'HYDRATE'; payload: CartSnapshot | null }
  | { type: 'PENDING'; open?: boolean }
  | { type: 'APPLY'; payload: CartSnapshot | null }
  | { type: 'FAIL'; message: string }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'CLEAR_CART' };

const empty = {
  cartId: null,
  checkoutUrl: null,
  currency: 'CAD',
  items: [] as CartItem[],
  subtotal: 0
};

const initialState: CartState = {
  ...empty,
  isOpen: false,
  hydrated: false,
  pending: false,
  error: null
};

function fromSnapshot(snapshot: CartSnapshot | null) {
  if (!snapshot) return empty;
  return {
    cartId: snapshot.id,
    checkoutUrl: snapshot.checkoutUrl,
    currency: snapshot.currency,
    items: snapshot.lines,
    subtotal: snapshot.subtotal
  };
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...fromSnapshot(action.payload), hydrated: true };
    case 'PENDING':
      return { ...state, pending: true, error: null, isOpen: action.open ?? state.isOpen };
    case 'APPLY':
      return { ...state, ...fromSnapshot(action.payload), pending: false, error: null };
    case 'FAIL':
      return { ...state, pending: false, error: action.message };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload ?? !state.isOpen };
    case 'CLEAR_CART':
      return { ...state, ...empty, pending: false, error: null };
    default:
      return state;
  }
}

async function callCart(body: CartRequest): Promise<CartSnapshot | null> {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = (await response.json().catch(() => ({}))) as { cart?: CartSnapshot | null; error?: string };
  if (!response.ok) throw new Error(data.error ?? 'Something went wrong. Please try again.');
  return data.cart ?? null;
}

function readStoredId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: the bag simply will not survive a reload.
  }
}

type CartContextValue = {
  state: CartState;
  itemCount: number;
  subtotal: number;
  checkoutUrl: string | null;
  addItem: (item: AddToCartInput) => Promise<void>;
  setQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Callbacks read the live id from here, not from a stale closure.
  const cartIdRef = useRef<string | null>(null);
  // Mutations run one after another so two quick clicks cannot race and
  // create two carts.
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    const id = readStoredId();
    if (!id) {
      dispatch({ type: 'HYDRATE', payload: null });
      return;
    }
    let cancelled = false;
    callCart({ op: 'get', cartId: id })
      .then((cart) => {
        if (cancelled) return;
        // Null means Shopify no longer has it: checked out or expired.
        if (!cart) storeId(null);
        cartIdRef.current = cart?.id ?? null;
        dispatch({ type: 'HYDRATE', payload: cart });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'HYDRATE', payload: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const run = useCallback((build: (cartId: string | null) => CartRequest | null, open = false) => {
    const task = queueRef.current.then(async () => {
      const request = build(cartIdRef.current);
      if (!request) return;
      dispatch({ type: 'PENDING', open });
      try {
        const cart = await callCart(request);
        cartIdRef.current = cart?.id ?? null;
        storeId(cartIdRef.current);
        dispatch({ type: 'APPLY', payload: cart });
      } catch (error) {
        dispatch({
          type: 'FAIL',
          message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        });
      }
    });
    queueRef.current = task;
    return task;
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      state,
      itemCount,
      subtotal: state.subtotal,
      checkoutUrl: state.items.length > 0 ? state.checkoutUrl : null,
      addItem: ({ variantId, quantity = 1 }) =>
        run(
          (cartId) => ({ op: 'add', cartId, variantId, quantity: Math.max(1, quantity) }),
          true
        ),
      setQuantity: (lineId, quantity) =>
        run((cartId) => (cartId ? { op: 'update', cartId, lineId, quantity } : null)),
      removeItem: (lineId) =>
        run((cartId) => (cartId ? { op: 'remove', cartId, lineId } : null)),
      openCart: () => dispatch({ type: 'TOGGLE_CART', payload: true }),
      closeCart: () => dispatch({ type: 'TOGGLE_CART', payload: false }),
      clearCart: () => {
        // Forget the Shopify cart rather than emptying it line by line; the
        // next add starts a fresh one.
        cartIdRef.current = null;
        storeId(null);
        dispatch({ type: 'CLEAR_CART' });
      }
    };
  }, [state, run]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
