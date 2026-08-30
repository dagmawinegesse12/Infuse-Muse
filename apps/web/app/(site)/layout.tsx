import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/site-shell';

export default function SiteLayout({ children }: { children: ReactNode }) {
  // No theme prop: the viewer's choice from <html data-muse> applies.
  return <SiteShell>{children}</SiteShell>;
}
