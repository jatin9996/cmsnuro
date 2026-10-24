import type { Metadata } from "next";
import type { SeoTag, SiteSetting } from "@prisma/client";

const reservedNames = new Set([
  "description",
  "keywords",
  "robots",
  "viewport",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
]);

const reservedProperties = new Set(["og:title", "og:description", "og:image", "og:type", "og:site_name"]);

export function siteMetadata(settings: SiteSetting, tags: SeoTag[] = []): Metadata {
  const title = settings.seoTitle.trim() || `${settings.doctorName} · ${settings.roleTitle}`;
  const description = settings.seoDescription.trim() || settings.heroSubtitle;
  const keywords = settings.seoKeywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const image = settings.seoImage.trim();
  const verification = settings.googleVerification.trim();
  const other: Record<string, string> = {};

  for (const tag of tags) {
    if (tag.attribute !== "name" || !tag.key || !tag.content) continue;
    const key = tag.key.toLowerCase();
    if (reservedNames.has(key)) continue;
    if (key === "google-site-verification" && verification) continue;
    other[tag.key] = tag.content;
  }

  return {
    title: { default: title, template: `%s · ${settings.doctorName}` },
    description,
    keywords: keywords.length ? keywords : undefined,
    robots: settings.seoIndex ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      siteName: settings.doctorName,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    verification: verification ? { google: verification } : undefined,
    other: Object.keys(other).length ? other : undefined,
  };
}

export function propertyTags(tags: SeoTag[]) {
  return tags.filter(
    (tag) => tag.attribute === "property" && tag.key && tag.content && !reservedProperties.has(tag.key.toLowerCase()),
  );
}

export function contentMetadata(input: {
  fallbackTitle: string;
  seoTitle?: string | null;
  description?: string | null;
  image?: string | null;
}): Metadata {
  const title = input.seoTitle?.trim();
  const description = input.description?.trim();
  const image = input.image?.trim();
  return {
    title: title ? { absolute: title } : input.fallbackTitle,
    description: description || undefined,
    openGraph: {
      title: title || input.fallbackTitle,
      description: description || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}
