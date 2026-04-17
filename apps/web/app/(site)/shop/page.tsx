import { redirect } from 'next/navigation';

// /shop is the legacy route. Canonical route is /products.
export default function ShopPage() {
  redirect('/products');
}
