'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart/cart-context';

/**
 * Clears the cart once mounted on the success page.
 * Runs only on the client where localStorage state lives.
 */
export function ClearCart() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
