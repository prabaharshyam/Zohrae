import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "Caring for your piece",
  description: "How to keep PLA lamps, vases and frames beautiful for years.",
  alternates: { canonical: "/care" },
};

export default function Page() {
  return <ProsePage page={PAGES.care} aside={<ContactCard />} />;
}
