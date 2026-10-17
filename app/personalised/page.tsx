import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Personalised Gifts",
  description:
    "Type a name, choose a font and colour, and watch it appear on the piece in real time — then we finish it by hand.",
};

export default function PersonalisedPage() {
  return (
    <ChapterStub
      numeral="V"
      eyebrow="Fatto per te"
      title={
        <>
          Names, monograms and messages, <em className="italic">made for them</em>.
        </>
      }
      intro="Type a name, choose a font and colour, and watch it appear on the piece in real time — then we finish it by hand."
      phase={5}
    />
  );
}
