"use client";

import type { SiteSetting } from "@prisma/client";
import { Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { btnPrimary, Container } from "@/components/public/ui";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Settings = Omit<SiteSetting, "updatedAt">;
type Result = { type: string; title: string; href: string; meta: string };

export function SiteHeader({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    setOpen(false);
    setSearching(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searching ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searching]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const payload = (await response.json()) as { results: Result[] };
      setResults(payload.results);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-2 sm:h-[76px] sm:gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <LogoMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold leading-tight text-navy sm:text-[15px]">{settings.doctorName}</span>
            <span className="block truncate text-[11px] leading-4 text-muted">{settings.roleTitle}</span>
            <span className="hidden truncate text-[11px] leading-4 text-navy/70 2xl:block">{settings.tagline}</span>
          </span>
        </Link>
        <nav className="ml-3 hidden min-w-0 flex-1 items-center justify-center gap-x-2.5 xl:flex 2xl:gap-x-3">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("whitespace-nowrap text-[13px] font-medium text-ink/80 hover:text-navy", active && "font-semibold text-navy")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-navy hover:bg-cream"
            aria-label="Search the site"
            onClick={() => setSearching(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <a href={`tel:${settings.phone}`} className="hidden items-center gap-2 whitespace-nowrap text-sm font-semibold text-navy xl:flex">
            <Phone className="h-4 w-4" />
            {settings.phoneDisplay}
          </a>
          <Link href="/book" className={cn(btnPrimary, "max-xl:!hidden whitespace-nowrap")}>
            Book Appointment
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-navy hover:bg-cream xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      {open ? (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white px-4 py-3 xl:hidden">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("block rounded-xl px-3 py-3 text-sm font-medium text-navy hover:bg-canvas", active && "bg-canvas font-semibold")}
              >
                {item.label}
              </Link>
            );
          })}
          <a href={`tel:${settings.phone}`} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-navy hover:bg-canvas">
            <Phone className="h-4 w-4" /> {settings.phoneDisplay}
          </a>
          <Link href="/book" className={cn(btnPrimary, "mt-2 w-full xl:!hidden")}>
            Book Appointment
          </Link>
        </nav>
      ) : null}
      {searching ? (
        <div className="fixed inset-0 z-50 bg-navy/50 p-3 sm:p-4" role="dialog" aria-modal="true" aria-label="Search">
          <button className="absolute inset-0" aria-label="Close search" onClick={() => setSearching(false)} />
          <div className="relative mx-auto mt-10 w-full max-w-xl rounded-3xl bg-white p-4 shadow-2xl sm:mt-16">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search treatments, articles, videos"
              className="w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy/15"
            />
            <div className="mt-3 grid max-h-80 gap-1 overflow-y-auto">
              {results.map((result) => (
                <Link key={`${result.type}-${result.href}-${result.title}`} href={result.href} className="rounded-2xl px-3 py-2 hover:bg-canvas">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{result.type}</span>
                  <span className="block text-sm font-semibold text-navy">{result.title}</span>
                </Link>
              ))}
              {query.trim().length >= 2 && results.length === 0 ? <p className="px-3 py-4 text-sm text-muted">No matches yet.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
