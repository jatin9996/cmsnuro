import type { Metadata } from "next";

import { VideoLibrary } from "@/components/public/video-library";
import { Container, MedicalNote, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const videosFallback = {
  title: "Talks and Reels | Dr. Kairav Shah",
  description: "YouTube talks and Instagram reels from Dr. Kairav Shah on brain and spine health.",
  keywords: "neurosurgery talks, Dr. Kairav Shah YouTube, brain health videos, spine education",
  h1: "Talks and Reels",
  h2: "Films on brain and spine health",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/videos", videosFallback);
}

export default async function VideosPage() {
  const [talks, meta] = await Promise.all([
    prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/videos", videosFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero
        eyebrow="Watch"
        title={meta.h1}
        h2={meta.h2}
        description="YouTube talks and Instagram reels from the clinic. New films are added from the admin panel."
        crumbs={[{ href: "/", label: "Home" }, { href: "/videos", label: "Talks" }]}
      />
      <VideoLibrary
        talks={talks.map((talk) => ({
          id: talk.id,
          slug: talk.slug,
          title: talk.title,
          description: talk.description,
          thumbnail: talk.thumbnail,
          sourceUrl: talk.sourceUrl,
          duration: talk.duration,
          category: talk.category,
        }))}
      />
      <MedicalNote />
    </Container>
  );
}
