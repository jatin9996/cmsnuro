"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { updateAppointment, updateInquiry } from "@/actions/clinic";
import { fieldClass } from "@/components/public/ui";
import { formatDate, formatTime } from "@/lib/utils";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  concern: string;
  message: string;
  status: string;
  notes: string;
  createdAt: string | Date;
};

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string | Date;
};

const appointmentStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const inquiryStatuses = ["NEW", "READ", "ARCHIVED"];

function statusClass(status: string) {
  if (status === "CONFIRMED" || status === "READ") return "bg-emerald-50 text-emerald-800";
  if (status === "CANCELLED" || status === "ARCHIVED") return "bg-slate-100 text-slate-600";
  if (status === "COMPLETED") return "bg-sky-50 text-sky-800";
  return "bg-amber-50 text-amber-800";
}

export function AppointmentsBoard({ items }: { items: Appointment[] }) {
  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");
  const [nextStatus, setNextStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const visible = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = status === "ALL" || item.status === status;
      const haystack = `${item.name} ${item.phone} ${item.email} ${item.concern}`.toLowerCase();
      return matchesStatus && haystack.includes(query.trim().toLowerCase());
    });
  }, [items, query, status]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Appointments</h1>
      <p className="mt-1 text-sm text-muted">Requests stay pending until you confirm them. Cancelling a visit frees that time for someone else.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["ALL", ...appointmentStatuses].map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === item ? "bg-navy text-white" : "bg-white text-navy"}`}>
            {item === "ALL" ? "All" : item[0] + item.slice(1).toLowerCase()}
          </button>
        ))}
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or phone" className={`${fieldClass} max-w-xs`} />
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-navy/5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Patient", "When", "Concern", "Status"].map((label) => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b border-line/80 last:border-0 hover:bg-canvas"
                onClick={() => {
                  setSelected(item);
                  setNotes(item.notes);
                  setNextStatus(item.status);
                  setError("");
                }}
              >
                <td className="px-4 py-3">
                  <span className="block font-semibold text-navy">{item.name}</span>
                  <span className="text-xs text-muted">{item.phone} · {item.email}</span>
                </td>
                <td className="px-4 py-3">{formatDate(item.date)} · {formatTime(item.time)}</td>
                <td className="px-4 py-3">{item.concern}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? <p className="px-4 py-8 text-sm text-muted">No appointment requests in this view.</p> : null}
      </div>
      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40">
          <button className="absolute inset-0" aria-label="Close appointment" onClick={() => setSelected(null)} />
          <div className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white p-4 pb-10 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Reference {selected.id.slice(-8).toUpperCase()}</p>
            <h2 className="mt-1 text-xl font-semibold text-navy">{selected.name}</h2>
            <p className="mt-2 text-sm text-muted">{selected.phone}<br />{selected.email}</p>
            <p className="mt-4 text-sm"><span className="font-semibold text-navy">When: </span>{formatDate(selected.date)} at {formatTime(selected.time)}</p>
            <p className="mt-2 text-sm"><span className="font-semibold text-navy">Concern: </span>{selected.concern}</p>
            {selected.message ? <p className="mt-2 text-sm leading-6">{selected.message}</p> : null}
            <label className="mt-5 grid gap-1.5 text-sm">
              <span className="font-semibold text-navy">Status</span>
              <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className={fieldClass}>
                {appointmentStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="mt-4 grid gap-1.5 text-sm">
              <span className="font-semibold text-navy">Internal notes</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className={fieldClass} />
            </label>
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            <button
              type="button"
              disabled={pending}
              className="mt-4 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
              onClick={() => startTransition(async () => {
                const result = await updateAppointment(selected.id, nextStatus, notes);
                if (!result.ok) setError(result.error);
                else {
                  setSelected(null);
                  router.refresh();
                }
              })}
            >
              {pending ? "Saving…" : "Save appointment"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MessagesBoard({ items }: { items: Inquiry[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Messages</h1>
      <p className="mt-1 text-sm text-muted">Questions sent from the contact page.</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-navy/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-navy">{item.subject}</h2>
                <p className="text-sm text-muted">{item.name} · {item.phone} · {item.email}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6">{item.message}</p>
            <p className="mt-2 text-xs text-muted">{formatDate(item.createdAt)}</p>
            <div className="mt-3 flex gap-2">
              {inquiryStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={pending || item.status === status}
                  onClick={() => startTransition(async () => { await updateInquiry(item.id, status); router.refresh(); })}
                  className="rounded-lg bg-canvas px-2.5 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                >
                  {status[0] + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </article>
        ))}
        {items.length === 0 ? <p className="text-sm text-muted">No messages yet.</p> : null}
      </div>
    </div>
  );
}
