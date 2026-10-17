import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LightsPill } from "@/components/light/LightsPill";
import { ProductCard } from "@/components/product/ProductCard";
import { copy } from "@/copy/en";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const collection = await getCollection((await params).handle);
  return collection ? { title: collection.title, description: collection.description } : {};
}

/** Phase 1 listing. Filters, sort and the hover lifestyle reveal arrive in Phase 4. */
export default async function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const [collection, products] = await Promise.all([getCollection(handle), getProducts({ collection: handle })]);
  if (!collection) notFound();
  const lampHandles = products.filter((p) => p.imageOn).map((p) => p.handle);

  return (
    <div className="gutter mx-auto max-w-[1600px] pt-[calc(var(--header-h)+10vh)]">
      <header className="max-w-3xl">
        <p className="label text-fg-muted">{collection.eyebrow}</p>
        <h1 className="font-display mt-5 text-[length:var(--fs-h1)]">{collection.title}</h1>
        <p className="mt-6 max-w-xl text-fg-muted">{collection.description}</p>
        <div className="mt-8 flex items-center gap-6">
          <p className="label text-[10px] text-fg-muted">{copy.cart.count(products.length)}</p>
          {lampHandles.length > 0 && <LightsPill handles={lampHandles} />}
        </div>
      </header>

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 2} />
        ))}
      </div>
    </div>
  );
}
