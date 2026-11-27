# Depth, light and flourish · design-references

Open on any visual job (poster · banner · social post · slide · deck · screen · cover) when the owner's "สไตล์ออกแบบที่ชอบ" asks for depth (`มีมิติ` · `แสงเงา` · `ลูกเล่น`), or when the owner calls a piece flat or bland (`แบน` · `จืด`). The owner asked for this on every design job, not one kind (2026-11-17, from a red-white Thai company profile deck they liked; that deck's full page system is in graphic-design `brand-kit/references/corporate-profile-deck.md`).

Goal: the page reads as 3 layers with one light source, and has 1–2 moving elements, while the text stays flat and easy to read.

## 1 · Build 3 layers

| Layer | What goes there | How it looks |
|---|---|---|
| Back | photo, soft gradient, 1–3 faint diagonal light streaks (not a repeating stripe pattern), a big curved ribbon at one corner | low contrast, slightly blurred or faded into the background colour |
| Middle | white cards, panels, the bottom strip | solid surface with a soft shadow, large corner radius (on 1920 px slides use 24–27 px, which the `design-gate/no-ai-look` script accepts; only a really large panel may go to 28 px or more, with `slop-ok: huge-radius` and the reason) |
| Front | icon tiles, number tabs, labels, buttons, the product | brand colour with its own gradient and a tighter shadow; **crosses the edge** of the card behind it. An icon tile earns its place by that overlap and by meaning something; a tile parked above every card heading is the `design-gate/no-ai-look` "icon tile above a heading" signal |

In the owner's deck the overlaps carry most of the depth, more than the shadows (eye read 2026-11-17, not measured): an icon tile sitting half over a photo edge, a photo bleeding off the page edge, a label sticking out past a card. Plan at least 2 overlaps per page.

**The back layer needs one strong thing.** A test without photos (2026-11-17, fictional company, 3 slides + 1 banner) came out clean but flatter than the owner's deck: faded line icons in card headers read as filler. Give the back layer one of: a real photo (light agrees with the page) · a large dark or brand-colour block cut on a diagonal (the test cover did this and had the most depth) · a product screen or document mock-up. A faint icon is not enough.

**Break the identical-card grid.** 4 cards that are the same shape with an icon tile each still look like a template (same test). Make one card the lead (larger, darker, or with the photo), or give each card a real number or image instead of a decorative icon.

## 2 · One light source

- Pick one light direction for the whole set (default: from the top left) and write it in the style lock. Every shadow falls the other way; every highlight sits on the lit edge.
- Shadow = 2 layers: a tight contact shadow plus a wide soft one, low opacity, tinted toward the background colour, never pure black.
- Starting point in CSS, not measured, tune by eye:
  `box-shadow: 1px 1px 2px rgb(20 30 40 / .08), 6px 12px 32px -8px rgb(20 30 40 / .14);`
  Front items get a coloured shadow from their own fill, e.g. a red tile `4px 8px 20px -6px rgb(200 8 8 / .35)` (also unmeasured). The positive x offset is what makes the shadow fall away from a top-left light; with x = 0 the light is straight above.
