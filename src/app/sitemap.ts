import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = ["", "/about", "/treatments", "/patient-stories", "/achievements", "/media", "/gallery", "/blog", "/videos", "/contact", "/book", "/privacy", "/terms", "/site-map"];
  const entries: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${base}${path}` }));
  try {
    const [conditions, posts, pages] = await Promise.all([
      prisma.condition.findMany({ where: { published: true }, select: { slug: true } }),
      prisma.post.findMany({ where: { published: true }, select: { slug: true, publishedOn: true } }),
      prisma.page.findMany({ where: { published: true, slug: { notIn: ["about", "privacy", "terms"] } }, select: { slug: true } }),
    ]);
    return [
      ...entries,
      ...conditions.map((item) => ({ url: `${base}/treatments/${item.slug}` })),
      ...posts.map((item) => ({ url: `${base}/blog/${item.slug}`, lastModified: item.publishedOn })),
      ...pages.map((item) => ({ url: `${base}/p/${item.slug}` })),
    ];
  } catch {
    return entries;
  }
}
