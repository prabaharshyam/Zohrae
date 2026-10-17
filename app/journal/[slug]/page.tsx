import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ARTICLES } from "@/data/journal";
import { absolute } from "@/lib/site";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.dek, images: [{ url: a.image.url }] },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <article className="pb-24 pt-[calc(var(--header-h)+8vh)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.dek,
          datePublished: a.date,
          image: absolute(a.image.url),
          author: { "@type": "Organization", name: "Zohraé" },
          publisher: { "@type": "Organization", name: "Zohraé" },
        }}
      />
      <header className="gutter mx-auto max-w-3xl">
        <Link href="/journal" className="label text-[10px] text-fg-muted hover:text-fg">
          ← Journal
        </Link>
        <h1 className="font-display mt-6 text-[length:var(--fs-h1)] leading-[1.02]">{a.title}</h1>
        <p className="font-display mt-5 text-xl italic text-fg-muted">{a.dek}</p>
      </header>
      <div data-reveal-media className="relative mx-auto mt-12 aspect-[16/9] max-w-[1400px] overflow-hidden">
        <Image src={a.image.url} alt={a.image.alt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="gutter mx-auto mt-14 max-w-prose text-[1.08rem] leading-relaxed">
        {a.body.map((b, i) => (
          <div key={i} className="mt-8">
            {b.heading && <h2 className="font-display mb-3 text-[length:var(--fs-h3)]">{b.heading}</h2>}
            <p className="text-fg-muted">{b.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
