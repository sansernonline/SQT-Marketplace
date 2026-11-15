# Entry from .pptx → .html

An extension of [`SKILL.md`](../SKILL.md) · use it when a .pptx already exists, or when you must deliver both .pptx and .html from one source · the `scripts/` and `assets/` paths in this file count from the `html-slide-deck/` folder · this route uses the scripts `pptx_to_html.py` `check_html_deck.py` `click_steps.py` and does not use `build_deck.py`

> **One rule of this route:** the look comes entirely from the .pptx · fix the .pptx and convert again, never edit a converted .html.


The model is the Independent Study (IS) presentation deck "Few-shot Key Information Extraction (KIE) · Confidence-Gated Cascade" (41 slides + 15 interactive pages): finish the .pptx first, then convert it into one .html file where every piece slides in one row at a time, with a progress bar, table of contents, speaker notes and a clock, in the style of the X Fitness deck.

## When to use

- A .pptx already exists (made by hand in PowerPoint · `StageDeck` · `BrandDeck` · received from a customer) and you want to present it with browser animation
- You must deliver both .pptx (for people to keep editing) and .html (opens on any machine) from one source
- You want to add interactive pages (type a number and calculate · play step by step) between the PowerPoint pages

## 1 · Steps

1. **Finish the .pptx first** — colours and mood come from the source work, following `presentation-design` [`references/deck-theme.md`](../../presentation-design/references/deck-theme.md) (extract colours with `presentation-design/scripts/source_palette.py` · light background is the default · section-divider slides are a full sheet of the main colour, which `StageDeck(..., block=True)` does) · if the source work has no colours and no look yet → **search for a model first:** take the project's words and search live following `design-references` (plugin `superuser`) type `slide`, then extract colours from the chosen work · the stored palette library is for when a live search is not possible · no .pptx → build one with `branded-document-design` (`StageDeck`) · the slide title goes in the title placeholder (it becomes the name in the table of contents) · put speaker notes in notes · split into parts with PowerPoint Sections (they become groups in the table of contents)
2. **Steps you want to open one click at a time** — in PowerPoint add On Click animation · when building with python, use `scripts/click_steps.py`:
   ```python
   from click_steps import add_click_steps
   add_click_steps(slide, [[box1, label1], [arrow, box2], [box3]])   # 3 steps · PowerPoint plays it the same way
   ```
