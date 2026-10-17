import { LightsPill } from "@/components/light/LightsPill";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";

/** How many lamps the home page shows before handing over to the collection page. */
const LIMIT = 8;

/**
 * II · The full collection, after the spotlight chapters: every lamp as a
 * card on the dark ground, each with its own switch, plus one pill to light
 * them all. Grows with the catalogue; past LIMIT it hands over to the
 * collection page.
 */
export function CollectionGrid({ lamps }: { lamps: Product[] }) {
  const t = copy.home.collection;
  const shown = lamps.slice(0, LIMIT);
  return (
    <section id="collection" data-header-tone data-torch className="on-night relative py-24 md:py-36">
      <Reveal className="gutter relative z-[1] mx-auto max-w-[1600px]">
        <div className="reveal-item flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="label text-fg-muted">{t.eyebrow}</p>
            <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
            <p className="mt-4 text-fg-muted">{t.body}</p>
          </div>
          <LightsPill handles={shown.filter((p) => p.imageOn).map((p) => p.handle)} />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-16">
          {shown.map((p) => (
            <div key={p.id} className="reveal-item">
              <ProductCard product={p} turn />
            </div>
          ))}
        </div>

        <div className="reveal-item mt-16 flex justify-center">
          <ButtonLink href="/collections/lumiere" variant="ghost" arrow>
            {t.cta(lamps.length)}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
