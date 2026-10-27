import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-xl border border-line bg-white px-3 py-3 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-navy/30 focus:ring-2 focus:ring-navy/15 sm:py-2.5 sm:text-sm";

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40";

export const btnLight =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/35 transition hover:bg-white/20";

export const btnOnDark =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

export const btnOutlineLight =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/50 transition hover:bg-white/10";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1380px] px-4 sm:px-6", className)}>{children}</div>;
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-3xl bg-white p-4 shadow-[0_18px_50px_-36px_rgba(12,35,64,0.85)] ring-1 ring-navy/5 sm:rounded-[28px] sm:p-6", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  eyebrow,
  href,
  action = "View all",
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p> : null}
        <h2 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-semibold text-navy hover:text-navy-soft">
          {action} <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <header className="overflow-hidden rounded-3xl bg-navy px-5 py-7 text-white sm:rounded-[28px] sm:px-10 sm:py-10">
      {crumbs?.length ? (
        <p className="mb-3 flex flex-wrap gap-x-1 text-sm text-white/65">
          {crumbs.map((crumb, index) => (
            <span key={crumb.href}>
              {index > 0 ? " / " : null}
              <Link href={crumb.href} className="hover:text-white">
                {crumb.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{eyebrow}</p> : null}
      <h1 className="mt-2 max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">{description}</p> : null}
    </header>
  );
}

export function MedicalNote() {
  return (
    <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-ink/80">
      This page is for general awareness. It is not a diagnosis or a personal treatment plan. Book a consultation for advice about your own care.
    </p>
  );
}

export function MediaImage({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 640px",
  objectPosition = "center",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  objectPosition?: string;
}) {
  return (
    <div className={cn(fill ? "absolute inset-0" : "relative", "overflow-hidden bg-[#d5e1ea]", className)}>
      {src ? (
        src.startsWith("http") ? (
          // Remote posters, such as a YouTube thumbnail, are not passed through the image optimiser.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition }} />
        ) : (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition }} />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#123252] via-[#3e6d86] to-[#e6d3b4]" />
      )}
    </div>
  );
}