3. **Convert:**
   ```bash
   python scripts/pptx_to_html.py docs/<PRJ>-DECK-v1.0-DRAFT.pptx -o docs/<PRJ>-DECK-v1.0-DRAFT.html --title "<deck title>" --accent <project main colour, none → 2A78D6>
   ```
   `--accent` = colour of the progress bar and buttons (omitted = the theme's accent1) · images are embedded for you · a line `⚠ แปลงไม่ครบ` (conversion incomplete) must be fixed in the .pptx (step 4)
4. **Check:** `python scripts/check_html_deck.py docs/<file>.html --out _to_delete/deck-check --pptx docs/<file>.pptx` → fix until **0 problems**, then **open every `sheet-*.png` and look at each sheet**
5. Rehearse 1 round with the clock (press T) · press → to step through every step to the end

## 2 · What converts to what

| In .pptx | In .html | Entrance |
|---|---|---|
| Title (placeholder) | Text · name in the table of contents | Shoots in from the left (the cover floats up) |
| Text box · text in a shape | Position, size, colour, font, alignment, bullets, line spacing as in the source | Floats up |
| Rectangle · rounded · oval · donut · diamond · arrow · chevron · hexagon | Box / SVG | Bounce · an oval has a rippling ring |
| Line · connector (straight and elbow) · arrowhead · dashed line | SVG | Drawn along the direction of the line |
| Picture (including crops) | Embedded as base64 | Bounce |
| Table (including merged cells · table style derived from accent1) | `<table>` | Appears one row at a time |
| Column/bar · line · pie · donut charts | SVG redrawn from the data in the chart | Bars grow · values pop up after |
| Big number ≥ 22 pt such as `88.1%` `1,244` | — | Counts up from 0 |
| Group (any depth of nesting) | Broken into pieces, exact coordinates | Follows the pieces |
| On Click animation | `data-step` | A step of the page's player · ↓ opens one step at a time · Space plays by itself |
| notes · Section · slide/layout/master background | `<aside>` (press N) · group in the table of contents (press M) · background | — |

Entry order: upper rows before lower rows, pieces in the same row enter together, and text in a box enters 0.35 beat after the box · turns itself off when the machine is set to reduced motion

**Cannot convert** (lines marked `⚠` during conversion · fix in the .pptx):
- A hatched warning box appears in place of that piece: SmartArt → break into shapes (Convert to Shapes) · video, audio · area chart · scatter · a chart whose data cannot be read
- Converted in a simplified way: combo chart (shows only the first type) · unusual shapes (drawn as a rectangle) · vertical text (shown horizontally)
- Not converted and no warning: shadows · 3D · text outline · transitions between slides

## 3 · Keys of the .html (added for you)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click the left or right edge · swipe the screen | Changes page only, does not touch the steps in the page |
| Space | Play / stop the player of that page (opens the next step by itself every 1.6 seconds, stops at the last step) · does nothing on a page with no steps |
| ↓ · ↑ | Next step · previous step |
| Change page | The player returns to step 0 and stops every time, both going forward and going back |
| M · N · T · F · R | Table of contents · notes · clock · full screen · replay animation |
| P | Plays the whole deck by itself every 2.6 seconds (every step, then the next page) |
| `#12` at the end of the URL · bottom bar | Opens at page 12 · point to see the page name, click to jump |

## 4 · Interactive pages (insert by hand)

Pages PowerPoint cannot do (type a value and calculate · try changing rules · walk through a document step by step) are written as HTML and inserted between pages:

```bash
python scripts/pptx_to_html.py deck.pptx -o deck.html --insert 9:demo/flow.html --insert 28:demo/try-rules.html
```

- Copy `assets/interactive-page.html` as a starting point · 1 file can hold several pages as `<section class="slide" data-menu="▶ ลองเอง · …">` plus its own `<style>` and `<script>`
- Coordinates are px on a 1920 stage · use the same `class="s"` + `data-a` + `--k` + `data-step` as the converted pages, so pieces enter and step back the same way
- Start ids and classes with the page name (`ip-`) to avoid clashing with other pages · typing in an input field does not change the page (the runtime handles it)
- Numbers on an interactive page come from the real results of the work, and the source is stated in the page's foot

## 5 · Check before sending

- [ ] `pptx_to_html.py` prints no `⚠ แปลงไม่ครบ` line, or you know what each line is and accept it
- [ ] `check_html_deck.py --pptx` shows 0 problems · page and step counts match the .pptx · pressing ↓ through every step and → through every page reaches the end of the deck · entering a new page puts the player at step 0
- [ ] Open `sheet-*.png` and compare every sheet with the .pptx: text does not overlap · Thai fonts are not distorted · chart values match
- [ ] The fonts in the .pptx exist on the machine that will present (if not → use Tahoma / Leelawadee UI instead, text may grow longer and overflow the box)
- [ ] Every page has notes · no real customer data in the file
- [ ] Speaker notes in `<aside>` are written the way they are really spoken: use ครับ/ค่ะ and ก็ freely, not document language

## 6 · Anti-patterns

- **Editing a converted .html** — it is lost on the next conversion · fix the .pptx or the `--insert` file and convert again
- **Making every piece On Click** — the audience must click hundreds of times · use steps only when telling a sequence (system steps · revealing an answer)
- **Text packed to fill the box exactly** — a font on another machine that is slightly wider will overflow · leave 10% free space in the box
- **A chart as a picture** — after conversion it has no animation and its values cannot be edited · use PowerPoint's own chart

Before sending, go through the section "Not looking AI-made" (`ไม่ให้ดูเหมือน AI ทำ`) at the end of [`SKILL.md`](../SKILL.md), the same as for a deck written directly.
