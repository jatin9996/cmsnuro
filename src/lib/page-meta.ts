import { cache } from "react";
import type { Metadata } from "next";
import { prisma, withDb } from "@/lib/db";
import { contentMetadata } from "@/lib/seo";

export type PageMetaFallback = {
  title: string;
  description?: string;
  keywords?: string;
  h1?: string;
  h2?: string;
};

export const getPageMeta = cache(async (path: string) => {
  try {
    return await withDb(() => prisma.pageMeta.findFirst({ where: { path, published: true } }));
  } catch (error) {
    console.error(error);
    return null;
  }
});

export async function resolvePageMeta(path: string, fallback: PageMetaFallback) {
  const row = await getPageMeta(path);
  return {
    title: row?.title.trim() || fallback.title,
    description: row?.description.trim() || fallback.description || "",
    keywords: row?.keywords.trim() || fallback.keywords || "",
    h1: row?.h1.trim() || fallback.h1 || fallback.title,
    h2: row?.h2.trim() || fallback.h2 || "",
  };
}

export async function metadataFor(path: string, fallback: PageMetaFallback): Promise<Metadata> {
  const meta = await resolvePageMeta(path, fallback);
  return contentMetadata({
    fallbackTitle: fallback.title,
    seoTitle: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  });
}
