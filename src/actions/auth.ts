"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/current-user";
import { safeAdminPath } from "@/lib/utils";
import { SESSION_COOKIE, sessionCookie, signSession } from "@/lib/session";

export type AuthState = { error?: string; saved?: boolean };

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    const matches = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!admin || !matches) return { error: "That email and password do not match." };

    const token = await signSession({ id: admin.id, email: admin.email, name: admin.name });
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, sessionCookie);
  } catch (error) {
    console.error(error);
    return { error: "The database is not ready. Run npm run setup in the project folder." };
  }

  redirect(safeAdminPath(String(formData.get("next") || "")));
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function changePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await requireAdmin();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  if (newPassword.length < 8) return { error: "Use at least 8 characters for the new password." };

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    return { error: "The current password is not correct." };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  return { saved: true };
}
