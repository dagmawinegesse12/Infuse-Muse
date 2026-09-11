import { afterEach, describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/lib/cart/cart-context';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import type { CartRequest } from '@/lib/cart/cart-types';

const VARIANT = 'gid://shopify/ProductVariant/1';

const product = {
  _id: 'p1', title: 'Rose VitaliTea', slug: 'rose-vitalitea',
  shortDescription: 'A romantic floral blend.', description: 'Longer copy.',
  image: '/images/products/rose-vitalitea-emerald.jpg', alt: 'Rose tea',
  priceCents: 1800, currency: 'CAD', variantId: VARIANT, availableForSale: true,
  featured: true, seasonal: false,
  categorySlug: 'floral-blends', categoryTitle: 'Floral Blends',
  tastingNotes: ['Rose petal'], ingredients: ['Black tea'], caffeineLevel: 'Medium',
} as Product;

function Count() {
  const { itemCount, subtotal } = useCart();
  return <output data-testid="count">{`${itemCount}|${subtotal}`}</output>;
}

/** Minimal /api/cart: one line, quantity accumulates, price from the "store". */
function stubCartApi() {
  let quantity = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      const req = JSON.parse(init.body as string) as CartRequest;
      if (req.op === 'add') quantity += req.quantity;
      const lines = quantity
        ? [{ id: 'gid://shopify/CartLine/1', variantId: VARIANT, slug: 'rose-vitalitea', name: 'Rose VitaliTea', image: '', price: 1800, quantity }]
        : [];
      return new Response(
        JSON.stringify({ cart: { id: 'gid://shopify/Cart/1', checkoutUrl: 'https://x/c', currency: 'CAD', subtotal: 1800 * quantity, discount: 0, total: 1800 * quantity, discountCodes: [], lines } })
      );
    })
  );
}

const mount = (p: Product = product) =>
  render(
    <CartProvider>
      <ProductCard product={p} />
      <Count />
    </CartProvider>
  );

describe('ProductCard', () => {
  beforeEach(() => {
    window.localStorage.clear();
    stubCartApi();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('says sold out instead of offering an add control', () => {
    mount({ ...product, availableForSale: false });
    expect(screen.getByText('Sold out')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to bag/i })).toBeNull();
  });

  it('offers no add control for local data with no variant', () => {
    mount({ ...product, variantId: undefined });
    expect(screen.queryByRole('button', { name: /add to bag/i })).toBeNull();
  });

  it('shows the name, category and formatted price', () => {
    mount();
    expect(screen.getByRole('heading', { name: 'Rose VitaliTea' })).toBeInTheDocument();
    expect(screen.getByText('Floral Blends')).toBeInTheDocument();
    expect(screen.getByText(/18\.00/)).toBeInTheDocument();
  });

  it('links to the product page', () => {
    mount();
    const links = screen.getAllByRole('link');
    expect(links.some((a) => a.getAttribute('href') === '/products/rose-vitalitea')).toBe(true);
  });

  it('gives the image real alt text', () => {
    mount();
    expect(screen.getByAltText('Rose tea')).toBeInTheDocument();
  });

  it('adds to the bag by variant and shows the store price', async () => {
    mount();
    await userEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1|1800'));
    const body = JSON.parse((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body).toMatchObject({ op: 'add', variantId: VARIANT, quantity: 1 });
  });

  it('accumulates rather than duplicating on repeat clicks', async () => {
    mount();
    const button = screen.getByRole('button', { name: /add to bag/i });
    await userEvent.click(button);
    await userEvent.click(button);
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2|3600'));
  });

  it('keeps the add control reachable by keyboard even though it is hover-revealed', () => {
    mount();
    // It must be a real button in the tree, not display:none, or it is
    // unreachable for keyboard and screen-reader users.
    const button = screen.getByRole('button', { name: /add to bag/i });
    expect(button).toBeVisible();
  });
});
