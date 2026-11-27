<!-- merged from skill `branded-document-design` on 2026-11-27 · description was: Use when a Word, PowerPoint or PDF or its cover must look designed -->
# Branded Document Design — .docx / .pptx / .pdf that looks intentionally designed

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls color and fonts; the search is for this piece's structure) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** an exported document has one color set, and one set of type sizes and spacing that is the same on every page. It must not look like someone opened Word and just typed.

## Use when
- The output is a .docx / .pptx / .pdf (quotation · business plan · report · contract · SRS) that a customer, executive, or another team will open, or that must be signed off or attached to a contract
- A document set needs its own cover from the logo shape or a real mockup, or covers look alike across projects → step 3 and `cover-design.md`
- Mixed Thai–English documents (they break easily if fonts are not fully set)
- The same kind of document is issued repeatedly and every copy should look the same
- Not for: markdown output → `design-gate/polished-document-style` · reading or extracting a received Office file → `anthropic-skills:docx` · `xlsx` · `pptx` · `pdf` · diagrams in markdown → `diagrams` · a whole-book report from one Markdown file → `markdown-report-docx.md`

Order: write the content as markdown first (`design-gate/polished-document-style`), then render it with this skill. Always fix content in the markdown (the source).

Install before use: `pip install python-docx python-pptx` · LibreOffice (`soffice`) to convert to PDF · `pdftoppm` (poppler) to convert to images.

## Steps
1. **Colors.** If the source markdown has a `doc-theme`, use it: do not ask, do not set a new one (`design-gate/polished-document-style`, "ธีมของเอกสาร"). Otherwise look in the order in `diagrams` → `references/diagram-figures.md` item 5 (`doc-theme` → brand colors in code, logo, brand kit → nothing). If there is nothing, search live for reference designs per `design-gate/design-references` (plugin `superuser`), type `document`, then extract colors from the chosen work (stored palette library when live search is impossible). If live search is impossible, use the house color `#2A78D6`, write `(รอยืนยัน)` in the report, and carry on without asking; put a tone suggested by the content in the report for the user to choose later ([`palette-examples.md`](palette-examples.md)). A customer's brand colors always win. Write the colors back into `doc-theme` in the markdown so document, figures, and slides match.
   - **One main color.** All light and dark shades are computed from it. Only the status colors (success · warning · error) are independent and keep their meaning.
2. **Continue the look of the brand or app, before the first render.** The skill's defaults (Tahoma · solid color band cover · lines in every table cell) are the floor, not the deliverable look.
   - Is there an identity already? Check the brand kit (`graphic-design:brand-kit`), `assets/logo/`, `docs/design/`, a mockup that passed the beauty gate (score in `docs/BUILD-PLAN.md`), field `doc-theme` in `docs/README.md`. If yes, use the same logo (cover + page header), colors, and patterns as the app. If no, follow step 1.
   - Do 1 direction first. Only if the user is not wowed or asks for several, do 3 directions, have 2 outside reviewers score them, and run the document beauty gate (`ด่านสวย`, ceiling 3 rounds, record every score in `docs/BUILD-PLAN.md`): [`identity-and-gate.md`](identity-and-gate.md).
   - Work on the render script, not on .docx files one by one; render every copy.
   - **Fonts:** the brand's Thai font installed and embedded (`embed_fonts`) · Tahoma when embedding is impossible · never set Thai text in a mono font (no Thai letters in Cascadia/Consolas); mono is for code, keys, and numbers.
   - Figures in documents, beauty-gate rules, cover: [`word-layout.md`](word-layout.md), section at the end.
3. **Cover for this document set.** For a software document set (BRD · SRS · FSD · ARCH) whose cover must come from the logo shape or a real mockup, follow [`cover-design.md`](cover-design.md) (page system · registry · checks · cover engine `scripts/cover-engine/`). If the default cover looks like another job's, do 1 direction first; only if the user is not wowed or asks for several, run the 3-direction, 2-of-3 vote in [`cover-vote.md`](cover-vote.md).
4. **Tokens, never hardcode colors outside them.** `brand` · `brand_2` · `brand_deep` · `brand_tint` · `brand_tint_2` · `text` · `text_body` · `text_muted` · `line` + 6 status colors (success · info · warning · error · accent · neutral) that do not change with the brand. Set the values once with `use_brand(...)`.
   - Choose colors by meaning (red = danger/real error only); same meaning set as diagrams.
   - Contrast: body text and `text_muted` on the background ≥ 4.5:1 · H2 and table headers (`brand_deep`) ≥ 7:1 · H1 and KPI numbers (`brand`, large) ≥ 3:1 · `use_brand()` stops if it fails · in black and white the hierarchy must still read · if it fails, adjust darkness, not the color.
   - Text is never pure black (use `text_body`) · no type size outside the scale (Word body 11pt · slides 17pt).
   - Full token table, color meanings, type scale, elements: [`tokens-and-type.md`](tokens-and-type.md).
