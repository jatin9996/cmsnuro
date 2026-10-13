import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/current-user";

export const runtime = "nodejs";

const TYPES: Record<string, { ext: string; folder: "images" | "videos"; max: number }> = {
  "image/jpeg": { ext: "jpg", folder: "images", max: 8 * 1024 * 1024 },
  "image/png": { ext: "png", folder: "images", max: 8 * 1024 * 1024 },
  "image/webp": { ext: "webp", folder: "images", max: 8 * 1024 * 1024 },
  "video/mp4": { ext: "mp4", folder: "videos", max: 80 * 1024 * 1024 },
  "video/webm": { ext: "webm", folder: "videos", max: 80 * 1024 * 1024 },
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to upload files." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file." }, { status: 400 });

  const rule = TYPES[file.type];
  if (!rule) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, MP4, or WEBM file." }, { status: 400 });
  }
  if (file.size > rule.max) {
    const limit = rule.folder === "images" ? "8 MB" : "80 MB";
    return NextResponse.json({ error: `That file is larger than ${limit}.` }, { status: 400 });
  }

  const filename = `${crypto.randomUUID()}.${rule.ext}`;
  const directory = path.join(process.cwd(), "public", "uploads", rule.folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${rule.folder}/${filename}` });
}
