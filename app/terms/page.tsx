import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of sale for Zohraé pieces.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <ProsePage page={PAGES.terms} aside={<ContactCard />} />;
}
