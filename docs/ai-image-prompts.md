# AI image prompts

Lit ("switched on") and in-room images for every product are generated with **Canva AI image generation**, using the owner's real product photo as the reference image. Reuse these prompts for new products: swap in the product's own description (shape, ribs or pleats, colours, base).

**Quality rule:** compare every result with the real piece (shape, rib/pleat pattern, colour, base). Regenerate anything that changes the product. The room can be imagined; the product cannot.

## How the files get into the site

1. Import the studio photo into Canva from the live site, e.g. `https://zohrae-five.vercel.app/products/samples/<file>.webp`.
2. Generate with the prompt below, with the imported photo as the image reference.
3. Place the result full-bleed on a page of the Canva design **"Zohraé — website image exports"** and export it as JPG.
4. Convert to WebP into `public/products/generated/` named `<handle>_on.webp`, `<handle>_life.webp`, `<handle>_life_on.webp`.
5. Add it to `GENERATED` in `data/mock/products.ts` (later: the `zohrae.image_on`, `lifestyle_image` and `lifestyle_image_on` metafields in Shopify).

## 1. Lit studio shot (`image_on`), same aspect as the studio photo

> Edit this exact product photo. Keep the lamp completely identical: same **[shade description]**, same **[base description]**, same proportions, same camera angle, same framing and position in the frame. Change only the lighting: the lamp is switched ON with a warm 2700K bulb inside the shade. **[How this shade glows: e.g. "the pleated shade glows from within with warm honey-amber light, brighter at the thin pleat edges"]**, light spilling downward onto the base and pooling on the surface beneath. The room lights are dimmed: the white studio backdrop becomes a soft warm dark brown-grey, falling into darkness at the edges, with a gentle warm halo on the backdrop behind the shade. Ultra-realistic product photography, real camera, natural light falloff, no added objects, no text.

## 2. Evening room scene (`lifestyle_image_on`), 3:4

> Place this exact lamp, completely unchanged (**[shade + base description]**), on **[surface]** in **[room]** in the evening. The lamp is switched on, **[glow description]**, casting a soft pool of light on **[nearby materials]**. Interior: **[3–5 styling details]**. Parisian-meets-Indian quiet luxury, editorial interior photography, shot on a full-frame camera at 50mm, shallow depth of field, ultra-realistic, natural light, no people, no text.

## 3. Daytime version of the same room (`lifestyle_image`), 3:4

Use **both** the evening room image and the studio photo as references:

> Recreate this exact same **[room]** scene with the identical composition, camera angle, furniture, styling and the identical lamp (**[description]**), but in soft bright late-morning daylight. The lamp is switched OFF, showing its true colour and texture in natural light. Daylight streams gently through **[window detail]**, soft natural shadows. Ultra-realistic editorial interior photography, no people, no text.

## Status (17 Oct 2026)

| Lamp      | Lit studio shot | Evening room | Daytime room | Room                                  |
| --------- | --------------- | ------------ | ------------ | ------------------------------------- |
| Aurelia   | ✅              | ✅           | ⏳           | Bedroom                               |
| Sora      | ✅              | ⏳           | ⏳           | Living room console                   |
| Nuvola    | ✅              | ⏳           | ⏳           | Home studio desk                      |
| Onda      | ⏳              | ⏳           | ⏳           | Living room, beside a bouclé armchair |
| Ballerina | ⏳              | ⏳           | ⏳           | Reading corner                        |

⏳ = waiting for Canva AI credits (the free plan includes 20 AI uses a month, resetting on the 1st; Canva Pro raises the limit). Until then, the light switch uses the procedural glow for lamps without a lit shot, and the room hover uses the evening scene where there's no daytime one.
