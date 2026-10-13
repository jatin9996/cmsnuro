"use client";

import { CalendarCheck, ExternalLink, LayoutDashboard, LogOut, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { Icon } from "@/components/icon";
import { LogoMark } from "@/components/logo";
import { resources } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "LayoutDashboard" }],
  },
  {
    label: "Clinic",
    items: [
      { href: "/admin/appointments", label: "Appointments", icon: "CalendarCheck" },
      { href: "/admin/messages", label: "Messages", icon: "MessageSquare" },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/settings", label: "Site settings", icon: "Settings" },
      ...resources.map((resource) => ({ href: `/admin/content/${resource.slug}`, label: resource.title, icon: resource.icon })),
    ],
  },
];

const glyphs = { LayoutDashboard, CalendarCheck, MessageSquare, Settings };

function NavGroups({ pathname }: { pathname: string }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.label} className="grid gap-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{group.label}</p>
          {group.items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href;
            const Glyph = glyphs[item.icon as keyof typeof glyphs];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10", active && "bg-white/15 font-semibold text-white")}
              >
                {Glyph ? <Glyph className="h-4 w-4" /> : <Icon name={item.icon} className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function AdminShell({ name, email, children }: { name: string; email: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas md:flex">
      <div className="bg-navy text-white md:hidden">
        <details>
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold">
            Admin menu
            <span className="text-xs font-medium text-white/60">Open</span>
          </summary>
          <div className="grid max-h-[70dvh] gap-4 overflow-y-auto px-3 pb-4">
            <NavGroups pathname={pathname} />
          </div>
        </details>
      </div>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-navy p-4 text-white md:block">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <LogoMark className="h-9 w-9" />
          <span>
            <span className="block text-sm font-semibold">Clinic admin</span>
            <span className="block text-[11px] text-white/60">Content and bookings</span>
          </span>
        </Link>
        <div className="grid gap-5">
          <NavGroups pathname={pathname} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" target="_blank" className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold text-navy hover:bg-canvas sm:px-3">
              <span className="hidden sm:inline">View site</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
            <form action={logout}>
              <button className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold text-navy hover:bg-canvas sm:px-3">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
