import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, MedicalNote, PageHero } from "@/components/public/ui";
import { getPost } from "@/lib/queries";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const fallback = {
    title: post?.seoTitle || (post ? `${post.title} | Dr. Kairav Shah` : "Article"),
    description: post?.seoDescription || post?.excerpt || "",
    keywords: post ? `${post.title}, ${post.category}, Dr. Kairav Shah, NEUROKALP` : "",
    h1: post?.title || "Article",
    h2: post?.excerpt || "A note for patients and families",
  };
  const meta = await metadataFor(`/blog/${slug}`, fallback);
  if (!post?.coverImage) return meta;
  return { ...meta, openGraph: { ...((meta.openGraph as object) || {}), images: [{ url: post.coverImage }] } };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const meta = await resolvePageMeta(`/blog/${slug}`, {
    title: post.title,
    h1: post.title,
    h2: post.excerpt,
  });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow={post.category} title={meta.h1} h2={meta.h2} description={`${formatDate(post.publishedOn)}${post.author ? ` · ${post.author}` : ""}`} crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { href: `/blog/${post.slug}`, label: post.title }]} />
      <article className="mx-auto max-w-3xl space-y-6 rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8">
        <MediaImage src={post.coverImage} alt="" className="h-72 w-full rounded-3xl" />
        <RichText text={post.content} />
        <MedicalNote />
      </article>
    </Container>
  );
}
