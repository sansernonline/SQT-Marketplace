# Logo · wordmark · brand mark

The full brand set (colours, type, usage rules) lives in `brand-kit`; icon sets with licences in `icon-design` `references/asset-sets.md`. This file is the logo route. Tested 2026-11-19 on a fictional Thai SME payroll SaaS (3 presentation sheets, 1600x900); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## The route: build the mark from real letterforms, not hand-drawn paths

The owner rejected agent-drawn SVG icons (2026-10-26) and called past logos "AI-looking" (2026-11-18). What worked on 2026-11-19:

1. Pick a licensed font (OFL from google/fonts) whose personality fits the brand.
2. Pull the glyph outlines with `fontTools` and build the mark from them plus simple geometry (circles, bars): a Thai ป whose right stem grows a P bowl, a P made of payslip lines, a `j` whose dot becomes a coin.
3. Keep the build script next to the mark so the mark can be rebuilt and edited exactly.
4. Show it on a presentation sheet with a real use (a notification, a payslip, a leave-balance card), not in an empty rounded frame.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Dribbble search `<industry> logo` sorted by Popular | marks with construction grids | likes · views on the shot page (e.g. PayMe by Netguru: 906 likes · 138,280 views; Unipay by Outcrowd: 301 likes · 73,889 views, both 2026-11-19) |
| Agency case studies (Ragged Edge for Wise, Figma blog for Gusto) | why a real brand mark looks the way it does | none; the brand's size is the signal |
| Local competitors' sites (Thai SaaS: FlowAccount, PEAK) | the category average to step away from | reviews or customer counts on their own pages |
| Logopond · LogoLounge | marks built from local scripts | rarely shown |
| Behance | case studies | blocked to scripts 2026-11-19 |

## Beauty rules

1. Recognisable at 16 px and in one colour. Source: uipro `logo-style-guide.md` scalability checklist.
2. Start as a combination mark (mark + word); the mark alone comes later. Source: uipro `logo-style-guide.md`.
3. 1–2 colours; depth only from shades of the same hue. Source: uipro `data/logo/styles.csv` rows Minimalist and Negative Space.
4. Place and trim the font letterforms of rule 5 on a grid or circles, not freehand (PayMe shows its construction circles); the grid places and cuts, it does not draw new paths.
5. Build from a licensed font's letterforms instead of drawing paths (owner rule).
6. The mark carries meaning from the product's world (Thai letter, payslip line, coin) that a competitor could not reuse. Source: `design-gate/no-ai-look` eye gate item 1.
7. Step away from the category average: Thai accounting SaaS uses a light-blue circle with thin caps, or a purple-blue gradient.
8. Shift the brand hue until the eye can tell it from every reference (`design-gate/design-references` step 6).
9. The Thai lockup uses a Thai face whose personality matches the mark (a looped-head mark pairs with a looped Thai face).
10. Large wordmarks can be tracked tighter than text, but check descenders and dots (y, j) for collisions.
11. Make two versions of the mark: a **rich** one with light, shadow and dimensional shape for the hero use (app icon, sheet, signage), and a **flat** one-colour version for 16–32 px and print. The owner rejected a flat mark as stiff on 2026-11-19 ("ขอปรับให้มีลูกเล่นมากกว่านี้หน่อย แสงเงา รูปร่าง"). Depth follows `design-gate/design-references` `references/depth-and-light.md`: one light source, at most 3 layers. Since 2026-11-27 every direction also gets a full-colour **flat design** version, shown beside the rich one, and the owner picks the style ("อยากให้มีการใช้ style flat design ด้วย"). Its rules are in [`flat-design.md`](flat-design.md).
12. Avoid the generic AI marks: letter in a rounded square, gradient blob, swoosh, circuit, infinity (`design-gate/no-ai-look` section 2, Logos).

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A loop on the P's foot read as a key or a music note → used the real Thai ป glyph instead.
- A thin join between bowl and stem → the bowl overlaps into the stem.
- A light streak across the sheet → removed.
- A blue gradient panel read as generic fintech → flat colour.
- App-icon tiles with one letter in a rounded frame → replaced by a real-use card crossing the panel edge.
- A half-empty panel, a cream ring (a colour the owner dislikes) → cropped, removed.

## Check before sending
- [ ] Mark built from a licensed font or simple geometry, with its build script
- [ ] 16 px and 32 px tests on light, brand colour and dark
- [ ] Rich version (light, shadow, shape) and one-colour flat version both work
- [ ] Flat design version per `flat-design.md` (3–4 solid tones, crisp planes, same silhouette) on the board beside the rich one
- [ ] Thai and Latin lockups
- [ ] Mark means something from the product's world
- [ ] Sheet shows a real use, not an empty frame
