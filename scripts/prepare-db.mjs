import { spawnSync } from "node:child_process";
import fs from "node:fs";

const schemaPath = "prisma/schema.prisma";
const url = process.env.DATABASE_URL || "";
const postgres = url.startsWith("postgres://") || url.startsWith("postgresql://");

if (process.env.VERCEL && !postgres) {
  console.error(
    "Vercel cannot use the local SQLite file. In the Vercel project, add a Postgres database, set DATABASE_URL and DIRECT_URL, then redeploy.",
  );
  process.exit(1);
}

if (postgres) {
  let schema = fs.readFileSync(schemaPath, "utf8");
  schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
  if (!/directUrl\s*=/.test(schema)) {
    schema = schema.replace(
      /url\s*=\s*env\("DATABASE_URL"\)/,
      'url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")',
    );
  }
  if (!process.env.DIRECT_URL) process.env.DIRECT_URL = url;
  fs.writeFileSync(schemaPath, schema);
  console.log("Using PostgreSQL for this build.");
}

function run(command) {
  const result = spawnSync(command, { stdio: "inherit", shell: true, env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("npx prisma generate");
run("npx prisma db push");
run("npx tsx prisma/seed.ts");
