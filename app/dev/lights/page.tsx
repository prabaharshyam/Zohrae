import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Light tuner",
  robots: { index: false, follow: false },
};

export default function LightsTunerPage() {
  return (
    <ChapterStub
      numeral="✦"
      eyebrow="Developer tool"
      title={
        <>
          Light <em className="italic">tuner</em>
        </>
      }
      intro="Drag the glow origin on each product photo, tune radius, intensity and colour, and copy the resulting metafield values."
      phase={2}
    />
  );
}
