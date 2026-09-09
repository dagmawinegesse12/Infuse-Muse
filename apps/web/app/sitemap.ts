import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { MUSES } from "@/lib/muses";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getProducts();

  const staticRoutes = [
    "",
    "/products",
    "/muses",
    "/about",
    "/contact",
    "/faq",
    "/shipping-returns",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const museRoutes = MUSES.map((muse) => ({
    url: `${siteUrl}/muses/${muse.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...productRoutes, ...museRoutes];
}
