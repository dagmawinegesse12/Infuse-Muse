import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes = ["", "/products", "/collections", "/about", "/contact", "/faq", "/cart"].map((path) => ({
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

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/collections/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
