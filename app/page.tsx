import { Atelier } from "@/components/home/Atelier";
import { Circle } from "@/components/home/Circle";
import { Conscious } from "@/components/home/Conscious";
import { Hero } from "@/components/home/Hero";
import { LumiereGallery } from "@/components/home/LumiereGallery";
import { Preloader } from "@/components/home/Preloader";
import { ShopTheRoom } from "@/components/home/ShopTheRoom";
import { Teasers } from "@/components/home/Teasers";
import { ValuesBand } from "@/components/home/ValuesBand";
import { Vessels } from "@/components/home/Vessels";
import { WhyLight } from "@/components/home/WhyLight";
import { getProduct, getProducts } from "@/lib/commerce";

/**
 * Home: one continuous story, chapter by chapter.
 * Intro → hero → the collection → why light matters → the atelier →
 * vessels → conscious luxury → gifts & weddings → shop the room → the Circle.
 */
export default async function HomePage() {
  const [hero, lamps, vessels, planters] = await Promise.all([
    getProduct("aurelia"),
    getProducts({ collection: "lumiere" }),
    getProducts({ collection: "vases-vessels" }),
    getProducts({ collection: "planters" }),
  ]);
  const studio = hero?.images.find((i) => i.onWhite);

  return (
    <>
      <Preloader />
      {hero && <Hero product={hero} />}
      <LumiereGallery lamps={lamps} />
      <WhyLight />
      <Atelier poster={studio ?? { url: "/products/samples/01-ochre-pleated-lamp.webp", alt: "Aurelia" }} />
      <Vessels products={[...vessels, ...planters]} />
      <Conscious />
      <Teasers />
      <ShopTheRoom products={lamps} />
      <ValuesBand />
      <Circle />
    </>
  );
}
