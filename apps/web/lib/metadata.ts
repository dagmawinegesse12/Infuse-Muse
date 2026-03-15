import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Infuse & Muse";

export function absoluteUrl(path = "/") { return new URL(path, siteUrl).toString(); }

export function createMetadata({ title, description, path = "/", image = "/images/logo-hero.png" }: { title: string; description: string; path?: string; image?: string; }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, type: "website", url: absoluteUrl(path), images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: businessName }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] }
  };
}
