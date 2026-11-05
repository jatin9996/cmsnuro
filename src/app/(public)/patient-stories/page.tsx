import type { Metadata } from "next";

import { PlayOverlay } from "@/components/public/overlays";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";

const storiesFallback = {
  title: "Patient Stories | NEUROKALP, Ahmedabad",
  description: "Stories shared with consent by people treated for brain and spine conditions at NEUROKALP.",
  keywords: "patient stories neurosurgery, NEUROKALP experiences, brain surgery recovery stories",
  h1: "Patient Stories",
  h2: "Experiences shared with consent",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/patient-stories", storiesFallback);
}

export default async function StoriesPage() {
  const [stories, meta] = await Promise.all([
    prisma.patientStory.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    resolvePageMeta("/patient-stories", storiesFallback),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Stories" title={meta.h1} h2={meta.h2} description="Published only with consent. These samples should be replaced before the website goes live." crumbs={[{ href: "/", label: "Home" }, { href: "/patient-stories", label: "Patient stories" }]} />
      <div className="grid gap-5 lg:grid-cols-3">
        {stories.map((story) => {
          const card = (
            <article className="h-full rounded-[28px] bg-white p-4 ring-1 ring-navy/5">
              <MediaImage src={story.image} alt={story.name} className="aspect-[4/3] w-full rounded-2xl" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">{story.condition}</p>
              <h2 className="mt-1 text-lg font-semibold text-navy">{story.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/80">“{story.quote}”</p>
              {story.story ? <div className="mt-3"><RichText text={story.story} /></div> : null}
            </article>
          );
          return story.videoUrl ? <PlayOverlay key={story.id} title={story.name} src={story.videoUrl}>{card}</PlayOverlay> : <div key={story.id}>{card}</div>;
        })}
      </div>
    </Container>
  );
}
