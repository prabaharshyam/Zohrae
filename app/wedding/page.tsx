import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Wedding Atelier",
  description:
    "Role badges for the whole wedding party, photo magnets and return gifts for every guest — designed with you, made by hand.",
};

export default function WeddingPage() {
  return (
    <ChapterStub
      numeral="VI"
      eyebrow="Matrimonio"
      title={
        <>
          Couture keepsakes for <em className="italic">the most beautiful day</em>.
        </>
      }
      intro="Role badges for the whole wedding party, photo magnets and return gifts for every guest — designed with you, made by hand."
      phase={5}
    />
  );
}
