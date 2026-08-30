import { QuietLink } from '@/components/system/quiet-link';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center pb-[var(--chapter)] pt-[var(--header-clear)] text-center">
      <p className="t-label t-label--accent">Not found</p>
      <h1 className="t-display mx-auto mt-8 max-w-2xl">This page has steeped away.</h1>
      <p className="t-body t-body--lead mx-auto mt-8 max-w-measure">
        We could not find what you were looking for. The blends are still where you left them.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
        <QuietLink href="/">Home</QuietLink>
        <QuietLink href="/products">The blends</QuietLink>
      </div>
    </div>
  );
}
