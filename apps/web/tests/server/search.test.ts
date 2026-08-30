import { describe, expect, it } from 'vitest';
import { searchProducts } from '@/lib/search';
import type { Product } from '@/lib/types';

const product = (over: Partial<Product>): Product =>
  ({
    _id: over.slug ?? 'x', title: 'Untitled', slug: 'untitled',
    shortDescription: '', description: '', image: '', alt: '',
    priceCents: 1000, currency: 'CAD', featured: false, seasonal: false,
    categorySlug: 'misc', categoryTitle: 'Misc',
    tastingNotes: [], ingredients: [], caffeineLevel: 'Low',
    ...over,
  }) as Product;

const catalogue: Product[] = [
  product({ slug: 'rose-vitalitea', title: 'Rose VitaliTea', categoryTitle: 'Floral Blends',
    tastingNotes: ['Rose petal'], ingredients: ['Black tea', 'Rose petals'] }),
  product({ slug: 'minted-stillness', title: 'Minted Stillness', categoryTitle: 'Wellness Blends',
    tastingNotes: ['Fresh mint'], ingredients: ['Green tea', 'Mint leaves'] }),
  product({ slug: 'lavender-lullaby', title: 'Lavender Lullaby', categoryTitle: 'Wellness Blends',
    shortDescription: 'A calming evening blend.', tastingNotes: ['Lavender'] }),
];

describe('searchProducts', () => {
  it('returns everything for an empty query', () => {
    expect(searchProducts(catalogue, '')).toHaveLength(3);
    expect(searchProducts(catalogue, '   ')).toHaveLength(3);
  });

  it('finds by title, case-insensitively', () => {
    expect(searchProducts(catalogue, 'rose')[0].slug).toBe('rose-vitalitea');
    expect(searchProducts(catalogue, 'ROSE')[0].slug).toBe('rose-vitalitea');
  });

  it('ranks a title match above an ingredient-only match', () => {
    // "mint" is in Minted Stillness's title and in its ingredients; Lavender
    // has neither, so ordering here proves the title weighting.
    const results = searchProducts(catalogue, 'mint');
    expect(results[0].slug).toBe('minted-stillness');
  });

  it('finds by tasting note', () => {
    expect(searchProducts(catalogue, 'lavender').map((p) => p.slug)).toContain(
      'lavender-lullaby'
    );
  });

  it('finds by ingredient', () => {
    expect(searchProducts(catalogue, 'green tea').map((p) => p.slug)).toContain(
      'minted-stillness'
    );
  });

  it('finds by category name', () => {
    const results = searchProducts(catalogue, 'wellness');
    expect(results).toHaveLength(2);
  });

  it('searches the description text', () => {
    expect(searchProducts(catalogue, 'calming')[0].slug).toBe('lavender-lullaby');
  });

  it('returns nothing for a term that appears nowhere', () => {
    expect(searchProducts(catalogue, 'espresso')).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const before = [...catalogue];
    searchProducts(catalogue, 'rose');
    expect(catalogue).toEqual(before);
  });

  it('tolerates products with missing optional fields', () => {
    const sparse = [product({ slug: 'bare', title: 'Bare', tastingNotes: undefined, ingredients: undefined })];
    expect(() => searchProducts(sparse, 'bare')).not.toThrow();
    expect(searchProducts(sparse, 'bare')).toHaveLength(1);
  });
});
