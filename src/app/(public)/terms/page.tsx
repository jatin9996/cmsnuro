import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, PageHero } from "@/components/public/ui";
import { getPage } from "@/lib/queries";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const termsFallback = {
  title: "Terms and Conditions | NEUROKALP",
  description: "Terms for using the NEUROKALP website, including appointment requests and health information.",
  keywords: "NEUROKALP terms, website terms, clinic information",
  h1: "Terms and Conditions",
  h2: "Using this website",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/terms", termsFallback);
}

export default async function TermsPage() {
  const [page, meta] = await Promise.all([getPage("terms"), resolvePageMeta("/terms", termsFallback)]);
  if (!page) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={meta.h1 || page.title} h2={meta.h2} description={page.excerpt} crumbs={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms" }]} />
      <article className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8"><RichText text={page.content} /></article>
    </Container>
  );
}
