import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, PageHero } from "@/components/public/ui";
import { getPage } from "@/lib/queries";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const privacyFallback = {
  title: "Privacy Policy | NEUROKALP",
  description: "How NEUROKALP handles appointment requests, messages, and information shared through this website.",
  keywords: "NEUROKALP privacy policy, clinic data, appointment privacy",
  h1: "Privacy Policy",
  h2: "How this website handles information",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/privacy", privacyFallback);
}

export default async function PrivacyPage() {
  const [page, meta] = await Promise.all([getPage("privacy"), resolvePageMeta("/privacy", privacyFallback)]);
  if (!page) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={meta.h1 || page.title} h2={meta.h2} description={page.excerpt} crumbs={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]} />
      <article className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8"><RichText text={page.content} /></article>
    </Container>
  );
}
