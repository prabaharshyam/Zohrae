import type { Metadata } from "next";
import { Atelier } from "@/components/home/Atelier";
import { ProsePage } from "@/components/layout/ProsePage";
import { ContactCard } from "@/components/layout/ContactCard";
import { PAGES } from "@/data/pages";

export const metadata: Metadata = {
  title: "L'Atelier",
  description:
    "How a Zohraé lamp is made: drawn by hand, printed layer by layer, finished by hand, tested in the dark.",
  alternates: { canonical: "/atelier" },
};

/** The making, as a story: the five-step deck, then the studio's beliefs. */
export default function AtelierPage() {
  return (
    <>
      <div className="pt-[var(--header-h)]">
        <Atelier />
      </div>
      <ProsePage page={PAGES.about} aside={<ContactCard />} />
    </>
  );
}
