import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Styling guides and stories on layered light — starting with how to light a living room like a luxury hotel.",
};

export default function JournalPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Light & interiors"
      title={
        <>
          Notes on <em className="italic">living in the glow</em>.
        </>
      }
      intro="Styling guides and stories on layered light — starting with how to light a living room like a luxury hotel."
      phase={7}
    />
  );
}
