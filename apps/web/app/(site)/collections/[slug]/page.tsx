import { redirect } from 'next/navigation';

/**
 * Legacy collection route. Archetype slugs match the muse slugs, so an old
 * /collections/<slug> resolves to the matching archetype page; anything that
 * does not match falls back to the full set.
 */
import { getMuse } from '@/lib/muses';

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  redirect(getMuse(params.slug) ? `/muses/${params.slug}` : '/muses');
}
