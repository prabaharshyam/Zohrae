import { Atelier } from "@/components/home/Atelier";
import { Circle } from "@/components/home/Circle";
import { CollectionGrid } from "@/components/home/CollectionGrid";
import { Conscious } from "@/components/home/Conscious";
import { Hero } from "@/components/home/Hero";
import { LampChapters } from "@/components/home/LampChapters";
import { Preloader } from "@/components/home/Preloader";
import { ShopTheRoom } from "@/components/home/ShopTheRoom";
import { Teasers } from "@/components/home/Teasers";
import { ValuesBand } from "@/components/home/ValuesBand";
import { Vessels } from "@/components/home/Vessels";
import { WhyLight } from "@/components/home/WhyLight";
import { getProducts } from "@/lib/commerce";

/**
 * Home: one continuous story, chapter by chapter.
 * Intro → hero → spotlight chapters → the full collection → why light matters → the atelier →
 * vessels → conscious luxury → gifts & weddings → shop the room → the Circle.
 */
export default async function HomePage() {
  const [lamps, vessels, planters] = await Promise.all([
    getProducts({ collection: "lumiere" }),
    getProducts({ collection: "vases-vessels" }),
    getProducts({ collection: "planters" }),
  ]);
  // Merchandising by tag: one "signature" lamp for the hero, up to five
  // "featured" lamps for the scrolling chapters, every lamp in the grid.
  const hero = lamps.find((p) => p.tags.includes("signature")) ?? lamps[0];
  const featured = lamps.filter((p) => p.tags.includes("featured") && p !== hero).slice(0, 5);

  return (
    <>
      <Preloader />
      {hero && <Hero product={hero} />}
      <LampChapters lamps={featured} />
      <CollectionGrid lamps={lamps} />
      <WhyLight />
      <Atelier />
      <Vessels products={[...vessels, ...planters]} />
      <Conscious />
      <Teasers />
      <ShopTheRoom products={lamps} />
      <ValuesBand />
      <Circle />
    </>
  );
}
