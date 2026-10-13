import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, MedicalNote, PageHero } from "@/components/public/ui";
import { getPost } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "Article", description: post?.excerpt };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow={post.category} title={post.title} description={`${formatDate(post.publishedOn)}${post.author ? ` · ${post.author}` : ""}`} crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { href: `/blog/${post.slug}`, label: post.title }]} />
      <article className="mx-auto max-w-3xl space-y-6 rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8">
        <MediaImage src={post.coverImage} alt="" className="h-72 w-full rounded-3xl" />
        <RichText text={post.content} />
        <MedicalNote />
      </article>
    </Container>
  );
}