5. **Fonts and Thai.** Word treats Thai as a complex script: never set font/size/bold by hand; use `style_run()` in `brandkit.py` (sets `w:szCs` `w:bCs` `w:iCs` and all 4 slots of `w:rFonts`). If Latin and Thai fonts differ, set `bk.FONT` and `bk.LATIN_FONT`, then call `bk.thai_runs(doc.element.body)` and on every header/footer before `save()`. Line spacing 1.3–1.35 (Tahoma) · never justify Thai paragraphs · to send a PDF, export from real Word or check by eye (LibreOffice breaks Thai differently) · Linux has no Tahoma, use Loma/Sarabun · ReportLab places tone marks wrongly. Traps and embedding: [`thai-fonts.md`](thai-fonts.md).
6. **Word page structure.** Cover (project logo and mockup exist → project-specific cover per step 3; else the default) → table of contents → body (H1 numbered, keep-with-next on headings) → sign-off table · footer "หน้า N" centered, gray 9pt · A4, content width 17 cm = 9638 twips (`BODY_TWIPS`) so column widths add up. Full structure and dark cover (`doc.cover(..., style="night")`): [`word-layout.md`](word-layout.md).
   - Cover background image and logo never go in the first-page header (Word shows them faded); anchor them to the cover's first paragraph. Inner-page table headers never use a full-width solid dark fill.
7. **Use the elements** `cover()` · `table()` · `pill_table()` · `kpi_row()` · `callout()` · `figure()` · `code()` · `signoff()` (methods in `tokens-and-type.md`). At most 3–5 callouts per 10 pages · KPI strip of 3–5 cells · a table over 6 columns goes on a landscape page (`landscape_section()`).
8. **Use brandkit.** `from brandkit import BrandDoc, use_brand, to_pdf` (put `scripts/` on the path) · slides → `brandkit_pptx.BrandDeck` · speaking deck → `brandkit_stage.StageDeck` (default: `accent`/`bg` from the source work per `slide-deck` `deck-theme.md`, `source_palette.py` prints the `StageDeck(...)` line; light `FFFFFF` with `block=True`, dark only if the source is dark; no color at all → `#2A78D6` on `FFFFFF` + `(รอยืนยัน)`). Sample code and methods: [`brandkit-usage.md`](brandkit-usage.md), `api.md`.
9. **Look at every page before delivery.** Render to PDF, convert to images, open each page (Read tool): the code cannot show tables overflowing the margin, stranded headings, floating tone marks. Commands and the 7-point checklist: [`visual-check.md`](visual-check.md).
10. Before sending, go through item 3 of `design-gate/no-ai-look` (HTML work: run its script; the eye gate 3.2 must also pass, web pages answer items 10–14).

**Hard rules (covers):**
- A project cover shows its project by logo shape or a real screen at a glance, not by colour alone.
- Never draw a fake UI on a cover. Use a real mockup screenshot. No logo or mockup yet: stop and make the logo first.
- Ask before creating or editing files outside the project (e.g. `cover-registry.md`).
- Install fonts only after asking, and only with `COVER_INSTALL_FONTS=1`.

## Check before done
- Avoid: Word's built-in Heading styles (use `h1()/h2()/h3()`) · thick black default table lines (use 0.5pt `line`) · pure black text · bold table headers with no fill · letting Word choose column widths (`fixed_widths()`) · too many emoji · a file never rendered for a look · the skill's default look when the app already has an identity · a 2000px-wide figure on a 17 cm page (text ends near 5pt) · a decorative cover image nobody said wows · a .docx without the source markdown. Reasons: [`anti-patterns.md`](anti-patterns.md)
- Every page was opened and looked at · colors written back to `doc-theme` · the line `ด่านก่อนลงมือ:` closes the job

## References
- [`tokens-and-type.md`](tokens-and-type.md) — open when setting the theme or choosing sizes, colors, elements · [`palette-examples.md`](palette-examples.md) — fallback tones by kind of work
- [`thai-fonts.md`](thai-fonts.md) — open when setting fonts or a PDF looks off
- [`word-layout.md`](word-layout.md) — open for page structure, dark cover, figure rules
- [`cover-design.md`](cover-design.md) — open for a software document set's own cover (logo shapes or real screen) · with [`cover-real-examples.md`](cover-real-examples.md) · [`cover-structural-ideas.md`](cover-structural-ideas.md) · [`cover-word-build.md`](cover-word-build.md) · [`cover-bakeoff.md`](cover-bakeoff.md)
- [`identity-and-gate.md`](identity-and-gate.md) — open when running several directions or the beauty gate · [`cover-vote.md`](cover-vote.md) — the 3-direction cover vote
- [`brandkit-usage.md`](brandkit-usage.md) · [`api.md`](api.md) — open when writing the build script
- [`visual-check.md`](visual-check.md) — open when rendering for the eye check · [`anti-patterns.md`](anti-patterns.md) — open when reviewing
- Linked skills: slide story → `slide-deck` · SRS → `requirements-writing` · diagrams → `diagrams` / `diagrams` · brand → `graphic-design` · .html deck → `slide-deck`
