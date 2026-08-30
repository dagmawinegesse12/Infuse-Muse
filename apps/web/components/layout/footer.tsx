import Image from 'next/image';
import Link from 'next/link';

const COLUMNS: Array<[string, Array<[string, string]>]> = [
  [
    'Shop',
    [
      ['All blends', '/products'],
      ['Collections', '/collections'],
      ['The Muses', '/muses'],
      ['Gifting', '/contact'],
    ],
  ],
  [
    'The Maison',
    [
      ['Our story', '/about'],
      ['The Muses', '/muses'],
      ['Contact', '/contact'],
      ['Waitlist', '/waitlist'],
    ],
  ],
  [
    'Service',
    [
      ['Shipping & returns', '/shipping-returns'],
      ['Questions', '/faq'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ],
  ],
];

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell grid gap-14 py-[clamp(4rem,8vw,7rem)] lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
        <div className="max-w-sm">
          <Image
            src="/images/logo.png"
            alt="Infuse &amp; Muse"
            width={160}
            height={152}
            className="h-14 w-auto"
          />
          <p className="t-body mt-7">
            Small-batch tea, blended in Mississauga. Made for the pause around the cup rather
            than the cup itself.
          </p>
          <p className="t-label mt-8">Mississauga · Ontario · Canada</p>
        </div>

        {COLUMNS.map(([heading, links]) => (
          <nav key={heading}>
            <h2 className="t-label">{heading}</h2>
            <ul className="mt-6 space-y-6">
              {links.map(([label, href]) => (
                <li key={label + href}>
                  <Link href={href} className="hit wipe-link t-body text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div
        className="shell flex flex-col gap-4 border-t py-7 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--rule)' }}
      >
        <p className="t-label">© {new Date().getFullYear()} Infuse &amp; Muse</p>
        <p className="t-label">Crafted for stillness</p>
      </div>
    </footer>
  );
}
