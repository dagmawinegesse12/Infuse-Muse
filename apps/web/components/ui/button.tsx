import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Squared and hairline-bounded. `primary` is the only filled form in the system
 * and is reserved for true commitments — add to bag, send, check out. Everything
 * navigational should use QuietLink instead.
 */
const styles = {
  primary:
    'inline-flex items-center justify-center border border-transparent px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-muse',
  secondary:
    'inline-flex items-center justify-center border px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-muse',
} as const;

type Props = {
  children: ReactNode;
  variant?: keyof typeof styles;
  href?: string;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ children, variant = 'primary', href, className = '', ...props }: Props) {
  const tone =
    variant === 'primary'
      ? { background: 'var(--ink-strong)', color: 'var(--ground)' }
      : { borderColor: 'var(--rule-strong)', color: 'var(--ink-strong)' };

  const finalClassName = `${styles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={finalClassName} style={tone}>
        {children}
      </Link>
    );
  }

  return (
    <button className={finalClassName} style={tone} {...props}>
      {children}
    </button>
  );
}
