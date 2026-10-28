import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Container, MediaImage, PageHero } from "@/components/public/ui";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const [items, settings] = await Promise.all([
    prisma.achievement.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);
  const meetings = items.filter((item) => /Prime Minister|Chief Minister/.test(item.title));
  const rest = items.filter((item) => !meetings.includes(item));

  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero
        eyebrow="Recognition"
        title="Achievements"
        description={settings?.achievementQuote}
        crumbs={[{ href: "/", label: "Home" }, { href: "/achievements", label: "Achievements" }]}
      />

      {meetings.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">With the Prime Minister and the Chief Minister</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {meetings.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-navy/5">
                {item.image ? <MediaImage src={item.image} alt={item.title} className="aspect-[4/3] w-full" /> : null}
                <div className="p-6">
                  {item.subtitle ? <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{item.subtitle}</p> : null}
                  <h3 className="mt-1 text-xl font-semibold text-navy">{item.title}</h3>
                  {item.description ? <p className="mt-3 text-sm leading-6 text-ink/80">{item.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-navy">Certificates and honours</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-navy/5">
              {item.image ? <MediaImage src={item.image} alt={item.title} className="aspect-[16/10] w-full" /> : null}
              <div className="p-6">
                {item.image ? null : (
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-navy">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                )}
                {item.subtitle ? <p className={`${item.image ? "" : "mt-4"} text-[11px] font-semibold uppercase tracking-[0.16em] text-muted`}>{item.subtitle}</p> : null}
                <h3 className="mt-1 text-xl font-semibold text-navy">{item.value ? `${item.value} ${item.title}` : item.title}</h3>
                {item.description ? <p className="mt-3 text-sm leading-6 text-ink/80">{item.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
