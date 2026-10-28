import type { Metadata } from "next";
import { BusinessCard } from "@/components/public/business-card";
import { ContactForm } from "@/components/public/forms";
import { Container, PageHero } from "@/components/public/ui";
import { getSettings } from "@/lib/queries";
import { describeHours } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  if (!settings) return null;
  const hours = describeHours(settings);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Contact" title="Talk to the clinic" description={settings.address} crumbs={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <BusinessCard
            details={{
              doctorName: settings.doctorName,
              roleTitle: settings.roleTitle,
              degrees: settings.aboutDegrees,
              tagline: settings.tagline,
              phone: settings.phone,
              whatsapp: settings.whatsapp,
              address: settings.address,
              mapUrl: settings.mapUrl,
              instagramUrl: settings.instagramUrl,
              youtubeUrl: settings.youtubeUrl,
              portrait: settings.aboutImage,
              hours: `Consulting hours ${hours.hours}. Lunch ${hours.lunch}. Closed: ${hours.closed}.`,
            }}
          />
          {settings.mapUrl ? (
            <iframe
              title="NEUROKALP on Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="h-52 w-full rounded-[28px] border-0 bg-white ring-1 ring-navy/5"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