- Accent shapes get a 2-stop gradient of the same hue, lit corner lighter (e.g. `#e81018 → #c00808`, top left to bottom right; the 2 reds were sampled from the owner's deck ± 8, the rest is a starting point). The gradient makes the lit edge; do not add a 1 px border on a box with a wide shadow (`design-gate/no-ai-look` signal "line + wide shadow", script rule `hairline-shadow`).
- Photos: light in the photo should agree with the page light. Fade a photo into the background with a gradient mask so the photo and the layout become one picture.

## 3 · Flourish (1–2 per page, not more)

How to count: a frame that repeats unchanged on every page of a set counts as **one** flourish, because the eye learns it after page 2, but only if it has at most 2 decorative pieces (e.g. slanted heading bar + slanted label in the bottom strip). A third piece such as a corner ribbon on every page makes the frame count as 2, leaving no room for the page's own. Otherwise the page may add 1 more of its own. Glow is counted separately under its own limit (1 item). A single piece (no set) counts every flourish.

- **Diagonals:** slanted bars before headings, parallelogram labels, a photo cut on a diagonal. They give movement without clutter.
- **Ribbon or sweep:** one large curved band in the brand colour at a page corner, partly behind the content.
- **Light trail with nodes:** a thin glowing line that links 3–5 items, with small bright dots where it meets them. Good on covers and hub diagrams.
- **Glass tile:** a frosted, semi-clear tile only where it sits over a photo, holding one icon.
- **Glow:** only on the single focal item (the hero product, the hub centre). Never on text. It must be visible: on a screenshot, the glow's ring around the item is clearly lighter or more coloured than the background a short way off, so you can see where it ends. A glow hidden behind a white card does nothing, so drop it or move it.
- **Colour on colour:** a line, node or icon that crosses a band of the same colour vanishes (test banner: crimson line over the crimson corner). Switch it to white or the light tint where it crosses.

## 3b · Colour gradients

The owner asked for colour gradients on design work (2026-11-24: "เพิ่ม skill design ให้ใช้สี gradient ด้วยก็ดีนะ"). Earlier picks point the same way: the Stripe gradient wave and the Bindplane `#522db3 → #5584c5` buttons (2026-10-28), and the gradient ribbon on a cover (2026-11-18). So each design job should have **one multi-hue gradient chosen on purpose**, not just a flat brand colour.

Where it goes (pick 1 focal place per page):
- the back layer's strong thing (section 1): a full-bleed field, a wave or a mesh behind the hero;
- one large shape: a corner ribbon, a diagonal brand block, the hero card;
- the main button or the one highlighted number tile;
- a logo mark's surface, but only when the flat one-colour master already passes 16 px and squint (rule 39 of `ref-to-design.md`).

How to build it:
- Start from the brand's main hex and move to a neighbour hue 20–60° away on the colour wheel (analogous). Add a 3rd stop only if it stays in that family. A complementary pair needs a light middle stop, or it turns muddy.
- Interpolate in OKLCH so the middle does not go grey: `background: linear-gradient(135deg in oklch, #e81018, #ff7a1a);`. Canva and PowerPoint have no OKLCH, so add a mid stop by hand instead.
- Run the light the same way as the shadows (section 2): lighter stop at the lit corner, top left by default.
- Add 2–4 % grain (SVG `feTurbulence` or a noise PNG at low opacity) to large gradient fields. It stops banding and the plastic look `(อนุมาน)`.
- Mesh or blob gradient backgrounds are fine (`design-gate/no-ai-look` does not count them as signals).

Keep out:
- Purple → blue → cyan and pink → purple are framework defaults (the `design-gate/no-ai-look` `ai-palette` signal). Use them only when the brand colour is already in that family, and write the source hex.
- No gradient on text or body copy (the `gradient-text` signal), no gradient circle with a hole as a logo, and not more than one multi-hue gradient focal per page. Same-hue 2-stop gradients for lit edges (section 2) are not counted.
- Text on a gradient gets the contrast check at both the lightest and the darkest point under the text.

Counting: a gradient field that is the back layer's strong thing is not a flourish; a gradient ribbon or sweep counts as 1 flourish (section 3).

## 4 · Limits (so it does not turn into an AI look)

`design-gate/no-ai-look` section 2 lists glow circles, frosted glass across the page and line + wide shadow as default signals. The owner's taste is the reason to use depth, but only inside these limits:

- At most 3 depth levels; text and body copy are flat (no text shadow, no glow, no gradient text).
- One light direction for every shadow on every page of the set.
- Glow on 1 item per page; glass only over photos, never as the page background.
- Shadows soft and tinted; if a shadow is the first thing you notice, halve it.
- Text on glass or photo keeps contrast 4.5:1 or more (sample the darkest and lightest pixel behind the text on a screenshot and compute the ratio).
- Keep the colour count: depth comes from light and dark of the same hue, not new colours. The one exception is the multi-hue gradient in section 3b, built from the brand hue and its neighbours.

## 5 · Check before sending

1. Squint test: blur the page; you can still tell back, middle and front apart.
2. Every shadow points the same way (look at 3 random items).
3. At least 2 overlaps on the page; the page is not all boxes side by side.
4. Count flourishes per the counting rule in section 3 (frame of at most 2 pieces = 1, plus at most 1 of the page's own); glow on at most 1 item, and visible.
5. Read every line of text at 50% zoom; nothing is lost in a glow, glass or photo.
6. One multi-hue gradient chosen on purpose (section 3b): its hexes come from the brand hue, it sits on 1 focal place, and it is not on text.
7. Put it next to the owner's liked example (deck in `corporate-profile-deck.md`): if yours is clearly flatter, the back layer is missing its strong thing.

## Tools

Stone, metal, paper or concrete surfaces come from a real photo, not a gradient: [`photo-texture.md`](photo-texture.md).

| Tool | Depth | Light | Flourish |
|---|---|---|---|
| HTML/CSS | `box-shadow` layers · `z-index` · negative margins for overlap | `linear-gradient` · `mask-image` to fade photos | `clip-path` for diagonals · SVG path for ribbons and trails · `backdrop-filter` for glass (over photos only) |
| Canva | Effects → Shadows (Drop, soft) · arrange forward/back | gradient elements · photo transparency + gradient overlay | rotated rectangles, curve shapes, line + dot elements |
| PowerPoint | Shadow → Outer, offset to match the light | gradient fill (2 stops, same hue) · picture transparency | freeform shapes · parallelogram shape |
| AI image tools | put depth in the brief: "soft light from top left, shallow depth of field" | name the light source and time | never ask the image tool to draw the text; add text as a layer |
