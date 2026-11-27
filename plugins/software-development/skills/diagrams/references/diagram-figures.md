<!-- merged from skill `diagram-figures` on 2026-11-27 · description was: Use when a document or slide needs a designed diagram -->
# Diagram Figures — designed figures (HTML template → PNG) for documents, slides and print

> **One rule:** the figure's main colour = the project's main colour. Look for it in the order in step 5. Only if nothing is found, use the house palette `#2A78D6` from `design-gate/parts/polished-document-style/references/theme-colors.md` ("ค่าตั้งต้นประจำบ้าน", the house default).

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search finds this piece's structure). Close the work with a line `ด่านก่อนลงมือ:`.

## Use when
- A figure in a work document (business plan · process chart · research summary · BRD · SRS · ER diagram) or any figure that must look designed: client proposals · slides · print · sign-off documents, including cloud diagrams with real logos.
- The same style generated from data or code (re-issued when data changes, coordinates on a grid) → SVG/Python engine, [`engine-svg-python.md`](engine-svg-python.md).
- Dozens of Mermaid blocks (sequence · state · ER · gantt) going into Word or PDF as hand-drawn-looking figures → Mermaid engine, [`engine-mermaid.md`](engine-mermaid.md).

Not for: a quick diagram in a README · Pull Request · code note → `software-diagrams.md` (plugin `software-development`; for logos in a repo use its `diagrams` library) · how to embed a figure in markdown → `markdown-visuals.md`. Anything read by people outside the team → this skill. This skill costs time (several rounds of fixes per figure), so skip it for in-team figures.

## Steps
1. **Answer 3 questions first.** Where does the figure go (slide 16:9 · A4 page · screen)? Set `.sheet{width:...}` to match: slide 1600px · A4 portrait 1240px · A4 landscape 1750px. Who reads it (non-technical client → box names in Thai; technical team → real service names)? What single question does it answer (1 figure, 1 question)?
2. **Copy one template from `assets/` and edit it; never write your own.** All share colours, sizes, fonts and the line-drawing script.

   | Question the figure answers | Template | Details |
   |---|---|---|
   | Who outside does this system, shop or organisation talk to? (top-level overview, C4 level 1) | [`figure-context.html`](../assets/figure-context.html) | [layout-context.md](layout-context.md) |
   | Where is the real thing, and what is inside? (departments · places · machines; deployment) | [`figure-template.html`](../assets/figure-template.html) | [layout-deployment.md](layout-deployment.md) |
   | Which cloud services are used? (real AWS · Azure · Google Cloud logos) | [`figure-cloud.html`](../assets/figure-cloud.html) | [layout-cloud.md](layout-cloud.md) |
   | What does 1 item (message · order · money) pass through, in what order? (numbered ①–⑥, user → channel → internal → external) | [`figure-flow.html`](../assets/figure-flow.html) · [example](../assets/figure-flow-example.png) | [layout-flow.md](layout-flow.md) |

