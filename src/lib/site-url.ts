/** Canonical production origin for SEO (sitemap, robots, JSON-LD). */
export const PRODUCTION_SITE_URL = "https://www.neurokalp.com";

/**
 * Always use the public production domain for crawlable SEO surfaces.
 * Vercel preview / project URLs must never appear in sitemap.xml or robots.txt.
 */
export function siteUrl() {
  return PRODUCTION_SITE_URL;
}
