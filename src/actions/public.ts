"use server";

import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { buildSlots, isClosedDay } from "@/lib/slots";
import { normalizePhone, parseISODate, todayISO } from "@/lib/utils";
import { appointmentSchema, inquirySchema } from "@/lib/validators";

export type FormState = { error?: string; id?: string };

export async function createAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("company") || "")) return { id: "received" };

  const parsed = appointmentSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    date: formData.get("date"),
    time: formData.get("time"),
    concern: formData.get("concern"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { error: "Enter a valid 10-digit mobile number." };

  const settings = await getSettings();
  if (!settings) return { error: "Appointments are not available yet." };

  const chosen = parseISODate(parsed.data.date);
  const today = parseISODate(todayISO());
  const latest = new Date(today);
  latest.setDate(latest.getDate() + 90);
  if (chosen < today || chosen > latest) return { error: "Choose a date within the next 90 days." };
  if (isClosedDay(settings, parsed.data.date)) return { error: "The clinic is closed on that day." };

  const taken = await prisma.appointment.findMany({
    where: { date: parsed.data.date, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { time: true },
  });
  const slot = buildSlots(settings, parsed.data.date, taken.map((item) => item.time)).find((item) => item.time === parsed.data.time);
  if (!slot?.available) return { error: "That time is no longer available. Please choose another." };

  const appointment = await prisma.appointment.create({
    data: { ...parsed.data, phone, status: "PENDING" },
  });
  return { id: appointment.id.slice(-8).toUpperCase() };
}

export async function createInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("company") || "")) return { id: "received" };
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return { error: "Enter a valid 10-digit mobile number." };
  const inquiry = await prisma.inquiry.create({ data: { ...parsed.data, phone } });
  return { id: inquiry.id.slice(-8).toUpperCase() };
}
