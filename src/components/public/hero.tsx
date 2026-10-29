"use client";

import { Calendar, Phone, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/logo";
import { btnGhost, btnOnDark, MediaImage } from "@/components/public/ui";
import { cn, whatsappLink } from "@/lib/utils";

type Slide = { image: string; alt: string; quote: string };

export function Hero({
  slides,
  eyebrow,
  title,
  subtitle,
  quote,
  author,
  phone,
  whatsapp,
  portrait,
  portraitAlt,
}: {
  slides: Slide[];
  eyebrow: string;
  title: string;
  subtitle: string;
  quote: string;
  author: string;
  phone: string;
  whatsapp: string;
  portrait?: string;
  portraitAlt?: string;
}) {
  const [active, setActive] = useState(0);
  const count = Math.max(slides.length, 1);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const shownQuote = slides[active]?.quote || quote;
  const message = `Hello, I would like to inquire about a consultation.`;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[28px] bg-navy text-white sm:rounded-[32px]">
      {slides.map((slide, index) => (
        <MediaImage
          key={slide.image + index}
          src={slide.image}
          alt={slide.alt}
          priority={index === 0}
          fill
          sizes="(max-width: 1280px) 100vw, 800px"
          className={cn("transition-opacity duration-700", index === active ? "opacity-100" : "opacity-0")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/55 to-navy/25 sm:bg-gradient-to-r sm:from-navy/85 sm:via-navy/45 sm:to-navy/15" />
      <div className={cn("relative z-10 flex min-w-0 flex-col justify-center px-4 py-7 pb-10 sm:px-8 sm:py-10 lg:px-12 lg:pr-20", portrait && "xl:pr-52")}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">{eyebrow}</p>
        <h1 className="mt-3 max-w-xl whitespace-pre-line text-balance text-[1.65rem] font-semibold leading-[1.08] tracking-tight min-[380px]:text-[1.85rem] sm:mt-4 sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:mt-4 sm:text-base">{subtitle}</p>
        <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-6">
          <Link href="/book" className={`${btnOnDark} w-full min-[420px]:w-auto`}>
            <Calendar className="h-4 w-4" /> Book Appointment
          </Link>
          <Link href="/videos" className={`${btnGhost} min-h-11 w-full min-[420px]:w-auto`}>
            <Play className="h-4 w-4 fill-current" /> Watch Video
          </Link>
        </div>
        <blockquote className="mt-6 max-w-md font-serif text-xl leading-snug italic text-white sm:mt-8 sm:text-2xl">
          “{shownQuote}”
          <footer className="mt-3 text-sm font-sans not-italic text-white/75">— {author}</footer>
        </blockquote>
        {count > 1 ? (
          <div className="mt-8 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.image + index}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={cn("h-2.5 w-2.5 rounded-full", index === active ? "bg-white" : "bg-white/40")}
              />
            ))}
          </div>
        ) : null}
      </div>
      {portrait ? (
        <figure className="pointer-events-none absolute bottom-8 right-6 z-20 hidden w-40 xl:block">
          <div className="overflow-hidden rounded-[28px] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] ring-4 ring-white">
            <MediaImage src={portrait} alt={portraitAlt || author} objectPosition="center 18%" className="aspect-[3/4] w-full" />
          </div>
        </figure>
      ) : null}
      <div className="absolute right-4 top-5 z-20 hidden flex-col gap-3 lg:flex">
        <a href={whatsappLink(whatsapp, message)} aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-2xl bg-[#25D366] text-white shadow-lg">
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <a href={`tel:${phone}`} aria-label="Call the clinic" className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-navy shadow-lg">
          <Phone className="h-5 w-5" />
        </a>
        <Link href="/book" aria-label="Book an appointment" className="grid h-11 w-11 place-items-center rounded-2xl bg-navy text-white shadow-lg ring-1 ring-white/20">
          <Calendar className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
