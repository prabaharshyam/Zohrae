import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on light and living: how to light a room, warm colour temperature, and the honest story of PLA.",
  alternates: { canonical: "/journal" },
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function JournalPage() {
  const [lead, ...rest] = ARTICLES;
  return (
    <section className="gutter mx-auto max-w-[1600px] pb-24 pt-[calc(var(--header-h)+10vh)]">
      <p className="label text-fg-muted">Journal</p>
      <h1 className="font-display mt-5 text-[length:var(--fs-h1)]">Notes on light</h1>
      <Link
        href={`/journal/${lead.slug}`}
        className="group mt-14 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end"
        data-cursor="Read"
      >
        <span data-reveal-media className="relative block aspect-[16/10] overflow-hidden">
          <Image
            src={lead.image.url}
            alt={lead.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-105"
          />
        </span>
        <span>
          <span className="label block text-[10px] text-fg-muted">{fmt(lead.date)}</span>
          <span className="font-display mt-3 block text-[length:var(--fs-h2)] leading-tight">{lead.title}</span>
          <span className="mt-4 block text-fg-muted">{lead.dek}</span>
        </span>
      </Link>
      <div className="mt-20 grid gap-12 md:grid-cols-2">
        {rest.map((a) => (
          <Link key={a.slug} href={`/journal/${a.slug}`} className="group block" data-cursor="Read">
            <span className="relative block aspect-[16/10] overflow-hidden">
              <Image
                src={a.image.url}
                alt={a.image.alt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-105"
              />
            </span>
            <span className="label mt-5 block text-[10px] text-fg-muted">{fmt(a.date)}</span>
            <span className="font-display mt-2 block text-3xl">{a.title}</span>
            <span className="mt-3 block text-fg-muted">{a.dek}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
