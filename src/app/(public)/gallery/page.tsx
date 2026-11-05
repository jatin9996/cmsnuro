import type { Metadata } from "next";

import { GalleryBrowser } from "@/components/public/overlays";
import { Container, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const galleryFallback = {
  title: "Gallery | NEUROKALP, Ahmedabad",
  description: "Photographs from the clinic, operating theatre, conferences, and community work at NEUROKALP.",
  keywords: "NEUROKALP gallery, neurosurgery clinic Ahmedabad, Dr. Kairav Shah photographs",
  h1: "Moments That Inspire",
  h2: "Clinic, theatre, and community",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/gallery", galleryFallback);
}

export default async function GalleryPage() {
  const [items, meta] = await Promise.all([
    prisma.galleryItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/gallery", galleryFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Gallery" title={meta.h1} h2={meta.h2} description="The hospital, operating theatre, meetings, and community work." crumbs={[{ href: "/", label: "Home" }, { href: "/gallery", label: "Gallery" }]} />
      <div className="rounded-[28px] bg-white p-5 ring-1 ring-navy/5 sm:p-6">
        <GalleryBrowser items={items.map((item) => ({ id: item.id, title: item.title, caption: item.caption, image: item.image, category: item.category }))} />
      </div>
    </Container>
  );
}
