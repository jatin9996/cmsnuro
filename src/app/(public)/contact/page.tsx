import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/public/forms";
import { Container, PageHero } from "@/components/public/ui";
import { getSettings } from "@/lib/queries";
import { describeHours, whatsappLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  if (!settings) return null;
  const hours = describeHours(settings);
  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Contact" title="Talk to the clinic" description={settings.address} crumbs={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[28px] bg-white p-6 ring-1 ring-navy/5">
          <a href={`tel:${settings.phone}`} className="flex items-start gap-3 text-sm"><Phone className="mt-0.5 h-4 w-4 text-navy" /><span><span className="block font-semibold text-navy">Phone</span>{settings.phoneDisplay}</span></a>
          <a href={whatsappLink(settings.whatsapp)} className="mt-4 flex items-start gap-3 text-sm"><Phone className="mt-0.5 h-4 w-4 text-navy" /><span><span className="block font-semibold text-navy">WhatsApp</span>{settings.whatsapp}</span></a>
          <p className="mt-4 flex items-start gap-3 text-sm"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy" /><span><span className="block font-semibold text-navy">Clinic</span>{settings.address}</span></p>
          {settings.mapUrl ? <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block pl-7 text-sm font-semibold text-navy underline">NEUROKALP on Google</a> : null}
          <p className="mt-4 text-sm leading-6 text-muted">Consulting hours {hours.hours}. Lunch {hours.lunch}. Closed: {hours.closed}.</p>
          {settings.mapUrl ? (
            <iframe
              title="NEUROKALP on Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="mt-5 h-52 w-full rounded-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
        </aside>
        <ContactForm />
      </div>
    </Container>
  );
}
