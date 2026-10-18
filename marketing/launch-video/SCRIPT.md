# Zohraé — "The lights are on" · 30-second launch film

**Formats:** 9:16 (1080 × 1920) for Instagram Reels and YouTube Shorts · 16:9 (1920 × 1080) for YouTube and the website.
**Music:** original upbeat track at 120 BPM, composed for this film (no licensing issues). Every cut lands on a beat.
**Voice:** none. The story is told in big, bold on-screen words, so it works with the sound off (most Reels are watched muted) and even better with it on.
**Look:** Zohraé's ivory, espresso and gold, with joyful pops of blush, terracotta and marigold. Confetti, bounces, a light switch that really clicks.

| Time | Scene | On screen | Sound |
| --- | --- | --- | --- |
| 0:00–0:04 | **1 · Lights off** | A dark screen. Words appear: *"Psst… it's a little dark in here."* A gold light switch slides in. At 0:02 it **clicks**, and the Aurelia lamp flickers on, flooding the screen with warm light. | Soft pad, a ticking pluck, a real *click*, then a rising swell. |
| 0:04–0:06 | **2 · The reveal** | The light bursts into ivory. The **ZOHRAÉ** wordmark slams in, gold. A round stamp spins on: **"WE'RE LIVE!"** · *zohrae.in* | The beat **drops**. Confetti pops. |
| 0:06–0:16 | **3 · What's inside** (one shelf per beat) | **Lamps that glow** (three lamps light up one by one) → **Vases with soul** → **Planters that bloom** → **Art for your walls** (frames swing in: A3 · A2 · A1) → **Custom gifts** (a name, *Aanya*, writes itself onto a tumbler) → **Fridge magnets** (*SNAP!*) → **Wedding badges** (Bride · Groom) | Pops, swishes and typewriter clicks on every beat. |
| 0:16–0:18 | **4 · And so much more** | Every piece bursts into a spinning collage: *"…and so much more!"* | Whoosh, sparkle. |
| 0:18–0:20 | **5 · The heart** | *"Designed & handmade in India."* · *"Made just for you."* | A snare roll builds… |
| 0:20–0:26 | **6 · Launch offers** | The screen turns marigold. **LAUNCH** · **OFFERS** slam in, word by word. A spinning sticker: **"Limited time!"** *"Special launch prices on lamps, décor & gifts."* Confetti cannon. *"Grab yours before they're gone."* | Biggest moment: impact, party poppers, extra claps and a bell hook. |
| 0:26–0:30 | **7 · Order now** | Ivory again. **"Order now at"** → a gold button **zohrae.in** that a cursor *clicks*. *"Shine beyond."* · **@zohrae.in** on Instagram. The lamp glows one last time. | Final chord rings out. |

## Captions to post with it

**Instagram (Reels):**
The lights are on ✨ Zohraé is LIVE!
Sculptural lamps, vases, art frames, custom gifts, fridge magnets, wedding badges and so much more: designed and handmade in India.
🎉 Launch offers are live for a limited time. Shop now at zohrae.in (link in bio)
#Zohrae #HandmadeInIndia #HomeDecor #LampDesign #CustomGifts #WeddingFavours #ShopLocal #NewLaunch

**YouTube (title):** Zohraé is LIVE ✨ Handmade lamps, décor & custom gifts · Launch offers at zohrae.in
**YouTube (description):** The lights are on. Zohraé, our atelier of sculptural lamps, vases, art frames, personalised gifts, fridge magnets and wedding badges, is now open at https://www.zohrae.in. Designed and handmade in India. Launch offers for a limited time. Instagram: @zohrae.in

## Changing the offer

The offer line reads *"Special launch prices on lamps, décor & gifts"* so it stays true whatever the exact deal is. Once the offer is decided (for example *"Flat 15% off with code LAUNCH15"*), it is one line in `scenes.js` (`OFFER_LINE`), and the film re-renders in a few minutes.

## Re-rendering

From the project folder (needs Node, Python 3 with numpy, ffmpeg and Chromium):

```bash
cd marketing/launch-video
python3 music.py out/music.wav     # the soundtrack
node render.mjs stills             # quick PNG stills of key moments, for review
node render.mjs                    # both videos → out/zohrae-launch-portrait.mp4 and out/zohrae-launch-landscape.mp4
```

To watch it live in a browser: open `index.html?fmt=portrait&play` (or `fmt=landscape`) from a local server. Text, timings and colours are all in `scenes.js` and `index.html`; the music and sound effects in `music.py` use the same clock.
