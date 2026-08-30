import { QuietLink } from '@/components/system/quiet-link';

export default function CheckoutCancelPage() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center pb-[var(--chapter)] pt-[var(--header-clear)] text-center">
      <p className="t-label t-label--accent">Checkout</p>
      <h1 className="t-display mx-auto mt-8 max-w-2xl">Payment cancelled.</h1>
      <p className="t-body t-body--lead mx-auto mt-8 max-w-measure">
        No charge was made, and your bag is still saved. Come back whenever you are ready.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
        <QuietLink href="/cart">Return to bag</QuietLink>
        <QuietLink href="/products">Keep browsing</QuietLink>
      </div>
      <p className="t-body mt-14">
        Having trouble?{' '}
        <a href="mailto:hello@infuseandmuse.com" className="wipe-link text-ink">
          hello@infuseandmuse.com
        </a>
      </p>
    </div>
  );
}
