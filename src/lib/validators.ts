import { z } from "zod";
import type { Field } from "@/lib/admin/resources";

export function schemaFor(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    id: z.string().trim().optional().or(z.literal("")),
  };

  for (const field of fields) {
    if (field.type === "checkbox") {
      shape[field.name] = z.boolean().default(false);
      continue;
    }
    if (field.type === "number") {
      shape[field.name] = z.coerce.number().int().default(0);
      continue;
    }
    if (field.type === "date") {
      const date = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, `Choose a valid ${field.label.toLowerCase()}.`);
      shape[field.name] = field.required ? date : date.or(z.literal("")).default("");
      continue;
    }
    const max = field.max ?? (field.type === "textarea" ? 20000 : 500);
    const text = z.string().trim().max(max, `${field.label} is too long.`);
    shape[field.name] = field.required ? text.min(1, `${field.label} is required.`) : text.optional().default("");
  }

  return z.object(shape);
}

const requiredText = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const settingsSchema = z.object({
  doctorName: requiredText(2, 80),
  roleTitle: requiredText(2, 120),
  tagline: requiredText(2, 160),
  phone: requiredText(8, 20),
  phoneDisplay: requiredText(8, 30),
  whatsapp: requiredText(8, 20),
  email: z.string().trim().email("Enter a valid email address."),
  address: requiredText(2, 240),
  mapUrl: optionalText(500),
  heroEyebrow: requiredText(2, 120),
  heroTitle: requiredText(2, 180),
  heroSubtitle: requiredText(2, 400),
  heroQuote: requiredText(2, 240),
  heroQuoteAuthor: requiredText(2, 80),
  aboutEyebrow: requiredText(2, 40),
  aboutDegrees: requiredText(2, 180),
  aboutBio: requiredText(2, 2000),
  aboutQuote: requiredText(2, 300),
  aboutImage: optionalText(500),
  ctaTitle: requiredText(2, 160),
  ctaSubtitle: requiredText(2, 300),
  ctaImage: optionalText(500),
  achievementQuote: requiredText(2, 300),
  instagramHandle: optionalText(80),
  facebookUrl: optionalText(300),
  instagramUrl: optionalText(300),
  linkedinUrl: optionalText(300),
  youtubeUrl: optionalText(300),
  xUrl: optionalText(300),
  dayStart: z.string().regex(/^\d{2}:\d{2}$/, "Use a start time."),
  dayEnd: z.string().regex(/^\d{2}:\d{2}$/, "Use an end time."),
  lunchStart: z.string().regex(/^\d{2}:\d{2}$/, "Use a lunch start."),
  lunchEnd: z.string().regex(/^\d{2}:\d{2}$/, "Use a lunch end."),
  slotMinutes: z.coerce.number().int().min(10).max(180),
  closedWeekdays: z.string().regex(/^[0-6](,[0-6])*$/).or(z.literal("")),
  bookingNote: optionalText(400),
  seoTitle: optionalText(160),
  seoDescription: optionalText(320),
  seoKeywords: optionalText(500),
  seoImage: optionalText(500),
  googleVerification: optionalText(200),
  seoIndex: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const appointmentSchema = z.object({
  name: requiredText(2, 80),
  phone: requiredText(8, 20),
  email: z.string().trim().email("Enter a valid email address."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time."),
  concern: requiredText(2, 120),
  message: optionalText(2000),
});

export const inquirySchema = z.object({
  name: requiredText(2, 80),
  phone: requiredText(8, 20),
  email: z.string().trim().email("Enter a valid email address."),
  subject: requiredText(2, 140),
  message: requiredText(10, 4000),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
