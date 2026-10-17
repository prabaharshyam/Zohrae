import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Your Collection",
  description: "The cart opens as a drawer from any page. This page is its quiet fallback.",
};

export default function CartPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Cart"
      title={
        <>
          Your collection awaits <em className="italic">its first light</em>.
        </>
      }
      intro="The cart opens as a drawer from any page. This page is its quiet fallback."
      phase={4}
    />
  );
}
