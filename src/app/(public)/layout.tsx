import type { Metadata } from "next";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SetupScreen } from "@/components/setup-screen";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  if (!settings) return { title: "Clinic website" };
  return {
    title: {
      default: `${settings.doctorName} · ${settings.roleTitle}`,
      template: `%s · ${settings.doctorName}`,
    },
    description: settings.heroSubtitle,
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  if (!settings) return <SetupScreen />;
  const { updatedAt: _updatedAt, ...publicSettings } = settings;
  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <SiteHeader settings={publicSettings} />
      <main id="content" className="flex-1">{children}</main>
      <SiteFooter settings={publicSettings} />
    </>
  );
}
