import type { Metadata } from "next";
import { HomeView } from "@/components/public/home-view";
import { metadataFor, resolvePageMeta } from "@/lib/page-meta";
import { getHomeData } from "@/lib/queries";

const homeFallback = {
  title: "Neurosurgeon in Ahmedabad | Dr. Kairav Shah | NEUROKALP",
  description: "Consultant neurosurgeon in Ahmedabad for brain and spine conditions. Consultations at NEUROKALP, Ellisbridge.",
  keywords: "neurosurgeon Ahmedabad, brain surgeon Ahmedabad, spine surgeon Ahmedabad, Dr. Kairav Shah, NEUROKALP",
  h1: "Advanced Neurosurgery for a Healthier Tomorrow",
  h2: "Brain and spine care at NEUROKALP",
};

export function generateMetadata(): Promise<Metadata> {
  return metadataFor("/", homeFallback);
}

export default async function HomePage() {
  const [data, meta] = await Promise.all([getHomeData(), resolvePageMeta("/", homeFallback)]);
  if (!data) return null;
  return <HomeView data={data} heading={{ h1: meta.h1, h2: meta.h2 }} />;
}
