import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
console.log(
  "SETTINGS",
  JSON.stringify(
    {
      email: settings?.email,
      mapUrl: settings?.mapUrl,
      instagramUrl: settings?.instagramUrl,
      youtubeUrl: settings?.youtubeUrl,
      address: settings?.address,
    },
    null,
    2,
  ),
);
const videos = await prisma.video.findMany({
  where: { published: true },
  orderBy: { sortOrder: "asc" },
  select: { title: true, sourceUrl: true, thumbnail: true, featured: true, sortOrder: true },
});
console.log("VIDEOS", videos.length);
for (const video of videos) {
  console.log(`${video.sortOrder} | ${video.title} | ${(video.sourceUrl || "NO URL").slice(0, 70)} | ${video.thumbnail || "NO THUMB"}`);
}
const achievements = await prisma.achievement.findMany({
  where: { published: true },
  orderBy: { sortOrder: "asc" },
  select: { title: true, image: true, subtitle: true },
});
console.log("ACHIEVEMENTS", achievements.length);
for (const item of achievements) {
  console.log(`${item.image ? "IMG" : "---"} | ${item.title} | ${item.subtitle}`);
}
await prisma.$disconnect();
