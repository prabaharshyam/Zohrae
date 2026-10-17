// Measures where the product sits in each image and writes a soft subject mask.
//   node scripts/analyze-products.mjs
// Studio shots (white backdrop): flood-fills the backdrop from the edges, so
// white pieces keep their own highlights. Lit shots (dark backdrop): finds the
// lamp by its contrast against the estimated backdrop.
// Output: data/mock/image-meta.json + public/products/masks/<name>.png
import { readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const W = 320; // analysis width; masks are written at this size

async function load(file) {
  const img = sharp(file).resize({ width: W }).removeAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, c: info.channels };
}

const lum = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
const sat = (d, i) => Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]);

/** Backdrop = near-white pixels connected to the image border. */
function studioMask({ data, w, h, c }) {
  const bg = new Uint8Array(w * h);
  const stack = [];
  const isBackdrop = (p) => lum(data, p * c) >= 251 && sat(data, p * c) <= 6;
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || !isBackdrop(p)) continue;
    bg[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  const m = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) m[p] = bg[p] ? 0 : 255;
  return m;
}

/** Pixels with real texture: the ribs, pleats and edges of the piece, not soft shadows or backdrops. */
function textureMap({ data, w, h, c }) {
  const L = new Float32Array(w * h);
  for (let p = 0; p < w * h; p++) L[p] = lum(data, p * c);
  const t = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      const g = Math.abs(L[p + 1] - L[p - 1]) + Math.abs(L[p + w] - L[p - w]);
      t[p] = g > 14 ? 255 : 0;
    }
  }
  return dilate(t, w, h, 3);
}

function dilate(m, w, h, r) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!m[y * w + x]) continue;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < w && yy < h) out[yy * w + xx] = 255;
        }
      }
    }
  }
  return out;
}

/** Lit shots sit on a smooth dark backdrop, so the lamp is wherever there's texture. */
const litMask = textureMap;

/** Largest connected blob's bounding box, as fractions of the image. */
function subjectBox(m, w, h) {
  const seen = new Uint8Array(w * h);
  let best = null;
  for (let s = 0; s < w * h; s++) {
    if (!m[s] || seen[s]) continue;
    let n = 0, x0 = w, x1 = 0, y0 = h, y1 = 0;
    const stack = [s];
    seen[s] = 1;
    while (stack.length) {
      const p = stack.pop();
      n++;
      const x = p % w, y = (p / w) | 0;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= w * h || seen[q] || !m[q]) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === w - 1)) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    if (!best || n > best.n) best = { n, x0, x1, y0, y1 };
  }
  const r = (v) => Math.round(v * 1000) / 1000;
  return { left: r(best.x0 / w), right: r((best.x1 + 1) / w), top: r(best.y0 / h), bottom: r((best.y1 + 1) / h) };
}

const meta = {};
for (const dir of ["samples", "generated"]) {
  for (const f of readdirSync(join(ROOT, "public/products", dir)).filter((f) => f.endsWith(".webp"))) {
    if (f.includes("_life")) continue; // room scenes need no alignment
    const file = join(ROOT, "public/products", dir, f);
    const img = await load(file);
    const lit = dir === "generated";
    const m = lit ? litMask(img) : studioMask(img);
    const name = basename(f, extname(f));
    // Edges from textured pixels inside the subject, so soft cast shadows are left out.
    const box = subjectBox(m, img.w, img.h);
    const tex = textureMap(img);
    for (let p = 0; p < tex.length; p++) if (!m[p]) tex[p] = 0;
    const tbox = subjectBox(tex, img.w, img.h);
    meta[`/products/${dir}/${f}`] = { subject: { ...tbox, top: Math.min(box.top, tbox.top) } };
    if (!lit) {
      // CSS masks read transparency, so the silhouette goes into the alpha channel.
      const rgba = Buffer.alloc(img.w * img.h * 4);
      for (let p = 0; p < img.w * img.h; p++) rgba[p * 4 + 3] = m[p];
      await sharp(rgba, { raw: { width: img.w, height: img.h, channels: 4 } })
        .blur(1.2)
        .png()
        .toFile(join(ROOT, "public/products/masks", `${name}.png`));
      meta[`/products/${dir}/${f}`].mask = `/products/masks/${name}.png`;
    }
  }
}
writeFileSync(join(ROOT, "data/mock/image-meta.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(meta);
