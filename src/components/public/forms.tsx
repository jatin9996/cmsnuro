"use client";

import { useActionState, useEffect, useState } from "react";
import { createAppointment, createInquiry, type FormState } from "@/actions/public";
import { btnPrimary, fieldClass } from "@/components/public/ui";
import { formatTime, todayISO } from "@/lib/utils";

const initial: FormState = {};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-semibold text-navy">{label}</span>
      {children}
    </label>
  );
}

export function BookForm({ concerns, initialConcern = "", note }: { concerns: string[]; initialConcern?: string; note?: string }) {
  const [state, action, pending] = useActionState(createAppointment, initial);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const max = new Date();
  max.setDate(max.getDate() + 90);
  const maxDate = `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, "0")}-${String(max.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (!date) return;
    let ignore = false;
    setLoading(true);
    setTime("");
    fetch(`/api/appointments/slots?date=${date}`)
      .then((response) => response.json())
      .then((payload: { slots: { time: string; available: boolean }[]; closed: boolean }) => {
        if (ignore) return;
        setSlots(payload.slots);
        setClosed(payload.closed);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [date]);

  if (state.id) {
    return (
      <div className="rounded-3xl bg-white p-5 text-center shadow-[0_20px_50px_-36px_rgba(12,35,64,0.8)] sm:rounded-[28px] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Request received</p>
        <h2 className="mt-2 text-2xl font-semibold text-navy">Your appointment request is with the clinic</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Reference {state.id}. The team will confirm the time by phone or email. This is not a confirmed booking until you hear back.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-white p-4 shadow-[0_20px_50px_-36px_rgba(12,35,64,0.8)] sm:rounded-[28px] sm:p-8">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input name="name" required className={fieldClass} />
        </Field>
        <Field label="Mobile number">
          <input name="phone" required inputMode="tel" placeholder="98765 43210" className={fieldClass} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required className={fieldClass} />
        </Field>
        <Field label="Concern">
          <select name="concern" defaultValue={initialConcern || concerns[0]} className={fieldClass}>
            {concerns.map((concern) => (
              <option key={concern}>{concern}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date">
          <input name="date" type="date" required min={todayISO()} max={maxDate} value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="Message">
          <input name="message" placeholder="Anything the clinic should know" className={fieldClass} />
        </Field>
      </div>
      <div>
        <p className="text-sm font-semibold text-navy">Preferred time</p>
        <input type="hidden" name="time" value={time} />
        {!date ? <p className="mt-2 text-sm text-muted">Choose a date to see open times.</p> : null}
        {loading ? <p className="mt-2 text-sm text-muted">Checking the diary…</p> : null}
        {closed ? <p className="mt-2 text-sm text-muted">The clinic is closed on that day.</p> : null}
        <div className="mt-3 grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => setTime(slot.time)}
              className={`min-h-11 rounded-xl px-2 py-2 text-sm font-semibold ${time === slot.time ? "bg-navy text-white" : "bg-canvas text-navy"} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {formatTime(slot.time)}
            </button>
          ))}
        </div>
      </div>
      {note ? <p className="text-sm text-muted">{note}</p> : null}
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <button className={`${btnPrimary} w-full sm:w-auto`} disabled={pending || !time}>
        {pending ? "Sending…" : "Request appointment"}
      </button>
    </form>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(createInquiry, initial);
  if (state.id) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_50px_-36px_rgba(12,35,64,0.8)]">
        <h2 className="text-2xl font-semibold text-navy">Message received</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Reference {state.id}. The clinic will reply using the phone number you shared.</p>
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-white p-4 shadow-[0_20px_50px_-36px_rgba(12,35,64,0.8)] sm:rounded-[28px] sm:p-8">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Field label="Full name"><input name="name" required className={fieldClass} /></Field>
      <Field label="Mobile number"><input name="phone" required className={fieldClass} /></Field>
      <Field label="Subject"><input name="subject" required className={fieldClass} /></Field>
      <Field label="Message"><textarea name="message" required rows={5} className={fieldClass} /></Field>
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <button className={`${btnPrimary} w-full sm:w-auto`} disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
