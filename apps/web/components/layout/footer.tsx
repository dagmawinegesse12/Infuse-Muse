import Image from 'next/image';
import Link from 'next/link';

const COLUMNS: Array<[string, Array<[string, string]>]> = [
  [
    'Shop',
    [
      ['All blends', '/products'],
      ['The Archetypes', '/muses'],
      ['Gifting', '/contact'],
    ],
  ],
  [
    'The Prologue',
    [
      ['The Muse', '/about'],
      ['Instagram', 'https://www.instagram.com/infuse_and_muse'],
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
            Small batch, loose leaf, blended in Canada. Everything in service of a single
            luxury: the stillness.
          </p>
          <p className="t-label mt-8">Ontario · Canada</p>
        </div>

        {COLUMNS.map(([heading, links]) => (
          <nav key={heading}>
            <h2 className="t-label">{heading}</h2>
            <ul className="mt-6 space-y-6">
              {links.map(([label, href]) => (
                <li key={label + href}>
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hit wipe-link t-body text-ink"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="hit wipe-link t-body text-ink">
                      {label}
                    </Link>
                  )}
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
        <p className="t-label">© {new Date().getFullYear()} Infuse &amp; Muse Inc.</p>
        <p className="t-label">Redefining stillness</p>
      </div>
    </footer>
  );
}