3. **Header needs all 6 parts:** project logo (`<img class="logo">` → the project's `assets/logo/`; if there is none, say so in the report) · title · 1-line sub-title (what the real thing is, not an expansion of the title) · figure number · version and date · owner. Wrong/right sub-title example: [`design-system.md`](design-system.md), "Figure header".
4. **Sizes.** Sizes, spacing and corners are already in `:root` of `assets/figure-template.html`; do not set new values. Icon frame ≥ 66px (below 56px looks hollow). Connectors vertical or horizontal only, bent with rounded corners; no diagonals. Full table: [`design-system.md`](design-system.md), "Size system" (open when adjusting or writing a template). Text size follows the placed size: for a figure placed in an A4 document, smallest text after placing must be ≥ 7 pt → `minimum px = 0.247 × canvas width(px) ÷ placed width(cm)` (2000px canvas: 29px on a 17 cm page, 20px on 25.7 cm). Make boxes wide enough that Thai names are not cut mid-word. In-document version uses `?embed=1` (hides header); aspect ratio width ÷ height ≥ 1.46 for a landscape page; one `figure-theme.css` for the whole set.
5. **Colour.** Stop at the first hit:
   1. `doc-theme` in the project's documents (`design-gate/polished-document-style`, section "ธีมของเอกสาร").
   2. The project's brand colour: `--primary` · `--brand` · `--accent` in CSS · `primary` in Tailwind / UI theme · `colorPrimary` in a mobile app · brand kit · logo. Read the background colour from the same places (`--background` · `--bg` · dark or light mode), because figures follow the project's design.
   3. Nothing yet → search live per `design-gate/design-references` (plugin `superuser`), type `document`, then extract colours from the chosen work. Use the stored colour library only if live search is not possible.
   4. Live search not possible → use `#2A78D6`, write `(รอยืนยัน)` in the report, carry on without asking, and list a tone from [references/colour-by-domain.md](colour-by-domain.md) for later.

   Never use a colour from an example or reference image. In HTML templates change `--accent` in `:root` (SVG/Python: `ACCENT` in `theme.py`); background that follows the project → append `#accent=<main colour>&bg=<background colour>` to the file name. The 7 icon colour groups (`t-neutral` · `t-edge` · `t-app` · `t-view` · `t-data` · `t-alert` · `t-warn`) and provider/structural exceptions: [`design-system.md`](design-system.md), "Colour system". An 8th colour means colour is used for looks. The main colour must show across the whole figure, with 1 `.focus` card (brand border + glow), a 6px glowing main path and thin grey secondary lines. Full rules: [`focal-point-and-layout.md`](focal-point-and-layout.md).
6. **Icons.** If an official icon exists (AWS · Azure · Google Cloud · Kubernetes · most open-source tools), use it from `assets/icons/` (205 selected) or `python assets/find-icon.py <name>`; groups, commands, licences in [references/icons.md](icons.md). If not, or it is our own system, draw a line icon (`viewBox 0 0 24 24` · `stroke-width 1.6` · no fill · round caps · readable at 24px, max 3 strokes of detail) and footnote that it is not an official logo (the template has this line). Never mix official and hand-drawn icons in one figure. Never use a logo so that it looks like the provider endorses it.
7. **Wires.** Same column → down arrow `.down`. Across columns → the `WIRES` list at the end of the file (`{from, fs, to, ts, tp, label}`); the script draws after layout; never write fixed coordinates. Vertical or horizontal only, rounded bends via `elbow()` (use `mx` when lines share a channel). A label must be narrower than the column gap (longer → raise `gap` of `.stage`). At most 5 cross-column lines per figure, to the smallest correct box. A label says what flows (`HTTPS 443`), not `เชื่อมต่อ`; no label if nothing to say; a not-yet-real connection uses `planned:true` with a footnote. Code example: [`wires.md`](wires.md) (open when writing `WIRES`).
8. **Layout of process and team charts.** Read top to bottom, 1 level per tier (left to right only with a time axis). Middle element (`.focus`) in the centre, whole figure centred. Same-level things in one frame and one row, with a group name on the border; frame is a single line, no fill; equal card height. One line into a frame if all boxes receive the same thing. Line channels outside frames. Bends are curves (~12px radius), cards 14px corners, frames 20px. Every box has a name and a 1-line description. Details: [`focal-point-and-layout.md`](focal-point-and-layout.md).
9. **Thai.** `line-height` ≥ 1.5 and never a fixed height on a text box (upper vowels and tone marks get cut). Description text ≥ 12px. Thai has no word spaces, so put `<br>` yourself in long text, and never break inside words like ทีละ · สต็อก · ร้านค้า · เช็ก (`white-space:nowrap`). Font order `"Noto Sans Thai","IBM Plex Sans Thai",Tahoma,Loma` is set in the templates; if the machine has no Thai font vowels land wrong, so always render and look.
10. **Render and look. Never skip.**
    ```bash
    pip install playwright && playwright install chromium
    cp <skill>/assets/render-figure.py docs/figures/render.py     # first time in the project
    python docs/figures/render.py                  # every figure in docs/figures/src/ → docs/figures/*.png + docs/figures/doc/*.png
    python docs/figures/render.py arch-01 --min-px 20             # chosen figures · smallest text by placed size (step 4)
    python assets/render-figure.py figure.html figure.png 2       # single file (slide · trying a direction)
    python scripts/check-figure-geometry.py docs/figures/src     # exit 0 = pass: diagonals, square corners, overlapping labels, lines over text
    python scripts/check-figure-source.py docs/figures/src       # every figure starts from this skill's skeleton
    ```
    Always use multiplier 2 (1 is blurry when enlarged). Folder mode makes 2 versions per figure (full + `?embed=1`) and checks text smaller than `--min-px`, wrapped names or labels, overflow, overlapping labels: `problems: 0` and exit 0 = pass. Keep `render.py` at `docs/figures/render.py` next to `src/`, never in `_to_delete/` or a scratchpad; never delete `docs/figures/src/` (.png files are only output). Send the client a PNG; keep the HTML source in the repo.
11. If a figure comes out wrong (missing arrowhead, line to the wrong box, missing Thai vowels, label over a box), open the symptom → cause → fix table [references/pitfalls.md](pitfalls.md) before fixing it yourself.
12. Run `design-gate/no-ai-look` item 3 (for HTML, run its script; also eye gate 3.2; 0 findings from the script is not yet a pass). Hand-off by medium: slide → `slide-deck` · Word / PDF → `document-design` · SRS → `requirements-writing` · app screens → `ui-craft`.

## Check before done
- [ ] Every cross-column wire has an arrowhead; no line crosses a box or text; labels readable and not overlapping.
- [ ] Thai text complete (no missing vowels or tone marks, no word cut mid-word).
- [ ] Exactly one `.focus` box; header has all 6 parts; logo shows; figure has a date and owner.
- [ ] Shrunk to 25% width, you can still tell what is where.
- [ ] Smallest text converted to pt at the placed size is ≥ 7 pt.
- [ ] Someone who has never seen the system can answer the original question.
- [ ] Icons are all official or all hand-drawn; no diagonal lines or sharp corners.
- [ ] The line `ด่านก่อนลงมือ:` closes the work.

## References
- [`focal-point-and-layout.md`](focal-point-and-layout.md) — open when styling a figure, laying out a process chart, or sizing for a placed page
- [`design-system.md`](design-system.md) — open for header example, size table, colour groups
- [`colour-by-domain.md`](colour-by-domain.md) — open when the colour step falls to the house palette
- [`icons.md`](icons.md) · [`wires.md`](wires.md) · [`pitfalls.md`](pitfalls.md) — open for icons, `WIRES` code, a wrong-looking figure
