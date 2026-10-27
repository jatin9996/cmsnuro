"use client";

import type { SiteSetting } from "@prisma/client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { changePassword, type AuthState } from "@/actions/auth";
import { saveSettings } from "@/actions/content";
import { MediaField } from "@/components/admin/media-field";
import { fieldClass } from "@/components/public/ui";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function SettingsForm({ settings }: { settings: Omit<SiteSetting, "updatedAt" | "id"> }) {
  const [state, action, pending] = useActionState(saveSettings, { error: undefined, saved: undefined });
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, {} as AuthState);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, String(value)])),
  );
  const [closed, setClosed] = useState(settings.closedWeekdays.split(",").filter(Boolean));

  function text(name: string, label: string, options?: { textarea?: boolean; type?: string }) {
    return (
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold text-navy">{label}</span>
        {options?.textarea ? (
          <textarea name={name} rows={5} value={values[name] ?? ""} onChange={(event) => setValues({ ...values, [name]: event.target.value })} className={fieldClass} />
        ) : (
          <input name={name} type={options?.type || "text"} value={values[name] ?? ""} onChange={(event) => setValues({ ...values, [name]: event.target.value })} className={fieldClass} />
        )}
      </label>
    );
  }

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-navy/5">
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Identity</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {text("doctorName", "Doctor name")}
            {text("roleTitle", "Role")}
            {text("tagline", "Tagline")}
            {text("aboutDegrees", "Degrees")}
          </div>
        </section>
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Contact</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {text("phoneDisplay", "Phone as shown")}
            {text("phone", "Phone link", { type: "tel" })}
            {text("whatsapp", "WhatsApp number")}
            {text("email", "Email", { type: "email" })}
            <div className="md:col-span-2">{text("address", "Clinic address")}</div>
            <div className="md:col-span-2">{text("mapUrl", "Google Maps link")}</div>
          </div>
        </section>
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Homepage words</h2>
          {text("heroEyebrow", "Hero eyebrow")}
          {text("heroTitle", "Hero title")}
          {text("heroSubtitle", "Hero introduction", { textarea: true })}
          <div className="grid gap-4 md:grid-cols-2">
            {text("heroQuote", "Hero quote")}
            {text("heroQuoteAuthor", "Quote by")}
          </div>
          {text("aboutEyebrow", "About label")}
          {text("aboutBio", "Short biography", { textarea: true })}
          {text("aboutQuote", "About quote")}
          <MediaField label="Portrait" name="aboutImage" kind="image" value={values.aboutImage ?? ""} onChange={(value) => setValues({ ...values, aboutImage: value })} help="Shown on the homepage and the About page. A vertical photograph of the doctor works best." />
          {text("ctaTitle", "Closing title")}
          {text("ctaSubtitle", "Closing text", { textarea: true })}
          <MediaField label="Closing photograph" name="ctaImage" kind="image" value={values.ctaImage ?? ""} onChange={(value) => setValues({ ...values, ctaImage: value })} />
          {text("achievementQuote", "Achievements quote")}
        </section>
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Social links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {text("instagramHandle", "Instagram handle")}
            {text("instagramUrl", "Instagram URL")}
            {text("facebookUrl", "Facebook URL")}
            {text("linkedinUrl", "LinkedIn URL")}
            {text("youtubeUrl", "YouTube URL")}
            {text("xUrl", "X URL")}
          </div>
        </section>
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Search and social</h2>
          <p className="text-sm text-muted">
            Google uses the title and description below. Leave either one blank to use the homepage wording. Extra tags, such as Open Graph locale, are added under{" "}
            <Link href="/admin/content/seo" className="font-semibold text-navy underline">SEO tags</Link>.
          </p>
          {text("seoTitle", "Google title")}
          {text("seoDescription", "Google description", { textarea: true })}
          {text("seoKeywords", "Keywords")}
          <p className="-mt-2 text-xs text-muted">Separate keywords with commas.</p>
          {text("googleVerification", "Google site verification")}
          <p className="-mt-2 text-xs text-muted">Paste the content value from Search Console, not the whole meta tag.</p>
          <MediaField
            label="Share image"
            name="seoImage"
            kind="image"
            value={values.seoImage ?? ""}
            onChange={(value) => setValues({ ...values, seoImage: value })}
            help="Shown when the homepage is shared. A wide image works best."
          />
          <input type="hidden" name="seoIndex" value={values.seoIndex === "false" ? "false" : "true"} />
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input
              type="checkbox"
              checked={values.seoIndex !== "false"}
              onChange={(event) => setValues({ ...values, seoIndex: event.target.checked ? "true" : "false" })}
            />
            Allow search engines to index this website
          </label>
        </section>
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-navy">Appointment diary</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {text("dayStart", "Day starts", { type: "time" })}
            {text("dayEnd", "Day ends", { type: "time" })}
            {text("lunchStart", "Lunch starts", { type: "time" })}
            {text("lunchEnd", "Lunch ends", { type: "time" })}
            {text("slotMinutes", "Minutes per visit", { type: "number" })}
          </div>
          <fieldset>
            <legend className="text-sm font-semibold text-navy">Closed days</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {WEEKDAYS.map((day, index) => (
                <label key={day} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="closed"
                    value={index}
                    checked={closed.includes(String(index))}
                    onChange={(event) => {
                      const value = String(index);
                      setClosed((current) => event.target.checked ? [...current, value] : current.filter((item) => item !== value));
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
          </fieldset>
          {text("bookingNote", "Note on the booking page")}
        </section>
        {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
        {state.saved ? <p className="text-sm font-medium text-emerald-700">Settings saved.</p> : null}
        <button disabled={pending} className="w-fit rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Saving…" : "Save settings"}
        </button>
      </form>

      <form action={passwordAction} className="grid max-w-md gap-4 rounded-3xl bg-white p-6 ring-1 ring-navy/5">
        <h2 className="text-lg font-semibold text-navy">Password</h2>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-navy">Current password</span>
          <input name="currentPassword" type="password" required className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-navy">New password</span>
          <input name="newPassword" type="password" required minLength={8} className={fieldClass} />
        </label>
        {passwordState.error ? <p className="text-sm text-red-700">{passwordState.error}</p> : null}
        {passwordState.saved ? <p className="text-sm text-emerald-700">Password updated.</p> : null}
        <button disabled={passwordPending} className="w-fit rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">
          Update password
        </button>
      </form>
    </div>
  );
}
