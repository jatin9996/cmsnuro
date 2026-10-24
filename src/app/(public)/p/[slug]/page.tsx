import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, PageHero } from "@/components/public/ui";
import { getPage } from "@/lib/queries";
import { contentMetadata } from "@/lib/seo";

const reserved: Record<string, string> = { about: "/about", privacy: "/privacy", terms: "/terms" };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return contentMetadata({
    fallbackTitle: page?.title ?? "Page",
    seoTitle: page?.seoTitle,
    description: page?.seoDescription || page?.excerpt,
  });
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (reserved[slug]) redirect(reserved[slug]);
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={page.title} description={page.excerpt} crumbs={[{ href: "/", label: "Home" }, { href: `/p/${page.slug}`, label: page.title }]} />
      <article className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8"><RichText text={page.content} /></article>
    </Container>
  );
}
