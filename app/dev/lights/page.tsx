import type { Metadata } from "next";
import { LightTuner } from "@/components/light/LightTuner";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Light tuner",
  robots: { index: false, follow: false },
};

export default async function LightsTunerPage() {
  const lamps = await getProducts({ type: "Lamp" });
  return (
    <section className="gutter mx-auto max-w-[1600px] pt-[calc(var(--header-h)+6vh)]">
      <p className="label text-fg-muted">Developer tool</p>
      <h1 className="font-display mt-4 text-[length:var(--fs-h2)]">
        Light <em className="italic">tuner</em>
      </h1>
      <p className="mt-4 max-w-xl text-fg-muted">
        Drag the marker onto the bulb, then adjust radius, intensity and colour. Copy the values into the product&apos;s
        Shopify metafields (or the mock catalogue) once they look right.
      </p>
      <LightTuner products={lamps} />
    </section>
  );
}
