import type { Metadata } from "next";
import { PlayOverlay } from "@/components/public/overlays";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const [press, videos] = await Promise.all([
    prisma.pressItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="In the news" title="Media and press" description="Interviews, articles, and films." crumbs={[{ href: "/", label: "Home" }, { href: "/media", label: "Media" }]} />
      <div className="grid gap-4 md:grid-cols-2">
        {press.map((item) => (
          <article key={item.id} className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{item.outlet}{item.dateLabel ? ` · ${item.dateLabel}` : ""}</p>
            <h2 className="mt-2 text-xl font-semibold text-navy">{item.title}</h2>
            {item.excerpt ? <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p> : null}
            {item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-navy">Read the article →</a> : null}
          </article>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <PlayOverlay key={video.id} title={video.title} src={video.sourceUrl}>
            <article className="rounded-[28px] bg-white p-3 ring-1 ring-navy/5">
              <MediaImage src={video.thumbnail} alt="" className="aspect-video w-full rounded-2xl" />
              <h2 className="mt-3 text-sm font-semibold text-navy">{video.title}</h2>
            </article>
          </PlayOverlay>
        ))}
      </div>
    </Container>
  );
}
