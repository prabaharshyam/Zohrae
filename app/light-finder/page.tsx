import type { Metadata } from "next";
import { LightFinder } from "@/components/finder/LightFinder";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Find your light",
  description: "Four questions about your room, your mood and your style. We'll find the lamp that's made for it.",
};

export default async function LightFinderPage() {
  const lamps = await getProducts({ collection: "lumiere" });
  return <LightFinder lamps={lamps} />;
}
