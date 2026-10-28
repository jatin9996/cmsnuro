import type { Metadata } from "next";
import { VideoLibrary } from "@/components/public/video-library";
import { Container, MedicalNote, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Talks and reels" };

export default async function VideosPage() {
  const talks = await prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero
        eyebrow="Watch"
        title="Talks and reels"
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
