/** Canonical production origin for SEO (sitemap, robots, JSON-LD). */
export const PRODUCTION_SITE_URL = "https://www.neurokalp.com";

/**
 * Always use the public production domain for crawlable SEO surfaces.
 * Vercel preview / project URLs must never appear in sitemap.xml or robots.txt.
 */
export function siteUrl() {
  return PRODUCTION_SITE_URL;
}

/** Absolute canonical URL for a public path (home keeps a trailing slash). */
export function canonicalUrl(path: string) {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return `${PRODUCTION_SITE_URL}/`;
  const normalized = trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") : `/${trimmed.replace(/\/+$/, "")}`;
  return `${PRODUCTION_SITE_URL}${normalized}`;
}
