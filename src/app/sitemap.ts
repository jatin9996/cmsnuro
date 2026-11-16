import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const staticPaths = [
  "",
  "/about",
  "/treatments",
  "/patient-stories",
  "/achievements",
  "/media",
  "/gallery",
  "/blog",
  "/videos",
  "/contact",
  "/book",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
  }));

  try {
    const [conditions, posts, pages] = await Promise.all([
      prisma.condition.findMany({
        where: { published: true },
        select: { slug: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, publishedOn: true },
        orderBy: { publishedOn: "desc" },
      }),
      prisma.page.findMany({
        where: { published: true, slug: { notIn: ["about", "privacy", "terms"] } },
        select: { slug: true },
      }),
    ]);

    return [
      ...entries,
      ...conditions.map((item) => ({ url: `${base}/treatments/${item.slug}` })),
      ...posts.map((item) => ({
        url: `${base}/blog/${item.slug}`,
        lastModified: item.publishedOn,
      })),
      ...pages.map((item) => ({ url: `${base}/p/${item.slug}` })),
    ];
  } catch {
    return entries;
  }
}
