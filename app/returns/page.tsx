import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Returns",
  description: "Our return and replacement policy, in plain words.",
};

export default function ReturnsPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Returns & replacements"
      title={
        <>
          Peace of mind, <em className="italic">beautifully handled</em>.
        </>
      }
      intro="Our return and replacement policy, in plain words."
      phase={7}
    />
  );
}
