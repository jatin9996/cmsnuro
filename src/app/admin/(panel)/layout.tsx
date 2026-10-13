import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/current-user";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell name={session.name} email={session.email}>{children}</AdminShell>;
}
