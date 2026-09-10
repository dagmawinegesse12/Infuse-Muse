/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Dev only: print each server-side fetch (Shopify, Sanity) with its cache
  // status, so it is obvious which source a page rendered from.
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
