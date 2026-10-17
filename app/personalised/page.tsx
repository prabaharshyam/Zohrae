import type { Metadata } from "next";
import { MadeForLanding } from "@/components/personalise/MadeForLanding";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Personalised Gifts",
  description:
    "Type a name, choose the lettering and ink, and watch it appear on the piece in real time. Then we finish it by hand.",
};

export default async function PersonalisedPage() {
  const products = await getProducts({ collection: "personalised-gifts" });
  return (
    <MadeForLanding
      eyebrow="V · Fatto per te"
      title={
        <>
          Names, monograms and messages, <em className="italic">made for them</em>.
        </>
      }
      intro="Tumblers, coasters, trays and frames, finished by hand with the name that matters. Type it below each piece and watch it appear."
      image={{
        url: "/products/personalised-insulated-tumbler/photo.webp",
        alt: "A blush tumbler with the name Aanya in gold script",
      }}
      products={products}
    />
  );
}
