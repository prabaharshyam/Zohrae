import type { Metadata } from "next";
import { DreamRoomGrid } from "@/components/shop/DreamRoomGrid";
import { copy } from "@/copy/en";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: copy.dreamRoom.eyebrow,
  description: "The pieces you've saved, kept on this device.",
  robots: { index: false },
};

/** Dream Room: the visitor's saved pieces (kept in their browser). */
export default async function DreamRoomPage() {
  const products = await getProducts();
  return (
    <div className="gutter mx-auto max-w-[1600px] pt-[calc(var(--header-h)+10vh)] pb-24">
      <p className="label text-fg-muted">{copy.dreamRoom.eyebrow}</p>
      <h1 className="font-display mt-5 text-[length:var(--fs-h1)]">{copy.dreamRoom.title}</h1>
      <DreamRoomGrid products={products} />
    </div>
  );
}
