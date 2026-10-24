import { cache } from "react";
import { prisma } from "@/lib/db";
import { contentDelegate, type ContentModel } from "@/lib/delegate";

export const getSettings = cache(async () => {
  try {
    return await prisma.siteSetting.findUnique({ where: { id: 1 } });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getSeoTags = cache(async () => {
  try {
    return await prisma.seoTag.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error(error);
    return [];
  }
});

export async function getHomeData() {
  const settings = await getSettings();
  if (!settings) return null;
  const [slides, stats, conditions, stories, achievements, videos, press, gallery, posts, social] = await Promise.all([
    prisma.heroSlide.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.stat.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.condition.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.patientStory.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.achievement.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.video.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.pressItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.galleryItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.post.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { publishedOn: "desc" }] }),
    prisma.socialUpdate.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return { settings, slides, stats, conditions, stories, achievements, videos, press, gallery, posts, social };
}

export async function getPage(slug: string) {
  return prisma.page.findFirst({ where: { slug, published: true } });
}

export async function getCondition(slug: string) {
  return prisma.condition.findFirst({ where: { slug, published: true } });
}

export async function getPost(slug: string) {
  return prisma.post.findFirst({ where: { slug, published: true } });
}

export function listResource(model: ContentModel) {
  return contentDelegate(model).findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getDashboard() {
  const start = new Date();
  const today = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
  const [pending, upcoming, messages, stories, videos, posts, appointments] = await Promise.all([
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { date: { gte: today }, status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.patientStory.count({ where: { published: true } }),
    prisma.video.count({ where: { published: true } }),
    prisma.post.count({ where: { published: true } }),
    prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  return { pending, upcoming, messages, stories, videos, posts, appointments };
}
