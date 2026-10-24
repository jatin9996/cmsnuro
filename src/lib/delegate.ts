import { prisma } from "@/lib/db";

export type ContentModel =
  | "heroSlide"
  | "stat"
  | "condition"
  | "patientStory"
  | "achievement"
  | "video"
  | "pressItem"
  | "galleryItem"
  | "post"
  | "socialUpdate"
  | "page"
  | "seoTag";

export type ContentRow = Record<string, unknown> & { id: string; sortOrder: number };

type ContentApi = {
  findMany: (args: { orderBy: { sortOrder: "asc" } }) => Promise<ContentRow[]>;
  findUnique: (args: { where: { slug: string } | { id: string } }) => Promise<{ id: string } | null>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

export function contentDelegate(model: ContentModel) {
  return prisma[model] as unknown as ContentApi;
}
