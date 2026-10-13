import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Container, PageHero } from "@/components/public/ui";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const [items, settings] = await Promise.all([
    prisma.achievement.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Recognition" title="Achievements" description={settings?.achievementQuote} crumbs={[{ href: "/", label: "Home" }, { href: "/achievements", label: "Achievements" }]} />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-[28px] bg-white p-6 ring-1 ring-navy/5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-navy"><Icon name={item.icon} className="h-5 w-5" /></span>
            <h2 className="mt-4 text-xl font-semibold text-navy">{item.value ? `${item.value} ${item.title}` : item.title}</h2>
            {item.subtitle ? <p className="mt-1 text-sm text-muted">{item.subtitle}</p> : null}
            {item.description ? <p className="mt-3 text-sm leading-6 text-ink/80">{item.description}</p> : null}
          </article>
        ))}
      </div>
    </Container>
  );
}
