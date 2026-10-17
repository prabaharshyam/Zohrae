import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zohraé designs sculptural lamps and vessels in India — printed in small batches and finished by one pair of hands.",
};

export default function AboutPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="The studio"
      title={
        <>
          A small studio with <em className="italic">a warm heart</em>.
        </>
      }
      intro="Zohraé designs sculptural lamps and vessels in India — printed in small batches and finished by one pair of hands."
      phase={7}
    />
  );
}
