# Flat design · design-by-type

Open when making a logo or icon (every time), or when a poster, banner, cover or slide gets a flat direction. On 2026-11-27, after the CodeRuen depth round, the owner asked: "อยากให้มีการใช้ style flat design ด้วย". Every logo direction now ships in two styles side by side: **depth** (light, shadow, gradient, per `polish.md`) and **flat design**. The owner picks the style along with the direction.

Flat design is not the one-colour version. The one-colour version (logo rule 11) is for print and 16 px. Flat design is a full-colour style of its own, with control instead of light.

## What makes it flat design

- **3–4 solid tones from the brand**: main, dark, light, accent. No gradient, blur, glow, grain, gloss or drop shadow.
- **Depth only from crisp planes**:
  - a two-tone split, where the far half or side is the dark tone at about 20% over the main;
  - a hard offset copy in a darker or lighter tone (2–6 % of the mark, no blur);
  - a cut-out gutter where two parts cross, so the overlap reads as deliberate.
  These come from the depth version's own layers: drop the blur and gradient, keep the plane.
- **One accent per mark**, the idea's key part (CodeRuen: the mint door, slash or braces). Never two accents.
- **Geometry is the craft.** With no light to hide behind: one stroke weight, one corner radius, optically centred, curves that join without kinks. Check at 200 % zoom.

## How to build it

1. Start from the same flat master that the depth version uses (`design-gate/design-references` `references/ref-to-design.md`, rule 39), so both styles share one silhouette.
2. Write the flat version as its own function next to the depth one. Do not strip filters off the depth render. (CodeRuen `crmarks.py`: `a_flatd` · `b_flatd` · `c_flatd`.)
3. Put both styles on the board: one row per style for each direction, with the same sheet layout and mockups, labelled `มีมิติ` and `flat design`.
4. Below 20 px, both styles use one simplified silhouette with the accent kept. Inner detail like `</>` or a cursor turns to blobs at 16 px (CodeRuen critic, 2026-11-27).

## Scoring

Score with `wow-score.md`. Criterion 4 measures how well the flatness is controlled: 2 = planes and offsets agree with one implied light and every edge is crisp, 1 = flat but planes are random, 0 = it looks unfinished. A flat version can beat the depth one. In the CodeRuen round the critic placed the Thai-roof flat version at 7–8, above its depth version.

## Do not

- Do not use long-shadow (a 45° shadow running off the mark). It reads as a 2013 template.
- Do not add a gradient "just a little". That makes it a weak depth version, not flat design.
- Do not use a different silhouette from the depth version. Then the board shows 6 marks, not 3 directions in 2 styles.
