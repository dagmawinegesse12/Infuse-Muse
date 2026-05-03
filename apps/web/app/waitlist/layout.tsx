import type { ReactNode } from 'react';

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen">{children}</div>
    </>
  );
}
