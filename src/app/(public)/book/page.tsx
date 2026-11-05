import type { Metadata } from "next";
import { BookForm } from "@/components/public/forms";
import { Container, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";
import { describeHours } from "@/lib/utils";

const bookFallback = {
  title: "Book an Appointment | Dr. Kairav Shah, Ahmedabad",
  description: "Request a consultation at NEUROKALP. The clinic confirms the time by phone. Sunday is closed.",
  keywords: "book neurosurgeon Ahmedabad, NEUROKALP appointment, Dr. Kairav Shah consultation",
  h1: "Book an Appointment",
  h2: "Request a consultation at NEUROKALP",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/book", bookFallback);
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ concern?: string }> }) {
  const [{ concern }, settings, conditions, meta] = await Promise.all([
    searchParams,
    getSettings(),
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, select: { title: true } }),
    resolvePageMeta("/book", bookFallback),
  ]);
  if (!settings) return null;
  const hours = describeHours(settings);
  const concerns = ["General consultation", ...conditions.map((item) => item.title), "Other"];
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero
        eyebrow="Appointments"
        title={meta.h1}
        h2={meta.h2}
        description={`Consulting hours ${hours.hours}. A request is confirmed only after the clinic contacts you.`}
        crumbs={[{ href: "/", label: "Home" }, { href: "/book", label: "Book" }]}
      />
      <BookForm concerns={concerns} initialConcern={concern} note={settings.bookingNote} />
    </Container>
  );
}
