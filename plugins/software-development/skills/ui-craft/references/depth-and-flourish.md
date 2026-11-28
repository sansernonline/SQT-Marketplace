# Depth and surface flourish (depth and flourish)

Realistic shadows, paper surface, clay and torn edges, for screens and mockups · use together with `SKILL.md` section 4 (shadow only for things that really float · 3 depth levels · still cards get no shadow), not instead of it
The web app's shadow tokens (`--shadow-color` · `--elev-1` to `--elev-3` · the nested-corner formula) are in `ui-craft` part `web-app-design` → `references/tokens.md` · the looks that use each language are in [`web-looks.md`](web-looks.md)

## Contents

1. [The 6 principles](#the-6-principles)
2. [Depth languages, choose one](#depth-languages-choose-one)
3. [The 10 recipes](#the-10-recipes)
4. [Browser support](#browser-support)
5. [Sources](#sources)

## The 6 principles

| # | Principle | How | Source |
|---|---|---|---|
| 1 | Light comes from one direction | Every shadow on the page is offset the same way, normally light from above and shadow falling down · every layer uses the same ratio of horizontal to vertical offset | CM |
| 2 | A shadow has 2 parts | A wide, soft, faint layer for ambient light + a narrow, dark layer tight to the object for the corner light cannot reach · the higher the object floats, the further the wide layer is offset, the blurrier and fainter it gets | RU · CM · VC |
| 3 | Tint the shadow toward the background color | A shadow on a colored background uses a dark shade of the same hue as the background · translucent black makes a colored background look dull gray | CM · VC |
| 4 | Design in gray first | Set the order with spacing, size, weight and gray intensity completely, then add color · if all-gray still does not read as an order, adding color will not help | RU |
| 5 | Order with only one of them | 1 level uses size, or weight, or color, only one · all 3 at one spot is shouting, and no other level has any way left to stand out | RU |
| 6 | A raised surface has a light top edge | Light from above hits the top edge of a raised button or panel, so it has a 1px light line on top · a sunken surface (input field) is the reverse, with the shadow at the top inside the field | RU |

## Depth languages, choose one

The whole project uses 1 of these 4 languages and records it on the same line as the app character in the first-line comment of the token file (`/* app-character: 3 lifestyle · look: paper/print · depth: กระดาษ */` — `กระดาษ` means "paper") · mixing several languages on one page, such as a clay card beside a glass panel beside torn paper, is a sign of AI drawing (`design-gate/no-ai-look` catalog item 6, one visual language)

| Language | Look | Recipes | looks |
|---|---|---|---|
| Layered shadow (เงาซ้อน) | Floating things have a multi-layer single-direction shadow, top edge catching light | 1 · 2 · 3 · 5 · 8 · 10 | skeuomorphic · glass/tech · soft SaaS |
| Clay (ดินปั้น) | A puffy soft lump with volume | 4 · 8 | claymorphism |
| Paper (กระดาษ) | Stacked sheets, grain, torn edges, cutouts laid on the background | 6 · 7 · 8 · 9 | paper/print · Thai craft |
| Flat with lines (เรียบมีเส้น) | No blurred shadow; separate with a 1px line and a background of a different shade · the thick version uses a 2–3px border with a solid, unblurred shadow | 3 (translucent border only) · 9 | quiet utility · editorial · bento · luxury · neobrutalism · playful |

Recipe 10, the type part (the last 2 lines), works in every language

**Rules**

- Never animate a layered shadow (`transition` or `@keyframes` on a multi-layer `box-shadow`), because the browser must redraw the blur every frame · to change the shadow on hover, put the second shadow set in `::after` and change its `opacity` instead
- Recipe 7 is an SVG filter that is recomputed on every paint; use it on small still pieces, never on large areas or moving things · recipe 6 is a small background image repeated as a pattern, much lighter, and can be used on large backgrounds
- Everything that moves (squash on press · shadow change · line drawing in) is turned off in `@media (prefers-reduced-motion: reduce)` per `SKILL.md` section 7
- A dark theme hardly shows shadows; raise levels with progressively lighter surfaces instead · the paper and clay languages must be tried in both themes before choosing
- Cards in a list stay flat in every language, except soft SaaS on a persuasion page (landing · sales page), where content cards may use the lower 2 layers of recipe 1 and a standout piece uses all 4 layers (like the stripe.com page the user chose 2026-10-28) · clay and paper give depth only to the page's standout piece, and no more than 3 levels per `SKILL.md` section 4 · an app page used all day stays flat

## The 10 recipes

All the code is written by us and is short enough to paste into the project's css file · color values are examples; use the project's tokens instead · `--shadow-color` is defined in recipe 1 · every recipe uses light from above

### 1 · Layered multi-layer shadow

For floating things that must look soft and real (main menu, floating panel) · every layer is offset downward only, the offset doubles each layer, blur is 2 times the offset, and intensity falls layer by layer

```css
:root { --shadow-color: 223 47% 15%; }  /* hue เดียวกับพื้น · พื้นเปลี่ยน hue เปลี่ยนตาม */
.lifted {
  box-shadow: 0 1px 2px hsl(var(--shadow-color) / .09),
              0 2px 4px hsl(var(--shadow-color) / .07),
              0 4px 8px hsl(var(--shadow-color) / .06),
              0 8px 16px hsl(var(--shadow-color) / .05);
}
```

### 2 · 2-part shadow

The economy version of recipe 1 for dropdown · tooltip · toast · same values as `--elev-2` in `tokens.md`

```css
.menu {
  box-shadow: 0 1px 3px hsl(var(--shadow-color) / .14),   /* แคบ เข้ม: ใต้ชิ้น */
              0 8px 20px hsl(var(--shadow-color) / .08);  /* กว้าง จาง: แสงรอบตัว */
}
```

### 3 · Crisp border + concentric corners

A translucent border suits every background color (dark theme changes it to `hsl(0 0% 100% / .1)`) · the inside item's radius equals the outer corner minus the distance from the edge, so the 2 curves are parallel

```css
.popover {
  --r: 14px; --pad: 6px;
  border-radius: var(--r); padding: var(--pad);
  border: 1px solid hsl(var(--shadow-color) / .12);
  box-shadow: 0 4px 12px hsl(var(--shadow-color) / .10);  /* เบลอต่ำกว่า 24px ไม่ชนกฎ hairline-shadow */
}
.popover > * { border-radius: calc(var(--r) - var(--pad)); }      /* 14 − 6 = 8 */
```

### 4 · Clay volume

A puffy lump, dark belly, lit back, shadow falling on the ground in the same direction as the light · use on a few standout pieces per page

```css
.clay {
  border-radius: 24px;                                   /* ตั้งแต่ 28px สคริปต์ no-ai-look ฟ้อง huge-radius */
  background: hsl(24 85% 62%); color: hsl(24 60% 18%);   /* ตัวอักษรเข้ม 5.4:1 */
  box-shadow: inset 0 -6px 12px hsl(24 60% 35% / .35),   /* ท้องมืด */
              inset 0 6px 10px hsl(0 0% 100% / .45),     /* หลังรับแสง */
              0 12px 20px hsl(24 50% 30% / .20);         /* เงาตกบนพื้น */
}
```

### 5 · Top edge catching light + pressed-in type

Skeuomorphic raised buttons and labels that look pressed into the material (letterpress)

```css
.key {
  background: linear-gradient(hsl(220 14% 97%), hsl(220 12% 91%));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / .7),          /* ขอบบนรับแสง */
              0 1px 2px hsl(var(--shadow-color) / .18);
}
.stamped { color: hsl(220 10% 38%);                        /* 5.3:1 บนพื้นด้านบน */
           text-shadow: 0 1px 0 hsl(0 0% 100% / .8); }      /* ขอบล่างของร่องรับแสง */
```

### 6 · Paper grain

A small SVG file repeated as a background pattern · the filter box equals the image exactly (`x` `y` `width` `height`) so the seams of the pattern do not show · for single-file deliverables, embed it as a data URI

```html
<!-- grain.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#g)" opacity=".08"/>
</svg>
```
```css
.paper { background: var(--paper) url(grain.svg); }   /* --paper = สีกระดาษของแบรนด์ */
```

### 7 · Torn edge

A sheet of paper with an uneven edge · distort only the base sheet in `::before`; the text is not distorted with it

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="torn"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter>
</svg>
```
```css
.note { position: relative; isolation: isolate; }
.note::before { content: ""; position: absolute; inset: 0; z-index: -1;
                background: var(--paper); filter: url(#torn); }
```

### 8 · Shadow of a free-form shape

Cutouts with a transparent background (PNG · SVG), for example the paper-cut question mark from the template in `image-generation` of plugin `graphic-design` · `box-shadow` gives only a rectangular frame; `drop-shadow()` follows the real shape · an image that already has its own shadow needs none added

```css
.cutout {
  filter: drop-shadow(0 1px 1px hsl(var(--shadow-color) / .30))    /* ชิดขอบ */
          drop-shadow(0 6px 8px hsl(var(--shadow-color) / .16));   /* ตกบนพื้น */
}
```

### 9 · duotone

Unify photos from several sources into one set with the brand's 2 colors (the dark part is `--duo-dark`, the light part is `--duo-light`) · never use on images that must show true color, such as product photos

```css
.duotone { position: relative; isolation: isolate; background: var(--duo-light); }
.duotone img { display: block; width: 100%; filter: grayscale(1) contrast(1.1); mix-blend-mode: multiply; }
.duotone::after { content: ""; position: absolute; inset: 0; pointer-events: none;
                  background: var(--duo-dark); mix-blend-mode: lighten; }
```

### 10 · Soft raised object with gradient + tidy type

A knob or dial with a real function (a decorative floating circle is an AI sign in `design-gate/no-ai-look` item 6) · the last 2 lines work in every depth language

```css
.knob {
  border-radius: 50%;
  background: radial-gradient(circle at 50% 28%, hsl(220 10% 96%), hsl(220 8% 78%) 60%, hsl(220 8% 62%));
  box-shadow: 0 2px 3px hsl(var(--shadow-color) / .25), 0 8px 16px hsl(var(--shadow-color) / .12);
}
h1, h2, h3 { text-wrap: balance; }                       /* หัวข้อแตกบรรทัดยาวพอกัน */
.num, td.amount { font-variant-numeric: tabular-nums; }  /* ตัวเลขกว้างเท่ากัน คอลัมน์ตรง */
```

## Browser support

Checked on MDN on 2026-10-23; every item in this list is Baseline widely available: `text-wrap` works in all major browsers since Mar 2024 (`balance` balances only text of at most 6 lines in Chromium and at most 10 lines in Firefox, so use it on headings, not paragraphs) · `font-variant-numeric` and `mix-blend-mode` since Jan 2020 · `drop-shadow()` since Sep 2016 (does not accept spread and `inset`) · `<feTurbulence>` and `<feDisplacementMap>` since Jul 2015

## Sources

| Code | Source |
|---|---|
| CM | Josh W. Comeau "Designing Beautiful Shadows in CSS" https://www.joshwcomeau.com/css/designing-shadows/ (published 2021-09-13 · last updated 2026-04-27 · opened and checked 2026-10-23) · principles only, no code copied |
| RU | The book Refactoring UI by Adam Wathan and Steve Schoger (a commercial book · principles summarized in our own words, no text quoted · the book was not opened for checking this round) |
| VC | vercel-labs/web-interface-guidelines `README.md` sections layered shadows · crisp borders · nested radii · hue consistency (MIT · checked 2026-10-23) |
| Other | Clay: Smashing Magazine "Claymorphism: Will It Stick Around?" by Adrian Bece 2022-03-16 · grain: CSS-Tricks "Grainy Gradients" by Jimmy Chion 2021-09-13 (both opened and checked 2026-10-23) · all 10 recipes' code written by us |
