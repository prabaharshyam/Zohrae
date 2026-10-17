import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Find your light",
  description: "Tell us about your room, your mood, your style and your budget. We'll light the way.",
};

export default function LightFinderPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="A short quiz"
      title={
        <>
          Four questions. <em className="italic">Three lamps</em> made for you.
        </>
      }
      intro="Tell us about your room, your mood, your style and your budget. We'll light the way."
      phase={6}
    />
  );
}
