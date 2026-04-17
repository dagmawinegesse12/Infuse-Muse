import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Infuse & Muse | Premium Tea Blends',
    template: '%s | Infuse & Muse',
  },
  description: 'Premium boutique tea blends from Mississauga. Crafted for calm, gifting, and everyday ritual.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
