import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "L'Atelier",
  description:
    "Every piece is printed layer by layer in plant-based PLA, then sanded, finished, light-tested and wrapped by hand.",
};

export default function AtelierPage() {
  return (
    <ChapterStub
      numeral="IV"
      eyebrow="How it's made"
      title={
        <>
          From thread <em className="italic">to treasure</em>.
        </>
      }
      intro="Every piece is printed layer by layer in plant-based PLA, then sanded, finished, light-tested and wrapped by hand."
      phase={3}
    />
  );
}
