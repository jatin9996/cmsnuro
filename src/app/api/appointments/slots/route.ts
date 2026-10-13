import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { buildSlots, isClosedDay } from "@/lib/slots";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [], closed: false });
  }
  const settings = await getSettings();
  if (!settings) return NextResponse.json({ slots: [], closed: false });

  const taken = await prisma.appointment.findMany({
    where: { date, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { time: true },
  });
  return NextResponse.json({
    closed: isClosedDay(settings, date),
    slots: buildSlots(settings, date, taken.map((item) => item.time)),
  });
}
