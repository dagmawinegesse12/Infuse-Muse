export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
};

export type AddToCartInput = Omit<CartItem, 'quantity'> & { quantity?: number };
