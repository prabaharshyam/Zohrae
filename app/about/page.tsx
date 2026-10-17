import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "About",
  description: "The Zohraé studio: sculptural light, made to order in India.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <ProsePage page={PAGES.about} aside={<ContactCard />} />;
}
