import { getStore } from "@/lib/db";
import { MenuExperience } from "@/components/MenuExperience";

export default async function Home() {
  const { restaurant, products } = await getStore();
  return <MenuExperience restaurant={restaurant} products={[...products].sort((a,b) => a.sortOrder-b.sortOrder)} />;
}
