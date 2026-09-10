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
  /** Lines before any code, in cents. */
  subtotal: number;
  /** What the applied codes take off, in cents. */
  discount: number;
  /** subtotal − discount; shipping and tax are added at checkout. */
  total: number;
  /** Codes on the cart. `applicable: false` means Shopify did not accept it. */
  discountCodes: { code: string; applicable: boolean }[];
  lines: CartItem[];
};

export type CartState = {
  cartId: string | null;
  checkoutUrl: string | null;
  currency: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  /** The accepted code on the cart, if any. */
  discountCode: string | null;
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
  | { op: "remove"; cartId: string; lineId: string }
  /** Empty `code` clears every code on the cart. */
  | { op: "discount"; cartId: string; code: string };
