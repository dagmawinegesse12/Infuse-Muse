import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/site-shell';

/** Review-only route: the same homepage in the Parchment tonality. */
export default function ParchmentPreviewLayout({ children }: { children: ReactNode }) {
  return <SiteShell theme="parchment">{children}</SiteShell>;
}
