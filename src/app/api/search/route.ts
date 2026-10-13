import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim().toLowerCase();
  if (query.length < 2) return NextResponse.json({ results: [] });

  const [conditions, stories, posts, videos] = await Promise.all([
    prisma.condition.findMany({ where: { published: true }, select: { title: true, slug: true, summary: true } }),
    prisma.patientStory.findMany({ where: { published: true }, select: { name: true, condition: true, quote: true } }),
    prisma.post.findMany({ where: { published: true }, select: { title: true, slug: true, excerpt: true } }),
    prisma.video.findMany({ where: { published: true }, select: { title: true, slug: true, description: true } }),
  ]);

  const includes = (...values: string[]) => values.some((value) => value.toLowerCase().includes(query));
  const results = [
    ...conditions
      .filter((item) => includes(item.title, item.summary))
      .map((item) => ({ type: "Treatment", title: item.title, href: `/treatments/${item.slug}`, meta: item.summary })),
    ...posts
      .filter((item) => includes(item.title, item.excerpt))
      .map((item) => ({ type: "Article", title: item.title, href: `/blog/${item.slug}`, meta: item.excerpt })),
    ...videos
      .filter((item) => includes(item.title, item.description))
      .map((item) => ({ type: "Video", title: item.title, href: `/videos#${item.slug}`, meta: item.description })),
    ...stories
      .filter((item) => includes(item.name, item.condition, item.quote))
      .map((item) => ({ type: "Story", title: item.name, href: "/patient-stories", meta: item.condition })),
  ].slice(0, 8);

  return NextResponse.json({ results });
}
