/** Canonical production origin used for SEO surfaces (sitemap, robots). */
export const PRODUCTION_SITE_URL = "https://www.neurokalp.com";

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv;
  return PRODUCTION_SITE_URL;
}
