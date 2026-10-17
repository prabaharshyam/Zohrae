import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that apply when you shop with Zohraé.",
};

export default function TermsPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Policy"
      title={
        <>
          Terms of <em className="italic">service</em>.
        </>
      }
      intro="The terms that apply when you shop with Zohraé."
      phase={7}
    />
  );
}
