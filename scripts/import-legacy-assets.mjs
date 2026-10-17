// One-off import of the matched lamp-off / lamp-on photography from the
// owner's previous site (zohrae Lovable showroom) into public/products/<handle>/.
//   node scripts/import-legacy-assets.mjs <folder-with-downloaded-assets>
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = process.argv[2];
const ROOT = new URL("..", import.meta.url).pathname;
// Previous site name → handle on this site.
const HANDLES = {
  dune: "aurelia",
  spiral: "sora",
  aura: "nuvola",
  forma: "onda",
  alto: "ballerina",
  arc: "rosalie",
  column: "colonna",
  petal: "coquille",
};

const files = readdirSync(SRC);
const find = (re) => files.find((f) => re.test(f));

async function out(src, dest, { width, alpha } = {}) {
  mkdirSync(join(dest, ".."), { recursive: true });
  let img = sharp(join(SRC, src));
  if (width) img = img.resize({ width, withoutEnlargement: true });
  await img.webp({ quality: alpha ? 86 : 82, alphaQuality: 90, effort: 6 }).toFile(dest);
  console.log(src, "→", dest.replace(ROOT, ""));
}

for (const [old, handle] of Object.entries(HANDLES)) {
  const dir = join(ROOT, "public/products", handle);
  const cutOff = find(new RegExp(`^cutout-${old}-(?!on-)`));
  const cutOn = find(new RegExp(`^cutout-${old}-on-`));
  if (cutOff) await out(cutOff, join(dir, "cutout-off.webp"), { alpha: true });
  if (cutOn) await out(cutOn, join(dir, "cutout-on.webp"), { alpha: true });
  const stOff = find(new RegExp(`^lummar-${old}-stage-(?!on-)`));
  const stOn = find(new RegExp(`^lummar-${old}-stage-on-`));
  if (stOff) await out(stOff, join(dir, "stage-off.webp"));
  if (stOn) await out(stOn, join(dir, "stage-on.webp"));
  const life = find(new RegExp(`^lifestyle-${old}-(?!on-)`));
  if (life) await out(life, join(dir, "room.webp"));
}

// Room scenes not tied to one product page yet.
const scenes = join(ROOT, "public/scenes");
await out(find(/^zohrae-living-refined-off-/), join(scenes, "living-off.webp"), { width: 1920 });
await out(find(/^zohrae-living-refined-on-/), join(scenes, "living-on.webp"), { width: 1920 });
await out(find(/^lifestyle-veil-(?!on-)/), join(scenes, "corner-off.webp"));
await out(find(/^lifestyle-veil-on-/), join(scenes, "corner-on.webp"));
