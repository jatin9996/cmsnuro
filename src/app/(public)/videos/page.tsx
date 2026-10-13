import type { Metadata } from "next";
import { PlayOverlay } from "@/components/public/overlays";
import { Container, MediaImage, MedicalNote, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Videos" };

export default async function VideosPage() {
  const videos = await prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Watch" title="Latest videos" description="Short films that explain conditions and recovery. Upload new ones from the admin panel." crumbs={[{ href: "/", label: "Home" }, { href: "/videos", label: "Videos" }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <PlayOverlay key={video.id} title={video.title} src={video.sourceUrl}>
            <article id={video.slug} className="rounded-[28px] bg-white p-3 ring-1 ring-navy/5">
              <div className="relative">
                <MediaImage src={video.thumbnail} alt="" className="aspect-video w-full rounded-2xl" />
                {video.duration ? <span className="absolute bottom-2 right-2 rounded bg-navy/80 px-2 py-0.5 text-xs text-white">{video.duration}</span> : null}
              </div>
              <h2 className="mt-3 text-base font-semibold text-navy">{video.title}</h2>
              {video.description ? <p className="mt-1 text-sm text-muted">{video.description}</p> : null}
            </article>
          </PlayOverlay>
        ))}
      </div>
      <MedicalNote />
    </Container>
  );
}
