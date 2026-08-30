import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional and internal routes have no business in search results.
      disallow: ["/cart", "/checkout/", "/preview/", "/unsubscribe", "/api/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
