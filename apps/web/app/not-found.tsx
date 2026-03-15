import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.22em] text-[#c79f3d]">404</p>
        <h1 className="mt-4 font-serif text-5xl text-emerald-950">This page has steeped away.</h1>
        <p className="mt-5 text-base leading-8 text-emerald-950/65">
          The page you were looking for could not be found. Browse the tea collection or head back home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-emerald-950/15 bg-white/70 px-6 py-3 text-sm font-medium text-emerald-950 transition hover:bg-white"
          >
            Shop teas
          </Link>
        </div>
      </div>
    </div>
  );
}
