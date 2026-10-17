import type { Metadata } from "next";
import { LitImage } from "@/components/light/LitImage";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Light pairs",
  robots: { index: false, follow: false },
};

/**
 * Developer check for the light switch's photo pairs: every lamp's off/on
 * cut-outs and stage scenes. Flip the switch and watch for any pair whose
 * framing shifts. The crossfade should only ever change the light.
 */
export default async function LightPairsPage() {
  const lamps = await getProducts({ type: "Lamp" });
  return (
    <section className="gutter mx-auto max-w-[1600px] pt-[calc(var(--header-h)+6vh)]">
      <p className="label text-fg-muted">Developer tool</p>
      <h1 className="font-display mt-4 text-[length:var(--fs-h2)]">
        Light <em className="italic">pairs</em>
      </h1>
      <p className="mt-4 max-w-xl text-fg-muted">
        Flip the switch. In every pair, only the light should change; if a lamp shifts or changes shape, regenerate its
        &ldquo;on&rdquo; image from the &ldquo;off&rdquo; image (see docs/ai-image-prompts.md).
      </p>
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {lamps.map((p) => (
          <figure key={p.handle}>
            <LitImage
              title={p.title}
              off={p.imageOff}
              on={p.imageOn}
              sizes="25vw"
              frameClassName="aspect-[3/4] bg-bg-raised"
            />
            {p.stage && (
              <LitImage
                title={p.title}
                off={p.stage.off}
                on={p.stage.on}
                fit="cover"
                sizes="25vw"
                frameClassName="mt-2 aspect-[3/2] bg-night"
              />
            )}
            <figcaption className="label mt-3 text-fg-muted">
              {p.title} · cut-out {p.imageOn ? "✓" : "—"} · stage {p.stage?.on ? "✓" : "—"} · room{" "}
              {p.lifestyle ? "✓" : "—"}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
