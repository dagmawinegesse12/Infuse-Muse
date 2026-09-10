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
 *
 * A discount code can arrive before there is a cart (a shared
 * `?discount=CODE` link). It waits in storage and is applied to the first
 * cart that exists.
 */
const STORAGE_KEY = 'infuse-and-muse-cart-id';
const PENDING_CODE_KEY = 'infuse-and-muse-discount';
const LINK_PARAM = 'discount';

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
  subtotal: 0,
  discount: 0,
  total: 0,
  discountCode: null
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
    subtotal: snapshot.subtotal,
    discount: snapshot.discount,
    total: snapshot.total,
    discountCode: snapshot.discountCodes.find((d) => d.applicable)?.code ?? null
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

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function store(key: string, value: string | null) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Private mode or blocked storage: the bag simply will not survive a reload.
  }
}

/** A `?discount=CODE` on the current URL, removed from the address bar once read. */
function takeCodeFromLink(): string | null {
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get(LINK_PARAM)?.trim().toUpperCase() || null;
    if (code) {
      url.searchParams.delete(LINK_PARAM);
      window.history.replaceState(window.history.state, '', url.toString());
    }
    return code;
  } catch {
    return null;
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
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Callbacks read the live id from here, not from a stale closure.
  const cartIdRef = useRef<string | null>(null);
  // A code waiting for a cart to exist.
  const pendingCodeRef = useRef<string | null>(null);
  // Mutations run one after another so two quick clicks cannot race and
  // create two carts.
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  /** Runs one request, then applies any waiting code to the resulting cart. */
  const perform = useCallback(async (request: CartRequest) => {
    let cart = await callCart(request);
    const code = pendingCodeRef.current;
    if (cart && code && cart.lines.length > 0) {
      try {
        cart = (await callCart({ op: 'discount', cartId: cart.id, code })) ?? cart;
        pendingCodeRef.current = null;
        store(PENDING_CODE_KEY, null);
      } catch (error) {
        // A dead link code should not break adding to the bag. Forget a code
        // Shopify refused; keep one that merely failed to reach it.
        if (error instanceof Error && /not valid/i.test(error.message)) {
          pendingCodeRef.current = null;
          store(PENDING_CODE_KEY, null);
        }
      }
    }
    return cart;
  }, []);

  useEffect(() => {
    const linkCode = takeCodeFromLink();
    if (linkCode) store(PENDING_CODE_KEY, linkCode);
    pendingCodeRef.current = linkCode ?? readStored(PENDING_CODE_KEY);

    const id = readStored(STORAGE_KEY);
    if (!id) {
      dispatch({ type: 'HYDRATE', payload: null });
      return;
    }
    let cancelled = false;
    perform({ op: 'get', cartId: id })
      .then((cart) => {
        if (cancelled) return;
        // Null means Shopify no longer has it: checked out or expired.
        if (!cart) store(STORAGE_KEY, null);
        cartIdRef.current = cart?.id ?? null;
        dispatch({ type: 'HYDRATE', payload: cart });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'HYDRATE', payload: null });
      });
    return () => {
      cancelled = true;
    };
  }, [perform]);

  const run = useCallback(
    (build: (cartId: string | null) => CartRequest | null, open = false) => {
      const task = queueRef.current.then(async () => {
        const request = build(cartIdRef.current);
        if (!request) return;
        dispatch({ type: 'PENDING', open });
        try {
          const cart = await perform(request);
          cartIdRef.current = cart?.id ?? null;
          store(STORAGE_KEY, cartIdRef.current);
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
    },
    [perform]
  );

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
      applyDiscount: (code) => {
        const clean = code.trim().toUpperCase();
        if (!clean) return Promise.resolve();
        return run((cartId) => {
          if (cartId) return { op: 'discount', cartId, code: clean };
          // No bag yet: keep the code for the first add.
          pendingCodeRef.current = clean;
          store(PENDING_CODE_KEY, clean);
          return null;
        });
      },
      removeDiscount: () => {
        pendingCodeRef.current = null;
        store(PENDING_CODE_KEY, null);
        return run((cartId) => (cartId ? { op: 'discount', cartId, code: '' } : null));
      },
      openCart: () => dispatch({ type: 'TOGGLE_CART', payload: true }),
      closeCart: () => dispatch({ type: 'TOGGLE_CART', payload: false }),
      clearCart: () => {
        // Forget the Shopify cart rather than emptying it line by line; the
        // next add starts a fresh one.
        cartIdRef.current = null;
        store(STORAGE_KEY, null);
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
