import type { Metadata } from "next";

import Link from "next/link";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";
import { formatDate } from "@/lib/utils";

const blogFallback = {
  title: "Brain and Spine Articles | Dr. Kairav Shah",
  description: "Patient guides on brain tumour symptoms, spine surgery, and early stroke signs from NEUROKALP, Ahmedabad.",
  keywords: "brain tumour symptoms, spine surgery, stroke signs, neurosurgery blog Ahmedabad",
  h1: "Blog and Health Notes",
  h2: "Guides for patients and families",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/blog", blogFallback);
}

export default async function BlogPage() {
  const [posts, meta] = await Promise.all([
    prisma.post.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { publishedOn: "desc" }] }),
    resolvePageMeta("/blog", blogFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Insights" title={meta.h1} h2={meta.h2} description="Short articles for patients and families. They are not a substitute for a consultation." crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} />
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
