import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "Returns",
  description: "Returns, replacements, cancellations and refunds.",
  alternates: { canonical: "/returns" },
};

export default function Page() {
  return <ProsePage page={PAGES.returns} aside={<ContactCard />} />;
}
