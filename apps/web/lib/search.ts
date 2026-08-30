import type { Product } from '@/lib/types';

/**
 * Small-catalogue search: matches title, description, category, notes and
 * ingredients. Ranked so a title hit always outranks an ingredient hit.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = products
    .map((product) => {
      const title = product.title.toLowerCase();
      const category = (product.categoryTitle ?? '').toLowerCase();
      const notes = (product.tastingNotes ?? []).join(' ').toLowerCase();
      const ingredients = (product.ingredients ?? []).join(' ').toLowerCase();
      const body = `${product.shortDescription ?? ''} ${product.description ?? ''}`.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (title === term) score += 100;
        else if (title.startsWith(term)) score += 60;
        else if (title.includes(term)) score += 40;

        if (category.includes(term)) score += 16;
        if (notes.includes(term)) score += 10;
        if (ingredients.includes(term)) score += 8;
        if (body.includes(term)) score += 4;
      }
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title));

  return scored.map((entry) => entry.product);
}
