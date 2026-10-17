import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { absolute } from "@/lib/site";
import { WORDMARK_ACCENT, WORDMARK_GLYPHS, WORDMARK_VIEWBOX } from "@/components/brand/wordmark-paths";

export const OG_SIZE = { width: 1200, height: 630 };

/** A local /public image as a PNG data URL (satori can't read WebP). */
async function local(url: string, width: number) {
  if (!url.startsWith("/")) return url;
  // On disk locally; over HTTP where public files aren't bundled with the function (Vercel).
  const buf = await readFile(join(process.cwd(), "public", url)).catch(async () =>
    Buffer.from(await (await fetch(absolute(url))).arrayBuffer()),
  );
  const png = await sharp(buf).resize({ width }).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * The share card: the lit photograph on the right, the wordmark, a title and
 * a line on a night ground, like the hero.
 */
export async function ogCard({ image, title, line }: { image?: string; title: string; line: string }) {
  const src = image ? await local(image, 760) : undefined;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e0b09", color: "#f3e9d8" }}>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: 520 }}
      >
        <svg viewBox={WORDMARK_VIEWBOX} width={260} height={63} fill="#f3e9d8">
          {Object.values(WORDMARK_GLYPHS).map((d, i) => (
            <path key={i} d={d} fillRule="evenodd" />
          ))}
          <path d={WORDMARK_ACCENT} fill="#c0823a" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
          <div style={{ marginTop: 20, fontSize: 26, color: "#c9b79c" }}>{line}</div>
        </div>
        <div style={{ fontSize: 18, letterSpacing: 6, color: "#c0823a" }}>ATELIER · INDIA</div>
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- satori renders <img>, not next/image
        <img src={src} alt="" width={680} height={630} style={{ objectFit: "cover", width: 680, height: 630 }} />
      )}
    </div>,
    OG_SIZE,
  );
}
