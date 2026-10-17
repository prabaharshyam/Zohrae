import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What we collect, why, and your choices.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <ProsePage page={PAGES.privacy} aside={<ContactCard />} />;
}
