import { MessagesBoard } from "@/components/admin/boards";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/utils";

export default async function MessagesPage() {
  const items = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return <MessagesBoard items={toPlain(items)} />;
}
