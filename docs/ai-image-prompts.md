# Lamp photography: off / on pairs

The light switch crossfades two photographs of **the same shot**: the lamp switched off, and the lamp switched on. Because the glow, the warm wall and the light on the table are all in the photograph, it reads as real. Nothing is painted on in code.

The rule that makes it work: **the "on" image must be made from the "off" image**, never generated separately. Same camera, same framing, same position; only the light changes. `/dev/lights` shows every pair; flip the switch there and anything that shifts is obvious.

## The three pairs each lamp can have

| Pair    | Used for                         | Files in `public/products/<handle>/`                            | Size             |
| ------- | -------------------------------- | --------------------------------------------------------------- | ---------------- |
| Cut-out | Product cards                    | `cutout-off.webp`, `cutout-on.webp` (transparent background)    | 768 × 1024 (3:4) |
| Stage   | Home hero, product page          | `stage-off.webp`, `stage-on.webp` (dark showroom, stone plinth) | 1264 × 848 (3:2) |
| Room    | Hover "see it at home" (Phase 4) | `room.webp` (+ `room-on.webp` when made)                        | 928 × 1152       |

The current images were imported from the previous Zohraé site with `scripts/import-legacy-assets.mjs`.

## Making a pair for a new lamp (Canva AI or any image editor)

1. **Off image first.** From the studio photo, generate the stage scene with the lamp **switched off**:
   > Place this exact lamp, completely unchanged ([shape, ribs/pleats, colours, base]), on a dark honed-stone plinth against a textured charcoal plaster wall. Soft, low, cool ambient light from the left; the lamp is switched off. Ultra-realistic product photography, 3:2, no text.
2. **On image from the off image.** Use the _off image_ as the only reference:
   > Edit this exact photo. Keep everything identical: camera, framing, lamp position, plinth, wall. Change only the lighting: the lamp is switched on with a warm 2700K bulb. [How this shade glows: e.g. "the ribbed shade glows from within, brightest at the thin ribs"], warm light falls on the wall behind it and pools on the plinth; the rest of the room stays dim. Ultra-realistic, no text.
3. **Cut-out pair:** remove the background from both images with the same crop (Canva's background remover), export 768 × 1024 transparent PNGs.
4. Convert to WebP into `public/products/<handle>/` with the names above (`node scripts/import-legacy-assets.mjs` shows the settings), add the lamp to `MEDIA` in `data/mock/products.ts`, then check it at `/dev/lights`.

**Quality rule:** the lamp must stay true to the real piece (shape, rib/pleat count, colour, base). Regenerate anything that changes the product.
