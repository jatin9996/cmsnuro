import type { Metadata } from "next";
import { BookForm } from "@/components/public/forms";
import { Container, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { describeHours } from "@/lib/utils";

export const metadata: Metadata = { title: "Book an appointment" };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ concern?: string }> }) {
  const [{ concern }, settings, conditions] = await Promise.all([
    searchParams,
    getSettings(),
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, select: { title: true } }),
  ]);
  if (!settings) return null;
  const hours = describeHours(settings);
  const concerns = ["General consultation", ...conditions.map((item) => item.title), "Other"];
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero
        eyebrow="Appointments"
        title="Book an appointment"
        description={`Consulting hours ${hours.hours}. A request is confirmed only after the clinic contacts you.`}
        crumbs={[{ href: "/", label: "Home" }, { href: "/book", label: "Book" }]}
      />
      <BookForm concerns={concerns} initialConcern={concern} note={settings.bookingNote} />
    </Container>
  );
}
