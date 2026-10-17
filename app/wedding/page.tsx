import type { Metadata } from "next";
import { MadeForLanding } from "@/components/personalise/MadeForLanding";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Wedding Atelier",
  description:
    "Role badges for the whole wedding party, photo magnets and return gifts for every guest, designed with you and made by hand.",
};

export default async function WeddingPage() {
  const products = await getProducts({ collection: "wedding-atelier" });
  return (
    <MadeForLanding
      eyebrow="VI · Matrimonio"
      title={
        <>
          For the bride, the groom, <em className="italic">and everyone who loves them</em>.
        </>
      }
      intro="Couture badges for every role in the wedding party, photo magnets of your favourite frame, and keepsakes for every guest who came."
      image={{
        url: "/products/wedding-party-badge-set/photo.webp",
        alt: "Ivory and gold wedding role badges on blush silk",
      }}
      products={products}
      concierge
    />
  );
}
