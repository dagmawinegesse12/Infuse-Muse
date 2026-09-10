/** One Shopify cart line. `id` is the line id; `price` is unit price in cents. */
export type CartItem = {
  id: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

/** What the server hands back after every cart call. */
export type CartSnapshot = {
  id: string;
  checkoutUrl: string;
  currency: string;
  subtotal: number;
  lines: CartItem[];
};

export type CartState = {
  cartId: string | null;
  checkoutUrl: string | null;
  currency: string;
  items: CartItem[];
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  /** A request is in flight; controls should wait rather than double-fire. */
  pending: boolean;
  /** Last failure, in words a customer can read. Cleared by the next success. */
  error: string | null;
};

export type AddToCartInput = { variantId: string; quantity?: number };

export type CartRequest =
  | { op: "get"; cartId: string }
  | { op: "add"; cartId: string | null; variantId: string; quantity: number }
  | { op: "update"; cartId: string; lineId: string; quantity: number }
  | { op: "remove"; cartId: string; lineId: string };
