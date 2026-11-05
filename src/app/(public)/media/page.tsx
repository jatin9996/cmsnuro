import type { Metadata } from "next";

import { PlayOverlay } from "@/components/public/overlays";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const mediaFallback = {
  title: "Media and Press | Dr. Kairav Shah",
  description: "Interviews, articles, and films featuring Dr. Kairav Shah and NEUROKALP.",
  keywords: "Dr. Kairav Shah media, neurosurgery interview, NEUROKALP press",
  h1: "Media and Press",
  h2: "Interviews, articles, and films",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/media", mediaFallback);
}

export default async function MediaPage() {
  const [press, videos, meta] = await Promise.all([
    prisma.pressItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/media", mediaFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="In the news" title={meta.h1} h2={meta.h2} description="Interviews, articles, and films." crumbs={[{ href: "/", label: "Home" }, { href: "/media", label: "Media" }]} />
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
