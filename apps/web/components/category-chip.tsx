import Link from 'next/link';

/**
 * Filter control. A word over a hairline — the active one carries the accent.
 * No pills: the system has no rounded surfaces.
 */
export function CategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="hit t-label inline-block border-b pb-2 transition-colors duration-500 ease-muse"
      style={{
        borderColor: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--ink-mute)',
      }}
    >
      {label}
    </Link>
  );
}
