import type { SiteSetting } from "@prisma/client";
import { Phone } from "lucide-react";
import Link from "next/link";
import { LogoMark, WhatsAppIcon } from "@/components/logo";
import { Container } from "@/components/public/ui";
import { NAV } from "@/lib/nav";
import { whatsappLink } from "@/lib/utils";

type Settings = Omit<SiteSetting, "updatedAt">;

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    instagram: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm8.2 1.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 8.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2z",
    facebook: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z",
    x: "M6 6l5.1 6.6L6.4 18H8l3.6-4.2L15 18h3l-5.3-6.9L17.5 6H16l-3.3 3.9L10 6H6z",
    linkedin: "M7 9H4v11h3V9zM5.5 4A1.8 1.8 0 1 0 5.5 7.6 1.8 1.8 0 0 0 5.5 4zM20 13.4c0-2.6-1.4-4.4-3.8-4.4-1.3 0-2.2.7-2.6 1.4h-.1V9H11v11h3v-5.5c0-1.5.7-2.4 2-2.4s1.7.8 1.7 2.4V20h3v-6.6z",
    youtube: "M21 8.2a3 3 0 0 0-2.1-2.1C17.2 5.7 12 5.7 12 5.7s-5.2 0-6.9.4A3 3 0 0 0 3 8.2 31 31 0 0 0 2.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.7.4 6.9.4 6.9.4s5.2 0 6.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10.5 14.8V9.2L15.2 12l-4.7 2.8z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

export function SiteFooter({ settings }: { settings: Settings }) {
  const message = `Hello ${settings.doctorName}, I would like to enquire about a consultation.`;
  const chat = whatsappLink(settings.whatsapp, message);
  const socials = [
    { name: "facebook", href: settings.facebookUrl, label: "Facebook" },
    { name: "instagram", href: settings.instagramUrl || `https://instagram.com/${settings.instagramHandle.replace("@", "")}`, label: "Instagram" },
    { name: "x", href: settings.xUrl, label: "X" },
    { name: "linkedin", href: settings.linkedinUrl, label: "LinkedIn" },
    { name: "youtube", href: settings.youtubeUrl, label: "YouTube" },
  ].filter((item) => item.href);

  return (
    <>
      <footer className="bg-[#08182c] pb-[calc(4.75rem+env(safe-area-inset-bottom))] text-white xl:pb-0">
        <Container className="grid gap-8 py-10 lg:grid-cols-[1.2fr_2fr] lg:items-center">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <span>
              <span className="block font-semibold">{settings.doctorName}</span>
              <span className="block text-xs text-white/60">{settings.roleTitle}</span>
              <span className="block text-xs text-white/60">{settings.tagline}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80">
            {NAV.filter((item) => item.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
        <Container className="flex flex-col gap-4 border-t border-white/10 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {socials.map((item) => (
                <a key={item.name} href={item.href} aria-label={item.label} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                  <SocialIcon name={item.name} />
                </a>
              ))}
            </div>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/site-map" className="hover:text-white">Sitemap</Link>
          </div>
          <p>© {new Date().getFullYear()} {settings.doctorName}. All rights reserved.</p>
          <p>Designed with care for better lives.</p>
        </Container>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-16px_40px_-28px_rgba(12,35,64,0.85)] backdrop-blur-md xl:hidden">
        <div className="grid grid-cols-3">
          <a href={`tel:${settings.phone}`} className="flex min-h-14 items-center justify-center gap-1.5 text-sm font-semibold text-navy">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a href={chat} className="flex min-h-14 items-center justify-center gap-1.5 border-x border-line text-sm font-semibold text-navy">
            <WhatsAppIcon className="h-4 w-4 text-[#128C7E]" /> WhatsApp
          </a>
          <Link href="/book" className="flex min-h-14 items-center justify-center bg-navy text-sm font-semibold text-white">
            Book
          </Link>
        </div>
      </div>
      <a href={chat} className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 shadow-[0_16px_40px_-20px_rgba(12,35,64,0.8)] ring-1 ring-navy/5 xl:flex">
        <span>
          <span className="block text-sm font-semibold text-navy">Chat with us</span>
          <span className="block text-xs text-muted">We&apos;re here to help</span>
        </span>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon className="h-6 w-6" />
        </span>
      </a>
    </>
  );
}
