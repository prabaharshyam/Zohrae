import type { Metadata } from "next";
import { ContactCard } from "@/components/layout/ContactCard";
import { ContactForm } from "@/components/layout/ContactForm";
import { copy } from "@/copy/en";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Zohraé atelier on WhatsApp: questions, weddings, gifts and orders.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const t = copy.contactPage;
  return (
    <section className="gutter mx-auto max-w-[1600px] pb-24 pt-[calc(var(--header-h)+10vh)]">
      <p className="label text-fg-muted">{t.eyebrow}</p>
      <h1 className="font-display mt-5 text-[length:var(--fs-h1)] leading-[1.02]">{t.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t.intro}</p>
      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <ContactCard />
        <ContactForm />
      </div>
    </section>
  );
}
