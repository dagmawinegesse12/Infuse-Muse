import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShopifyProductNode } from '@/lib/shopify';
import { demoProducts } from '@/lib/demo-data';

const node = (over: Partial<ShopifyProductNode> = {}): ShopifyProductNode => ({
  id: 'gid://shopify/Product/1',
  handle: 'coco-breeze',
  title: 'Coco Breeze',
  description: 'Coco Breeze is a mint cacao blend with an earthy undertone.',
  featuredImage: null,
  seo: { title: 'Coco Breeze | Mint and Cacao Tea Blend', description: null },
  collections: { nodes: [{ handle: 'frontpage', title: 'Home page' }, { handle: 'the-poet', title: 'The Poet' }] },
  variants: {
    nodes: [{ price: { amount: '29.95', currencyCode: 'CAD' }, selectedOptions: [{ name: 'Size', value: '75 g' }] }],
  },
  metafields: [
    { key: 'short_description', value: 'A cool, cacao-rich blend.' },
    { key: 'tasting_notes', value: '["Mint","Chocolate","Earthy"]' },
    { key: 'ingredients', value: '["Dried mint","Cacao nibs"]' },
    { key: 'caffeine_level', value: 'Herbal' },
    { key: 'brew_temperature', value: '95–100 °C' },
    { key: 'brew_time', value: '5–7 minutes' },
    { key: 'brew_amount', value: '1 tsp per 250 ml' },
    null,
  ],
  ...over,
});

describe('mapShopifyProduct', () => {
  it('maps store fields onto the site Product', async () => {
    const { mapShopifyProduct } = await import('@/lib/shopify');
    const p = mapShopifyProduct(node());

    expect(p).toMatchObject({
      _id: 'gid://shopify/Product/1',
      slug: 'coco-breeze',
      priceCents: 2995,
      currency: 'CAD',
      size: '75 g',
      shortDescription: 'A cool, cacao-rich blend.',
      tastingNotes: ['Mint', 'Chocolate', 'Earthy'],
      ingredients: ['Dried mint', 'Cacao nibs'],
      caffeineLevel: 'Herbal',
      brewing: { temperature: '95–100 °C', time: '5–7 minutes', amount: '1 tsp per 250 ml' },
      categorySlug: 'the-poet',
      categoryTitle: 'The Poet',
      seoTitle: 'Coco Breeze | Mint and Cacao Tea Blend',
    });
  });

  it('rounds prices to whole cents', async () => {
    const { mapShopifyProduct } = await import('@/lib/shopify');
    const p = mapShopifyProduct(
      node({ variants: { nodes: [{ price: { amount: '33.03', currencyCode: 'CAD' }, selectedOptions: [] }] } })
    );
    expect(p.priceCents).toBe(3303);
  });

  it('borrows photo and featured flag from the local record, never allergens', async () => {
    const { mapShopifyProduct } = await import('@/lib/shopify');
    const local = { ...demoProducts.find((d) => d.slug === 'coco-breeze')!, allergens: 'Contains nuts' };
    const p = mapShopifyProduct(node(), local);

    expect(p.image).toBe(local.image);
    expect(p.featured).toBe(local.featured);
    expect(p.allergens).toBe('');
  });

  it('ignores an unknown caffeine value and malformed lists', async () => {
    const { mapShopifyProduct } = await import('@/lib/shopify');
    const p = mapShopifyProduct(
      node({
        metafields: [
          { key: 'caffeine_level', value: 'Extreme' },
          { key: 'tasting_notes', value: 'not json' },
        ],
      })
    );
    expect(p.caffeineLevel).toBe('Herbal');
    expect(p.tastingNotes).toEqual([]);
  });
});

describe('getProducts with Shopify configured', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'example.myshopify.com');
    vi.stubEnv('SHOPIFY_STOREFRONT_PRIVATE_TOKEN', 'test-token');
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reads products from the store with the private token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { products: { nodes: [node()] } } }))
    );
    vi.stubGlobal('fetch', fetchMock);
    const { getProducts } = await import('@/lib/data');

    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0]._id).toBe('gid://shopify/Product/1');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.myshopify.com/api/2026-04/graphql.json');
    expect(init.headers['Shopify-Storefront-Private-Token']).toBe('test-token');
  });

  it('falls back to local products when the store has none published', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { products: { nodes: [] } } })))
    );
    const { getProducts } = await import('@/lib/data');
    expect(await getProducts()).toEqual(demoProducts);
  });

  it('falls back to local products when Shopify errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 401 })));
    const { getProductBySlug } = await import('@/lib/data');
    expect((await getProductBySlug('coco-breeze'))?._id).toBe('prod-coco');
  });
});
