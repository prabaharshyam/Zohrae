import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionBrowser } from "@/components/shop/CollectionBrowser";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const collection = await getCollection((await params).handle);
  return collection
    ? {
        title: collection.title,
        description: collection.description,
        alternates: { canonical: `/collections/${collection.handle}` },
      }
    : {};
}

/** A collection: its story, then the browsable grid (filters, sorting, one switch for every lamp). */
export default async function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const [collection, products] = await Promise.all([getCollection(handle), getProducts({ collection: handle })]);
  if (!collection) notFound();

  return (
    <div className="gutter mx-auto max-w-[1600px] pt-[calc(var(--header-h)+10vh)] pb-24">
      <header className="max-w-3xl">
        <p className="label text-fg-muted">{collection.eyebrow}</p>
        <h1 className="font-display mt-5 text-[length:var(--fs-h1)]">{collection.title}</h1>
        <p className="mt-6 max-w-xl text-fg-muted">{collection.description}</p>
      </header>

      <CollectionBrowser products={products} />
    </div>
  );
}
