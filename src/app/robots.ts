import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/queries";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const settings = await getSettings();
  if (settings && !settings.seoIndex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
