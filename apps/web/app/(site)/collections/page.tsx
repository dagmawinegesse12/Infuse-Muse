import { redirect } from 'next/navigation';

/**
 * Collections were struck from the content form of 9 September 2026 — the
 * Floral / Fruity / Wellness grouping is gone and the Archetypes are now the
 * taxonomy. The route stays as a redirect so existing links and any indexed
 * URLs land somewhere sensible rather than 404ing.
 */
export default function CollectionsPage() {
  redirect('/muses');
}
