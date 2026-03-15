import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

const styles = {
  primary:
    'inline-flex items-center justify-center rounded-full bg-emerald-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800',
  secondary:
    'inline-flex items-center justify-center rounded-full border border-emerald-900/15 bg-white/70 px-5 py-3 text-sm font-medium text-emerald-950 transition hover:bg-white',
  ghost:
    'inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-emerald-950 transition hover:bg-white/60'
};

type Props = {
  children: ReactNode;
  variant?: keyof typeof styles;
  href?: string;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ children, variant = 'primary', href, className = '', ...props }: Props) {
  const finalClassName = `${styles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
}
