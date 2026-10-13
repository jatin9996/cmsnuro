import type { Metadata } from "next";
import Link from "next/link";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { publishedOn: "desc" }] });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Insights" title="Blog and health notes" description="Short articles for patients and families. They are not a substitute for a consultation." crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-navy/5">
            <MediaImage src={post.coverImage} alt="" className="h-44 w-full" />
            <span className="block p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{post.category} · {formatDate(post.publishedOn)}</span>
              <span className="mt-2 block text-lg font-semibold text-navy">{post.title}</span>
              <span className="mt-2 block text-sm leading-6 text-muted">{post.excerpt}</span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
