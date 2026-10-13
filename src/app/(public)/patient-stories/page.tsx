import type { Metadata } from "next";
import { PlayOverlay } from "@/components/public/overlays";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Patient stories" };

export default async function StoriesPage() {
  const stories = await prisma.patientStory.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Stories" title="Patient stories" description="Published only with consent. These samples should be replaced before the website goes live." crumbs={[{ href: "/", label: "Home" }, { href: "/patient-stories", label: "Patient stories" }]} />
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
