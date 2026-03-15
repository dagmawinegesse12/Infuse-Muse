import { redirect } from 'next/navigation';

// /shop/[slug] is the legacy route. Canonical route is /products/[slug].
export default function ShopProductPage({ params }: { params: { slug: string } }) {
  redirect(`/products/${params.slug}`);
}
