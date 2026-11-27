# SVG/Python engine — figures generated from data or code

Route 2 of `diagrams`. Use it instead of the HTML skeleton when a figure must be generated from data or code. Examples: several figures that must be re-exported every time the data changes, or a figure where you control every position on a grid with right-angle lines and rounded corners.
Python writes the SVG onto the grid, then renders it to PNG. Icons and logos come from the same library as the HTML skeleton ([icons.md](icons.md)).

The cost is time, because 1 figure takes several rounds of fixes. So use it only for figures that people outside the team will see, and see repeatedly.

> **Main colour = the project's main colour.** Find it in the order given in `diagrams` → `references/diagram-figures.md` section 5 (colour system), then put it in `ACCENT` in `theme.py`. Use the house colour `#2A78D6` only when that order finds nothing at all.

---

**Contents**
- [0 · Colour comes from the work — do not stop to ask](#0--colour-comes-from-the-work--do-not-stop-to-ask)
- [1 · Order of work](#1--order-of-work)
- [2 · File layout](#2--file-layout)
- [3 · Rule 1 — grid first, lines after](#3--rule-1--grid-first-lines-after)
- [4 · Connector lines](#4--connector-lines)
- [5 · Labels on lines — only two roles](#5--labels-on-lines--only-two-roles)
- [6 · Zones](#6--zones)
- [7 · Icons and logos](#7--icons-and-logos)
- [8 · Rendering](#8--rendering)
- [9 · Check loop — do not skip](#9--check-loop--do-not-skip)
- [10 · Constants that work](#10--constants-that-work)
- [11 · Legend bar](#11--legend-bar)
- [Abbreviations](#abbreviations)

## 0 · Colour comes from the work — do not stop to ask

**If the source document already declares a `doc-theme`, use that value and do not ask again.**
(See `design-gate/polished-document-style`, section "Document theme".) If there is none yet, follow the steps below, then write the result back into `doc-theme`.

**No brand colour → follow the order in `diagrams` → `references/diagram-figures.md` section 5:** use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation) in the report, and carry on without stopping to ask.
Put a tone suggested from the content, using the table in [colour-by-domain.md](colour-by-domain.md), in the report so the user can choose later.

Put **one main colour** in `ACCENT` in `assets/svg-engine/theme.py`. All light and dark shades
are computed from it with `tint()`, so the drawing code has no other colour hard-coded.

The only colour not tied to `ACCENT` is `EXCEPT_HUE`, for the "exception" label. It must always differ from the main colour.
If the main colour is already orange, change `EXCEPT_HUE` to another contrasting colour.

---

## 1 · Order of work

1. Read all existing diagrams first, then ask **what question this figure answers**. 1 figure answers 1 question.
2. Pick the colour by section 0 (no colour → house value + `(รอยืนยัน)`).
3. **Place every box on the grid before drawing any line.** This is the most important step. See section 3.
4. Finish `theme.py` and `ref.py` first, then write the figure file.
5. **Render, then open the image file and look at it.** Checking that the script ran without errors is not enough.
6. Once the figure is clean, write it to the target folder. Move the old figure to `_to_delete/`.

---

## 2 · File layout

```
architecture/
  01-system-context.png      ← output; the number prefix follows reading order
  _src/
    theme.py                 ← all colours — edit here only
    ref.py                   ← visual language: zones, units, lines, labels, legend bar
    render.py                ← SVG → PNG with Playwright at 2x
    d01.py … dNN.py          ← one file per figure; layout only
    logos/                   ← product logos + colors.json
```

Copy the whole folder [`assets/svg-engine/`](../assets/svg-engine/) to `_src/` and start from there. [`d01.py`](../assets/svg-engine/d01.py) is a sample figure that really renders.

---

## 3 · Rule 1 — grid first, lines after

Diagonal lines are hard to read, and bending the lines afterwards does not help. **Fix the positions.**

```python
CA,CB,CC,CD,CE,CF = 178,452,678,896,1080,1312   # columns
R1,R2,R3          = 288,458,624                  # rows, spaced ~170 apart
```

Every box sits on an intersection of a column and a row, and none strays off the grid.
When all points sit on the same lines, the connectors are right-angled by themselves with no bending.

### Midpoint rule

A node that receives from several paths must sit **midway between those paths**, not stick to one row.
If it also sends on to several paths, it must sit midway between the outgoing paths too.

Use **one merge point and one split point** so the lines are symmetric.

```python
RM = (R1+R2)//2      # Nginx sits midway between the two incoming rows
J1, J2 = CB-74, CB+86

flow([(CA+34,R1),(J1,R1),(J1,RM),(CB-30,RM)])   # enters from above
flow([(CA+34,R2),(J1,R2),(J1,RM),(CB-30,RM)])   # enters from below
flow([(CB+30,RM),(J2,RM),(J2,R1),(CC-30,R1)])   # leaves going up
flow([(CB+30,RM),(J2,RM),(J2,R2),(CC-30,R2)])   # leaves going down
```

### Wiring channels

A line that must cross the grid **must not run over a row that holds boxes.** Reserve separate channels for it.

```python
TB = 238        # top channel — at least 36 from the zone edge
MB = R3-48      # middle channel — between rows
```

---

## 4 · Connector lines

All lines are right-angled, with corners rounded at radius 14. This makes the figure look much more refined without losing clarity.
`ref.flow(pts, dashed=False, arrow=True)` computes the rounded corners itself.

**The arrowhead must end at the icon edge, not at the name label.** For example `CD-30` when the icon is 46 wide.

---

## 5 · Labels on lines — only two roles

| Role | Colour | Use for |
|---|---|---|
| Normal | light shade of `ACCENT` | what normally flows along the line |
| Exception | `EXCEPT_HUE` | a path that does not pass the front gate · special cases |

**A figure may have only one exception label.** If there are 2 or more, no label really stands out.

A label says **what flows through**, such as `SQL` `/api/` `DICOM 11112`, not `เชื่อมต่อ` (connect).

---

## 6 · Zones

A zone is a frame with a very light fill. Its name label is a white capsule that straddles the border and has a coloured dot in front.

```python
zone(x, y, w, h, "ห้อง Server ของโรงพยาบาล", "physical")
```

| Type | Line | Meaning |
|---|---|---|
| `physical` | solid | A real physical boundary: room, building, machine |
| `logical` | dashed | A logical boundary: Docker Compose · namespace · VPC |
| `outside` | dashed | Outside the system we look after |

The reader sees at once which one physically exists. Nest zones no more than 3 levels deep.

---

## 7 · Icons and logos

Icons **float on the background with no frame and no tile.** The name and description sit below the image.

```python
unit(cx, cy, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx")
#  logos/<slug>.svg exists → use the real logo, filled with the colour from colors.json
#  does not exist         → use a line symbol of our own design
```

Values that work: icon 46 · name 11.5 bold, placed `size/2+20` from the centre · description 10, placed `size/2+35` from the centre.

Take logos from this skill's icon library ([icons.md](icons.md)). Run `python assets/find-icon.py --group brands <name>` from the `diagrams/` folder, then `--copy` the result into `_src/logos/`.
Simple Icons gives single-colour SVG with `viewBox 0 0 24 24` and comes with `colors.json`, which holds each brand's official colour code.

### Trademarks — do not skip

- A logo belongs to its owner. You may use it to refer to the product itself in the diagram,
  but **do not alter its shape, do not stretch or squash it, and do not make it look as if the owner endorses the figure.**
- If a product has no logo file, use a symbol instead, and **name that product in the note under the figure.**
- Do not download new logos on your own. Use the set that exists, or have the user get them from that project's brand page.

---

## 8 · Rendering

```bash
pip install playwright && playwright install chromium
python render.py d01.svg ../01-architecture.png 1400 860
```

Always render at 2x, because 1x gives a blurry image when enlarged on a slide.

Thai text needs a Thai font on the machine that renders, declared in the `font-family` of `<svg>`.
**Do not use Python Imaging Library (PIL) to draw mixed Thai and English text**, because it produces square boxes in place of letters.

---

## 9 · Check loop — do not skip

Render → open the image and look → fix → render again, until it is clean.
**These 6 problems come up every time. Check them in every round:**

1. **A label on a line covers an icon or a name.** Move it to the midpoint of the longest segment, or onto the stub.
2. **A line leaving an icon cuts through its own description.** Start the line at `cy+58`, not `cy+32`.
3. **A zone edge cuts the description of the bottom row.** The zone's bottom edge must be ≥ `R_bottom + 58 + 24`.
4. **Zone caption text sits on the border.** Merge it with the name into one capsule.
5. **An arrowhead ends at the name label, not the icon.** Make it end at the icon edge.
6. **Text overflows its frame.** Thai 11.5px ≈ 6.0 px/char · heading 15px ≈ 7.5 px/char.
   If space is short, cut words. **Do not shrink the font.**

---

## 10 · Constants that work

```
width 1400 · margin 56
centred title 22 · subtitle under title 12.5
unit name 11.5 bold · description 10 · label on line 10.5
connector 1.6 · zone border 1.4 · corner radius 14 · label height 21
```

---

## 11 · Legend bar

Every figure ends with a single bar that says what each kind of frame means and where the 2 label colours differ.
After it come 2–4 lines of notes. These include the trademark line and references to other related figures.

---

## Abbreviations

- **SVG** — Scalable Vector Graphics
- **PNG** — Portable Network Graphics
- **PIL** — Python Imaging Library
