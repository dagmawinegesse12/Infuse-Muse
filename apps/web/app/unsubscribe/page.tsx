import Image from 'next/image';

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { status?: string; email?: string };
}) {
  const success = searchParams.status === 'success';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a2a20] px-6 py-16">
      <Image
        src="/images/logo.png"
        alt="Infuse & Muse"
        width={120}
        height={120}
        className="mb-10 w-28 drop-shadow-xl brightness-110"
      />
      <div className="w-full max-w-sm text-center">
        {success ? (
          <>
            <p className="font-serif text-2xl text-[#efcb80]">
              You&apos;ve been removed.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {searchParams.email && (
                <span className="block text-white/30 text-xs mb-2">
                  {searchParams.email}
                </span>
              )}
              You won&apos;t receive any more emails from us.<br />
              We&apos;re sorry to see you go.
            </p>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl text-[#efcb80]">
              Something went wrong.
            </p>
            <p className="mt-4 text-sm text-white/50">
              Please try again or email us at{' '}
              <a
                href="mailto:hello@infuseandmuse.com"
                className="text-[#efcb80]/70 underline"
              >
                hello@infuseandmuse.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
