import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/public/ui";
import { NAV } from "@/lib/nav";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Sitemap" };

export default async function SitemapPage() {
  const [conditions, posts, pages] = await Promise.all([
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.post.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.page.findMany({ where: { published: true, slug: { notIn: ["about", "privacy", "terms"] } }, orderBy: { sortOrder: "asc" } }),
  ]);
  const groups = [
    { title: "Main", links: [...NAV, { href: "/videos", label: "Videos" }, { href: "/book", label: "Book" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
    { title: "Treatments", links: conditions.map((item) => ({ href: `/treatments/${item.slug}`, label: item.title })) },
    { title: "Articles", links: posts.map((item) => ({ href: `/blog/${item.slug}`, label: item.title })) },
    { title: "More pages", links: pages.map((item) => ({ href: `/p/${item.slug}`, label: item.title })) },
  ];
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title="Sitemap" description="Every public page on this website." crumbs={[{ href: "/", label: "Home" }, { href: "/site-map", label: "Sitemap" }]} />
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
