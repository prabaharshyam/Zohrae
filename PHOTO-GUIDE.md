# Photographing your pieces for Zohraé

The site's signature, a lamp that lights up when you touch it, works by crossfading two photographs: the lamp **off** and the same lamp **on**. Only the light may change between the two. If the camera, lamp or anything else moves, the crossfade "jumps", so the most important rule is: **don't touch anything between the two shots.**

You need three kinds of photo for each lamp. A phone with a manual/pro mode is enough; a camera is better.

---

## 1. The cut-out pair (every lamp): for cards and the collection grid

|                |                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Frame**      | Portrait **3 : 4** (e.g. 3000 × 4000 px). The lamp centred, filling about 80% of the height.                        |
| **Background** | Plain white or light grey paper. We remove it afterwards.                                                           |
| **Camera**     | On a **tripod**, straight on at the lamp's mid-height. Timer or remote, so you never touch the camera.              |
| **Settings**   | Manual: fixed ISO (100–200), fixed shutter, fixed white balance (daylight, 5500K), manual focus. Nothing on "auto". |

1. Light the lamp from one side with a soft window or a softbox, and shoot it **off**.
2. Without touching anything, switch the lamp **on** and shoot again. Lower the room light if the glow is too faint, but keep the camera settings identical.
3. Name them `lampname-off.jpg` and `lampname-on.jpg`.

## 2. The showroom pair (featured lamps): for the hero and spotlight chapters

These are the full-screen scenes: the lamp on a stone or wooden plinth against a dark wall.

|           |                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Frame** | Landscape **3 : 2** (e.g. 4500 × 3000 px). The lamp on the left or right third, with space for the name on the other side. |
| **Set**   | A dark matte wall (charcoal, deep brown), a plinth or shelf, nothing else.                                                 |
| **Light** | One soft light from the side at low power, so the room reads as evening.                                                   |

Shoot **off**, then **on**, from the tripod with identical settings, exactly as above.

## 3. Lifestyle (optional but lovely): for "See it where it lives"

Portrait 4 : 5, in a real room: a bedside, a console or a living room at dusk. A matched off/on pair here is a bonus.

---

## Where the lamp's switch is

The gold touch-button sits where the lamp's real switch is. Open the **off** photo, note the switch's pixel position, and divide by the photo's width and height:

> switch at x = 1500, y = 3320 on a 3000 × 4000 photo → `[0.5, 0.83]`

Enter it in Shopify as the metafield `zohrae.switch_at` (cut-out) or `zohrae.stage_switch_at` (showroom). See SHOPIFY-SETUP.md.

## Vases, planters, frames and gifts

- **Vases and planters:** one cut-out photo (as in §1, no "on" shot needed), plus a lifestyle photo with flowers or a plant.
- **Art frames:** one photo of the frame hanging on a wall, straight on, portrait 3 : 4, plus a close-up of the corner and mount.
- **Personalised gifts:** one beautifully styled photo with a real name on it, plus a **blank** photo of the same piece, shot straight on. The site draws the customer's name onto the blank one.

## Sending them

Send the original full-size files (not WhatsApp-compressed) by Google Drive or WeTransfer. We'll cut out, colour-match and optimise them for the site.
