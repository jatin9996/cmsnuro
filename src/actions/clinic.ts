"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/current-user";

const APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
const INQUIRY_STATUSES = ["NEW", "READ", "ARCHIVED"] as const;

export async function updateAppointment(id: string, status: string, notes: string) {
  await requireAdmin();
  if (!APPOINTMENT_STATUSES.includes(status as (typeof APPOINTMENT_STATUSES)[number])) {
    return { ok: false as const, error: "Choose a valid status." };
  }
  await prisma.appointment.update({
    where: { id },
    data: { status, notes: notes.slice(0, 2000) },
  });
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

export async function updateInquiry(id: string, status: string) {
  await requireAdmin();
  if (!INQUIRY_STATUSES.includes(status as (typeof INQUIRY_STATUSES)[number])) {
    return { ok: false as const, error: "Choose a valid status." };
  }
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}
