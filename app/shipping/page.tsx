import type { Metadata } from "next";
import { ChapterStub } from "@/components/layout/ChapterStub";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Delivery timelines, packaging and tracking. All orders are prepaid — UPI, cards and netbanking accepted.",
};

export default function ShippingPage() {
  return (
    <ChapterStub
      numeral="—"
      eyebrow="Delivery"
      title={
        <>
          Wrapped by hand, <em className="italic">shipped across India</em>.
        </>
      }
      intro="Delivery timelines, packaging and tracking. All orders are prepaid — UPI, cards and netbanking accepted."
      phase={7}
    />
  );
}
