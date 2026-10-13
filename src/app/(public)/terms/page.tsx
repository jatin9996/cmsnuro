import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, PageHero } from "@/components/public/ui";
import { getPage } from "@/lib/queries";

export const metadata: Metadata = { title: "Terms and conditions" };

export default async function TermsPage() {
  const page = await getPage("terms");
  if (!page) notFound();
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero title={page.title} description={page.excerpt} crumbs={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms" }]} />
      <article className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5 sm:p-8"><RichText text={page.content} /></article>
    </Container>
  );
}
