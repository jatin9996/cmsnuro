import { AppointmentsBoard } from "@/components/admin/boards";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/utils";

export default async function AppointmentsPage() {
  const items = await prisma.appointment.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] });
  return <AppointmentsBoard items={toPlain(items)} />;
}
