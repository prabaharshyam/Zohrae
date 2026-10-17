import { getProduct, getProducts } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "A Zohraé piece";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const product = await getProduct((await params).handle);
  const image = product && (product.stage?.on ?? product.imageOn ?? product.imageOff ?? product.images[0]);
  return ogCard({
    image: image?.url,
    title: product?.title ?? "Zohraé",
    line: product ? `${product.tagline} · ${formatPrice(product.priceRange.min)}` : "",
  });
}
