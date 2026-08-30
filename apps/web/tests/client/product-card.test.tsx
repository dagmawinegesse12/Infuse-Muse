import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/lib/cart/cart-context';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

const product = {
  _id: 'p1', title: 'Rose VitaliTea', slug: 'rose-vitalitea',
  shortDescription: 'A romantic floral blend.', description: 'Longer copy.',
  image: '/images/products/rose-vitalitea.png', alt: 'Rose tea',
  priceCents: 1800, currency: 'CAD', featured: true, seasonal: false,
  categorySlug: 'floral-blends', categoryTitle: 'Floral Blends',
  tastingNotes: ['Rose petal'], ingredients: ['Black tea'], caffeineLevel: 'Medium',
} as Product;

function Count() {
  const { itemCount, subtotal } = useCart();
  return <output data-testid="count">{`${itemCount}|${subtotal}`}</output>;
}

const mount = () =>
  render(
    <CartProvider>
      <ProductCard product={product} />
      <Count />
    </CartProvider>
  );

describe('ProductCard', () => {
  beforeEach(() => window.localStorage.clear());

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

  it('adds to the bag at the correct cent price', async () => {
    mount();
    await userEvent.click(screen.getByRole('button', { name: /add to bag/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('1|1800');
  });

  it('accumulates rather than duplicating on repeat clicks', async () => {
    mount();
    const button = screen.getByRole('button', { name: /add to bag/i });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(screen.getByTestId('count')).toHaveTextContent('2|3600');
  });

  it('keeps the add control reachable by keyboard even though it is hover-revealed', () => {
    mount();
    // It must be a real button in the tree, not display:none, or it is
    // unreachable for keyboard and screen-reader users.
    const button = screen.getByRole('button', { name: /add to bag/i });
    expect(button).toBeVisible();
  });
});
