"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/current-user";
import { getResource } from "@/lib/admin/resources";
import { contentDelegate, type ContentModel } from "@/lib/delegate";
import { settingsSchema } from "@/lib/validators";
import { schemaFor } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: true } | { ok: false; error: string };

const SLUG_MODELS = new Set<ContentModel>(["condition", "video", "post", "page"]);

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

async function uniqueSlug(model: ContentModel, source: string, currentId?: string) {
  const base = slugify(source) || "page";
  let slug = base;
  let suffix = 2;
  const delegate = contentDelegate(model);
  while (true) {
    const existing = await delegate.findUnique({ where: { slug } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${suffix++}`;
  }
}

export async function saveResource(resource: string, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const config = getResource(resource);
  if (!config) return { ok: false, error: "That section does not exist." };

  const parsed = schemaFor(config.fields).safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const id = typeof parsed.data.id === "string" && parsed.data.id ? parsed.data.id : undefined;
  const data: Record<string, unknown> = { ...parsed.data };
  delete data.id;

  if (config.hasSlug) {
    data.slug = await uniqueSlug(config.model, String(data.slug || data.title || "page"), id);
  }

  if (config.model === "seoTag") {
    const key = String(data.key);
    if (!/^[A-Za-z][A-Za-z0-9_:.\-]{0,79}$/.test(key)) {
      return { ok: false, error: "Tag name can use letters, numbers, colon, underscore, dot, and hyphen." };
    }
    if (data.attribute !== "name" && data.attribute !== "property") {
      return { ok: false, error: "Choose a tag type." };
    }
    const duplicate = await prisma.seoTag.findFirst({
      where: { key, attribute: String(data.attribute), ...(id ? { id: { not: id } } : {}) },
    });
    if (duplicate) return { ok: false, error: "That tag already exists. Edit the existing one." };
  }

  try {
    const delegate = contentDelegate(config.model);
    if (id) await delegate.update({ where: { id }, data });
    else await delegate.create({ data });
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not save that item. Check for a duplicate address." };
  }

  refresh();
  return { ok: true };
}

export async function deleteResource(resource: string, id: string): Promise<ActionResult> {
  await requireAdmin();
  const config = getResource(resource);
  if (!config || !id) return { ok: false, error: "That item could not be found." };
  await contentDelegate(config.model).delete({ where: { id } });
  refresh();
  return { ok: true };
}

export async function moveResource(resource: string, id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdmin();
  const config = getResource(resource);
  if (!config) return { ok: false, error: "That section does not exist." };

  const items = await contentDelegate(config.model).findMany({ orderBy: { sortOrder: "asc" } });
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return { ok: true };

  const ordered = [...items];
  const [item] = ordered.splice(index, 1);
  ordered.splice(target, 0, item);
  for (const [sortOrder, row] of ordered.entries()) {
    await contentDelegate(config.model).update({ where: { id: row.id }, data: { sortOrder } });
  }
  refresh();
  return { ok: true };
}

export async function saveSettings(
  _prev: { error?: string; saved?: boolean },
  formData: FormData,
): Promise<{ error?: string; saved?: boolean }> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const closedWeekdays = formData
    .getAll("closed")
    .map(String)
    .filter((value) => /^[0-6]$/.test(value))
    .sort()
    .join(",");
  const parsed = settingsSchema.safeParse({ ...raw, closedWeekdays });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the settings and try again." };
  }
  await prisma.siteSetting.update({ where: { id: 1 }, data: parsed.data });
  refresh();
  return { saved: true };
}
