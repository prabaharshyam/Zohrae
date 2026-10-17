import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to us, or open the WhatsApp concierge for help choosing a piece.",
};

export default function ContactPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Say hello"
      title={
        <>
          We’d love <em className="italic">to hear from you</em>.
        </>
      }
      intro="Write to us, or open the WhatsApp concierge for help choosing a piece."
      phase={7}
    />
  );
}
