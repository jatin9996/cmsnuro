"use client";

import { Calendar, Camera, MapPin, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/logo";
import { whatsappLink } from "@/lib/utils";

type CardDetails = {
  doctorName: string;
  roleTitle: string;
  degrees: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  portrait: string;
  hours?: string;
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm8.2 1.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 8.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21 8.2a3 3 0 0 0-2.1-2.1C17.2 5.7 12 5.7 12 5.7s-5.2 0-6.9.4A3 3 0 0 0 3 8.2 31 31 0 0 0 2.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.7.4 6.9.4 6.9.4s5.2 0 6.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10.5 14.8V9.2L15.2 12l-4.7 2.8z" />
    </svg>
  );
}

function saveContact(details: CardDetails) {
  const [given = "", ...rest] = details.doctorName.replace(/^Dr\.?\s+/i, "").split(" ");
  const family = rest.join(" ");
  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${family};${given};;;`,
    `FN:${details.doctorName}`,
    "ORG:NEUROKALP",
    `TITLE:${details.roleTitle}`,
    `TEL;TYPE=WORK,VOICE:${details.phone}`,
    `ADR;TYPE=WORK:;;${details.address.replace(/\r?\n/g, " ")};;;;`,
    details.mapUrl ? `URL:${details.mapUrl}` : "URL:https://share.google/bPjyfXDk5ssH3NUBl",
    "END:VCARD",
  ].join("\r\n");
  const file = new Blob([card], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "NEUROKALP.vcf";
  link.click();
  URL.revokeObjectURL(url);
}

export function BusinessCard({ details }: { details: CardDetails }) {
  const chat = whatsappLink(details.whatsapp, `Hello ${details.doctorName}, I would like to inquire about a consultation.`);
  const actions = [
    { label: "Call", href: `tel:${details.phone}`, icon: <Phone className="h-5 w-5" />, className: "bg-[#1f9d55]" },
    { label: "WhatsApp", href: chat, icon: <WhatsAppIcon className="h-5 w-5" />, className: "bg-[#25D366]", external: true },
    details.instagramUrl
      ? { label: "Instagram", href: details.instagramUrl, icon: <InstagramIcon className="h-5 w-5" />, className: "bg-[#d62976]", external: true }
      : null,
    details.youtubeUrl
      ? { label: "YouTube", href: details.youtubeUrl, icon: <YouTubeIcon className="h-5 w-5" />, className: "bg-[#e11d2e]", external: true }
      : null,
    details.mapUrl
      ? { label: "Google", href: details.mapUrl, icon: <MapPin className="h-5 w-5" />, className: "bg-[#1a73e8]", external: true }
      : null,
    { label: "Photos", href: "/gallery", icon: <Camera className="h-5 w-5" />, className: "bg-navy" },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-36px_rgba(12,35,64,0.85)] ring-1 ring-navy/10">
      <div className="flex items-center gap-3 bg-[#163a78] px-5 py-4 text-white">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#163a78]">
          <Image src="/media/neurokalp-logo.jpg" alt="" fill sizes="56px" className="object-cover" />
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold tracking-[0.14em]">NEUROKALP</span>
          <span className="block text-[11px] uppercase tracking-[0.16em] text-white/70">{details.tagline}</span>
        </span>
      </div>

      <div className="flex items-center gap-3 px-5 pt-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-navy">{details.doctorName}</h2>
          <p className="mt-0.5 text-sm font-medium text-[#1a4f8b]">{details.degrees}</p>
          <p className="mt-1 text-xs text-muted">{details.roleTitle}</p>
        </div>
        {details.portrait ? (
          <span className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full ring-2 ring-navy/10">
            <Image src={details.portrait} alt="" fill sizes="72px" className="object-cover object-[center_18%]" />
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Tap an icon to connect</p>
      <div className="px-4 pb-2 pt-2">
        <div className="relative mx-auto aspect-square w-full max-w-[300px]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="150" cy="150" r="104" fill="none" stroke="#d7e3ef" strokeWidth="18" />
          </svg>
          <span className="absolute left-1/2 top-1/2 grid h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full bg-[#163a78] shadow-md ring-4 ring-white">
            <span className="relative h-14 w-14">
              <Image src="/media/neurokalp-logo.jpg" alt="NEUROKALP" fill sizes="56px" className="object-contain" />
            </span>
          </span>
          {actions.map((action, index) => {
            const angle = (360 / actions.length) * index - 90;
            const className = `absolute left-1/2 top-1/2 grid h-12 w-12 place-items-center rounded-full text-white shadow-md ring-4 ring-white transition hover:scale-105 ${action.className}`;
            const style = { transform: `translate(-50%, -50%) rotate(${angle}deg) translate(104px) rotate(${-angle}deg)` };
            return action.external ? (
              <a key={action.label} href={action.href} target="_blank" rel="noreferrer" aria-label={action.label} title={action.label} className={className} style={style}>
                {action.icon}
              </a>
            ) : (
              <Link key={action.label} href={action.href} aria-label={action.label} title={action.label} className={className} style={style}>
                {action.icon}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5">
        <button type="button" onClick={() => saveContact(details)} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-navy hover:bg-canvas">
          <UserRound className="h-6 w-6 text-[#1a73e8]" />
          <span className="text-xs font-semibold">Save Contact</span>
        </button>
        <Link href="/book" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-navy hover:bg-canvas">
          <Calendar className="h-6 w-6 text-[#7c3aed]" />
          <span className="text-xs font-semibold">Book Appointment</span>
        </Link>
      </div>

      <div className="m-5 mt-3 rounded-2xl bg-[#eef5fb] px-4 py-3 text-sm leading-5 text-navy">
        {details.mapUrl ? (
          <a href={details.mapUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d2e]" />
            <span>{details.address}</span>
          </a>
        ) : (
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d2e]" />
            <span>{details.address}</span>
          </p>
        )}
        {details.hours ? <p className="mt-2 pl-6 text-xs leading-5 text-muted">{details.hours}</p> : null}
      </div>
    </article>
  );
}
