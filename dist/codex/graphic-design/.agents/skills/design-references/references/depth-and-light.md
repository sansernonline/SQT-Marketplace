# Depth, light and flourish · design-references

Open on any visual job (poster · banner · social post · slide · deck · screen · cover) when the owner's "สไตล์ออกแบบที่ชอบ" asks for depth (`มีมิติ` · `แสงเงา` · `ลูกเล่น`), or when the owner calls a piece flat or bland (`แบน` · `จืด`). The owner asked for this on every design job, not one kind (2026-11-17, from a red-white Thai company profile deck they liked; that deck's full page system is in graphic-design `style-consistency/references/corporate-profile-deck.md`).

Goal: the page reads as 3 layers with one light source, and has 1–2 moving elements, while the text stays flat and easy to read.

## 1 · Build 3 layers

| Layer | What goes there | How it looks |
|---|---|---|
| Back | photo, soft gradient, 1–3 faint diagonal light streaks (not a repeating stripe pattern), a big curved ribbon at one corner | low contrast, slightly blurred or faded into the background colour |
| Middle | white cards, panels, the bottom strip | solid surface with a soft shadow, large corner radius |
| Front | icon tiles, number tabs, labels, buttons, the product | brand colour with its own gradient and a tighter shadow; **crosses the edge** of the card behind it. An icon tile earns its place by that overlap and by meaning something; a tile parked above every card heading is the `no-ai-look` "icon tile above a heading" signal |

In the owner's deck the overlaps carry most of the depth, more than the shadows (eye read 2026-11-17, not measured): an icon tile sitting half over a photo edge, a photo bleeding off the page edge, a label sticking out past a card. Plan at least 2 overlaps per page.

## 2 · One light source

- Pick one light direction for the whole set (default: from the top left) and write it in the style lock. Every shadow falls the other way; every highlight sits on the lit edge.
- Shadow = 2 layers: a tight contact shadow plus a wide soft one, low opacity, tinted toward the background colour, never pure black.
- Starting point in CSS, not measured, tune by eye:
  `box-shadow: 0 1px 2px rgb(20 30 40 / .08), 0 12px 32px -8px rgb(20 30 40 / .14);`
  Front items get a coloured shadow from their own fill, e.g. a red tile `0 8px 20px -6px rgb(200 8 8 / .35)` (also unmeasured).
- Accent shapes get a 2-stop gradient of the same hue, lit corner lighter (e.g. `#e81018 → #c00808`, top left to bottom right; the 2 reds were sampled from the owner's deck ± 8, the rest is a starting point). The gradient makes the lit edge; do not add a 1 px border on a box with a wide shadow (`no-ai-look` signal "line + wide shadow", script rule `hairline-shadow`).
- Photos: light in the photo should agree with the page light. Fade a photo into the background with a gradient mask so the photo and the layout become one picture.

## 3 · Flourish (1–2 per page, not more)

- **Diagonals:** slanted bars before headings, parallelogram labels, a photo cut on a diagonal. They give movement without clutter.
- **Ribbon or sweep:** one large curved band in the brand colour at a page corner, partly behind the content.
- **Light trail with nodes:** a thin glowing line that links 3–5 items, with small bright dots where it meets them. Good on covers and hub diagrams.
- **Glass tile:** a frosted, semi-clear tile only where it sits over a photo, holding one icon.
- **Glow:** only on the single focal item (the hero product, the hub centre). Never on text.

## 4 · Limits (so it does not turn into an AI look)

`no-ai-look` section 2 lists glow circles, frosted glass across the page and line + wide shadow as default signals. The owner's taste is the reason to use depth, but only inside these limits:

- At most 3 depth levels; text and body copy are flat (no text shadow, no glow, no gradient text).
- One light direction for every shadow on every page of the set.
- Glow on 1 item per page; glass only over photos, never as the page background.
- Shadows soft and tinted; if a shadow is the first thing you notice, halve it.
- Text on glass or photo keeps contrast 4.5:1 or more (sample the darkest and lightest pixel behind the text on a screenshot and compute the ratio).
- Keep the colour count: depth comes from light and dark of the same hue, not new colours.

## 5 · Check before sending

1. Squint test: blur the page; you can still tell back, middle and front apart.
2. Every shadow points the same way (look at 3 random items).
3. At least 2 overlaps on the page; the page is not all boxes side by side.
4. Count flourishes: 1–2, and glow on at most 1 item.
5. Read every line of text at 50% zoom; nothing is lost in a glow, glass or photo.

## Tools

| Tool | Depth | Light | Flourish |
|---|---|---|---|
| HTML/CSS | `box-shadow` layers · `z-index` · negative margins for overlap | `linear-gradient` · `mask-image` to fade photos | `clip-path` for diagonals · SVG path for ribbons and trails · `backdrop-filter` for glass (over photos only) |
| Canva | Effects → Shadows (Drop, soft) · arrange forward/back | gradient elements · photo transparency + gradient overlay | rotated rectangles, curve shapes, line + dot elements |
| PowerPoint | Shadow → Outer, offset to match the light | gradient fill (2 stops, same hue) · picture transparency | freeform shapes · parallelogram shape |
| AI image tools | put depth in the brief: "soft light from top left, shallow depth of field" | name the light source and time | never ask the image tool to draw the text; add text as a layer |
