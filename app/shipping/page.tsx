import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Making times, delivery across India and prepaid payment.",
  alternates: { canonical: "/shipping" },
};

export default function Page() {
  return <ProsePage page={PAGES.shipping} aside={<ContactCard />} />;
}
