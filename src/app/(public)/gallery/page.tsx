import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/public/overlays";
import { Container, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Gallery" title="Moments that inspire" description="The hospital, operating theatre, meetings, and community work." crumbs={[{ href: "/", label: "Home" }, { href: "/gallery", label: "Gallery" }]} />
      <div className="rounded-[28px] bg-white p-5 ring-1 ring-navy/5 sm:p-6">
        <GalleryBrowser items={items.map((item) => ({ id: item.id, title: item.title, caption: item.caption, image: item.image, category: item.category }))} />
      </div>
    </Container>
  );
}
