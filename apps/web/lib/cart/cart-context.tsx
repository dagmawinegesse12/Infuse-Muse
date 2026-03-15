'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren
} from 'react';
import type { AddToCartInput, CartItem, CartState } from './cart-types';

const STORAGE_KEY = 'infuse-and-muse-cart';

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: AddToCartInput }
  | { type: 'SET_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  isOpen: false,
  hydrated: false
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, hydrated: true };
    case 'ADD_ITEM': {
      const quantity = Math.max(1, action.payload.quantity ?? 1);
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        return {
          ...state,
          isOpen: true,
          items: [...state.items, { ...action.payload, quantity }]
        };
      }
      return {
        ...state,
        isOpen: true,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      };
    }
    case 'SET_QUANTITY': {
      const nextItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, items: nextItems };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload ?? !state.isOpen };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  state: CartState;
  itemCount: number;
  subtotal: number;
  addItem: (item: AddToCartInput) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
      dispatch({ type: 'HYDRATE', payload: items });
    } catch {
      dispatch({ type: 'HYDRATE', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      state,
      itemCount,
      subtotal,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      openCart: () => dispatch({ type: 'TOGGLE_CART', payload: true }),
      closeCart: () => dispatch({ type: 'TOGGLE_CART', payload: false }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
