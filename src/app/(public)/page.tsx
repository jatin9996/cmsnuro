import { HomeView } from "@/components/public/home-view";
import { getHomeData } from "@/lib/queries";

export default async function HomePage() {
  const data = await getHomeData();
  if (!data) return null;
  return <HomeView data={data} />;
}
