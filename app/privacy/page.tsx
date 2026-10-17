import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How we collect, use and protect your information.",
};

export default function PrivacyPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Policy"
      title={
        <>
          Your privacy, <em className="italic">respected</em>.
        </>
      }
      intro="How we collect, use and protect your information."
      phase={7}
    />
  );
}
