import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Container, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const treatmentsFallback = {
  title: "Brain and Spine Treatments | Dr. Kairav Shah, Ahmedabad",
  description: "Conditions treated at NEUROKALP, including migraine, spine pain, brain tumours, head injury, and trigeminal neuralgia.",
  keywords: "brain treatment Ahmedabad, spine treatment Ahmedabad, neurosurgery clinic, NEUROKALP",
  h1: "Conditions We Treat",
  h2: "Brain, spine, and nervous system care",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/treatments", treatmentsFallback);
}

export default async function TreatmentsPage() {
  const [conditions, meta] = await Promise.all([
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/treatments", treatmentsFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Care" title={meta.h1} h2={meta.h2} description="Brain, spine, and nervous system conditions. Choose a topic to read a general overview, then book a consultation for personal advice." crumbs={[{ href: "/", label: "Home" }, { href: "/treatments", label: "Treatments" }]} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {conditions.map((item) => (
          <Link key={item.id} href={`/treatments/${item.slug}`} className="flex gap-4 rounded-[28px] bg-white p-5 ring-1 ring-navy/5 hover:shadow-lg">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cream text-navy"><Icon name={item.icon} className="h-6 w-6" /></span>
            <span>
              <span className="block text-lg font-semibold text-navy">{item.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{item.summary}</span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
