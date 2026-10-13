import Link from "next/link";
import { getDashboard } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";

export default async function DashboardPage() {
  const data = await getDashboard();
  const cards = [
    { label: "Pending requests", value: data.pending, href: "/admin/appointments" },
    { label: "Upcoming visits", value: data.upcoming, href: "/admin/appointments" },
    { label: "New messages", value: data.messages, href: "/admin/messages" },
    { label: "Live stories", value: data.stories, href: "/admin/content/stories" },
    { label: "Live videos", value: data.videos, href: "/admin/content/videos" },
    { label: "Live articles", value: data.posts, href: "/admin/content/blog" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Appointments, messages, and the content on the public website.</p>
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        The photographs, patient quotes, statistics, and press names are sample content from the design. Replace them with consented stories, real figures, and the doctor&apos;s own photograph before publishing.
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl bg-white p-5 ring-1 ring-navy/5">
            <p className="text-3xl font-semibold text-navy">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
      <section className="rounded-2xl bg-white p-5 ring-1 ring-navy/5">
        <h2 className="text-lg font-semibold text-navy">Recent appointment requests</h2>
        <div className="mt-3 divide-y divide-line">
          {data.appointments.map((item) => (
            <Link key={item.id} href="/admin/appointments" className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span>
                <span className="font-semibold text-navy">{item.name}</span>
                <span className="block text-muted">{item.concern}</span>
              </span>
              <span className="text-muted">{formatDate(item.date)} · {formatTime(item.time)} · {item.status}</span>
            </Link>
          ))}
          {data.appointments.length === 0 ? <p className="py-4 text-sm text-muted">No requests yet. They will appear here when someone uses the booking form.</p> : null}
        </div>
      </section>
    </div>
  );
}
