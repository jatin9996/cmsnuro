import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, PageHero, Panel } from "@/components/public/ui";
import { getPage, getSettings } from "@/lib/queries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, page, stats, conditions] = await Promise.all([
    getSettings(),
    getPage("about"),
    prisma.stat.findMany({ where: { published: true, group: "about" }, orderBy: { sortOrder: "asc" } }),
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!settings) return null;

  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow={settings.aboutEyebrow} title={settings.doctorName} description={settings.aboutDegrees} crumbs={[{ href: "/", label: "Home" }, { href: "/about", label: "About" }]} />
      <Panel>
        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
          <MediaImage src={settings.aboutImage} alt={`${settings.doctorName}, ${settings.roleTitle}`} className="h-80 w-full rounded-[24px]" />
          <div>
            <p className="text-sm font-semibold text-navy">{settings.roleTitle}</p>
            <p className="mt-4 text-sm leading-7 text-ink/85">{settings.aboutBio}</p>
            <blockquote className="mt-4 font-serif text-xl italic text-navy">“{settings.aboutQuote}”</blockquote>
          </div>
        </div>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-[24px] bg-white p-4 ring-1 ring-navy/5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream text-navy"><Icon name={item.icon} className="h-5 w-5" /></span>
            <span>
              <span className="block text-sm font-semibold text-navy">{item.value || item.label}</span>
              {item.value ? <span className="block text-xs text-muted">{item.label}</span> : null}
            </span>
          </div>
        ))}
      </div>
      {page ? (
        <Panel>
          <RichText text={page.content} />
        </Panel>
      ) : null}
      <Panel>
        <h2 className="text-xl font-semibold text-navy">Conditions treated</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {conditions.map((item) => (
            <Link key={item.id} href={`/treatments/${item.slug}`} className="rounded-2xl bg-canvas px-4 py-3 text-sm font-semibold text-navy">
              {item.title}
            </Link>
          ))}
        </div>
      </Panel>
    </Container>
  );
}
