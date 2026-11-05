import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function databaseUrl() {
  const url = process.env.DATABASE_URL || "";
  if (!url.startsWith("postgres")) return url;
  if (/[?&]connection_limit=/.test(url)) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}connection_limit=1&pool_timeout=20&connect_timeout=15`;
}

const url = databaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
  });

globalForPrisma.prisma = prisma;

const transientCodes = new Set(["P1001", "P1002", "P1008", "P1017", "P2024", "P2034"]);

export async function withDb<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      last = error;
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      const message = error instanceof Error ? error.message : "";
      const transient = transientCodes.has(code) || /can't reach database|connection|timeout|closed/i.test(message);
      if (!transient || attempt === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw last;
}
