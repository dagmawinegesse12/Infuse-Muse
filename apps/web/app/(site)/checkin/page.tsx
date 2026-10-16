import type { Metadata } from 'next';
import { CheckinApp } from '@/components/event/checkin-app';

export const metadata: Metadata = { title: 'Check-in', robots: { index: false, follow: false } };

export default function CheckinPage() {
  return (
    <section className="shell pb-[var(--chapter)] pt-[var(--header-clear)]">
      <CheckinApp />
    </section>
  );
}
