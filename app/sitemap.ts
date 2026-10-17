import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/journal";
import { getCollections, getProducts } from "@/lib/commerce";
import { absolute } from "@/lib/site";

const STATIC = [
  "",
  "/personalised",
  "/wedding",
  "/light-finder",
  "/atelier",
  "/about",
  "/journal",
  "/contact",
  "/shipping",
  "/returns",
  "/care",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  return [
    ...STATIC.map((p) => ({ url: absolute(p || "/"), changeFrequency: "weekly" as const, priority: p ? 0.6 : 1 })),
    ...collections
      .filter((c) => !c.hidden)
      .map((c) => ({ url: absolute(`/collections/${c.handle}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: absolute(`/products/${p.handle}`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: (p.imageOff ? [p.imageOff] : p.images.slice(0, 1)).map((i) => absolute(i.url)),
    })),
    ...ARTICLES.map((a) => ({ url: absolute(`/journal/${a.slug}`), lastModified: a.date, priority: 0.5 })),
  ];
}
