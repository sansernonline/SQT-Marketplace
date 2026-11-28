# Logos — details

Contents: five architectures → context tests → making a logo "wow" → bar shapes · the short rules and the four simplicity tests are in `SKILL.md`

## Five architectures

| Type | What it is | Example |
|---|---|---|
| Wordmark | The brand name as letters only | Stripe · Google |
| Symbol + wordmark | A picture paired with the name | Slack · Airbnb |
| Symbol only | A picture only | Apple · Target |
| Lettermark as symbol | A single letter designed until it becomes a picture | Beats · McDonald's |
| Monogram | 2–3 letters combined | Chanel · Gucci |

**A set that works in real use needs 3 types** — the main one for wide spaces · the monogram for square slots ·
the lettermark as symbol for favicons and embroidery

| Context | Real limit |
|---|---|
| favicon 16px | No more than **4–6 elements** · lines thinner than **2px disappear** · no more than 3–4 colors |
| App icon 28px | 4–8 elements · lines thinner than 3px disappear |
| Shirt embroidery 1.5 inches | **4–6 thread colors** · thinnest line ~1 mm · **text under 2 mm cannot be embroidered** |
| Black and white | Must read without relying on color |
| Inverted (white on black) | Counters inside letters must not fill in |
| Storefront sign | Read at 15–60 meters · specify the **Pantone color, not hex** |
| Social profile picture | Cropped to a circle · must read at **60–80px** in the notification feed |

## Making a logo "wow" — methods that have worked

A logo rejected as "not beautiful, not wow" is usually a commonly used symbol, such as the `>_` of a terminal program or a flat single-color wordmark. What works:

1. **Make at least 1 direction come from what users see every day in the work**, for example the underscore cursor of a terminal for a telnet/SSH app, because the work's owner often ties the brand to that picture (the real owner picked the cursor direction after 2 rounds)
2. **Make 3 directions at the same time**, each with a different idea, such as connection lines · letters as stacked layers · plain geometric shapes, then choose from real images placed side by side (`handoff/parallel-attempts-pick-best`)
3. **Have depth in a form that passes `SKILL.md` section 7** — stacked layers of shapes · different line weights · a gradient of one hue whose shades differ by no more than 10 degrees · **no glow and no multi-color gradients**, and at 16px a readable silhouette must remain
   - Glow or light layers are allowed only when the user asks for that direction (opt-in) and it must be written in the direction file
4. **Make a preview sheet every round** — sizes 16 · 24 · 32 · 48 · 64 · 128 · 256 on dark and white backgrounds · the logo + name lockup on both backgrounds · single-color version · in the Windows taskbar and the app window title bar, then look at it with your own eyes and revise at least 3 rounds (an example of a sheet that passed: `assets/logo-preview-sheet-example.webp`)
5. **Convert the brand name to outlines from an open font** (SIL Open Font License (OFL), such as Space Grotesk · Manrope · IBM Plex Sans — do not use Inter, because it is on the list of fonts everyone uses in `SKILL.md` section 7) with fontTools, and keep the license file too; never use operating system fonts such as Segoe, because their license does not cover making logos
6. **Export the same complete set every time** — use the one set in [`sizes-and-print.md` step 4](sizes-and-print.md#4--ไฟล์ที่ต้องส่งมอบ) (SVG · PDF · transparent PNG · ICO · 4 color versions); if the direction the user chose has a filter (opt-in), use a PNG file wherever the drawing program does not support filters, such as Word
7. **A logo with a moving part** (such as a cursor): in the sprite SVG, split `<g id="…-body">` from `<g id="…-cursor">` and have the main symbol use both parts, so the home page can blink only the cursor while elsewhere the original symbol is still used; blink only on the home page, and stop when the machine is set to reduce motion (`prefers-reduced-motion`)

## Bar shapes — rounded rectangles, not round ends

For letters or symbols built from bars (such as T · `_` · `>`), use **rounded-rectangle bars**. The real owner asked to change from round ends to this because it looks more modern.

| Corner radius relative to bar thickness | Result |
|---|---|
| Below 0.2 | Stiff, looks undesigned |
| **0.25–0.35** (default 0.3) | Clearly angular but soft-edged, fits geometric fonts and Windows 11 style icons |
| 0.4 and up | Starts turning back into half-circle round ends, looks soft like a pill or a toy |

- Use the same radius on every bar, including letters, the cursor, and the glow edge that surrounds the bars
- Joins between bars (such as the stem of a T meeting the top bar) are joined as straight angles, with no rounded inner corner, because that creates a bulge
- The rounded corners disappear at 16px, which is fine as long as it still reads as a letter; judge whether the radius looks good at 64px and up
