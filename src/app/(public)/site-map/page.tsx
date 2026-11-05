import type { Metadata } from "next";

import Link from "next/link";
import { Container, PageHero } from "@/components/public/ui";
import { NAV } from "@/lib/nav";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const sitemapFallback = {
  title: "Sitemap | NEUROKALP",
  description: "A list of the public pages on the NEUROKALP website.",
  keywords: "NEUROKALP sitemap, Dr. Kairav Shah pages",
  h1: "Sitemap",
  h2: "Public pages on this website",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/site-map", sitemapFallback);
}

export default async function SitemapPage() {
  const [conditions, posts, pages, meta] = await Promise.all([
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.post.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.page.findMany({ where: { published: true, slug: { notIn: ["about", "privacy", "terms"] } }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/site-map", sitemapFallback),
  ]);
  const groups = [
    { title: "Main", links: [...NAV, { href: "/videos", label: "Videos" }, { href: "/book", label: "Book" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
    { title: "Treatments", links: conditions.map((item) => ({ href: `/treatments/${item.slug}`, label: item.title })) },
    { title: "Articles", links: posts.map((item) => ({ href: `/blog/${item.slug}`, label: item.title })) },
    { title: "More pages", links: pages.map((item) => ({ href: `/p/${item.slug}`, label: item.title })) },
  ];
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={meta.h1} h2={meta.h2} description="Every public page on this website." crumbs={[{ href: "/", label: "Home" }, { href: "/site-map", label: "Sitemap" }]} />
      <div className="grid gap-4 md:grid-cols-2">
        {groups.filter((group) => group.links.length).map((group) => (
          <section key={group.title} className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5">
            <h2 className="text-lg font-semibold text-navy">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm font-medium text-navy hover:underline">{link.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
