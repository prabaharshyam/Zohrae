import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Caring for your piece",
  description: "Dusting, cleaning and bulb guidance for your Zohraé piece.",
};

export default function CarePage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Care"
      title={
        <>
          Made to last for years, <em className="italic">not seasons</em>.
        </>
      }
      intro="Dusting, cleaning and bulb guidance for your Zohraé piece."
      phase={7}
    />
  );
}
