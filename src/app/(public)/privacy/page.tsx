import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, PageHero } from "@/components/public/ui";
import { getPage } from "@/lib/queries";
import { contentMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy");
  return contentMetadata({
    fallbackTitle: "Privacy policy",
    seoTitle: page?.seoTitle,
    description: page?.seoDescription || page?.excerpt,
  });
}

export default async function PrivacyPage() {
  const page = await getPage("privacy");
  if (!page) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={page.title} description={page.excerpt} crumbs={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]} />
      <article className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8"><RichText text={page.content} /></article>
    </Container>
  );
}
