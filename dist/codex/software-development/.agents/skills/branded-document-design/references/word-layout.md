# Dark cover and table headers — details from real jobs

Read when making a dark cover or adjusting table headers on inner pages · the short rules to use every time are in `SKILL.md` item 3.

## Dark cover style

**Dark cover style (when the app or brand uses a dark screen):** a full-page cover in a neutral near-black dark gray (for example `#1C1C22`) with a very faint brand-colored glow (at most 15%). A deep purple glow filling the corner made the cover look purple, and the work's owner asked to go back to dark gray ·
The document title, subtitle and the line under the title go **right under the logo**, not in the middle or at the bottom of the page. The document-info table sits toward the bottom ·
A light-on-dark lettering logo at top left · document title 28–32pt · a 4-cell document-info table
(document code · version · date · status) · inner pages have a white background and dark code blocks; the header has a small logo, the document title and the document code;
the footer has the system name and "หน้า / ทั้งหมด" (page / total). The dark color is on the cover page only, so it can still be printed. The title size on this kind of cover may exceed the scale in item 1.
The logo on the cover uses a **small size (about 4.5 cm wide) at top left, above the document title**. Enlarging the symbol into the main image in the middle of the cover was tried, and the work's owner asked to go back to small.
If you want a flourish, stretch the logo's color glow into a long line as wide as the text (leave left and right margins equal to the paper margins; a line touching the paper edge was asked to be set in from the edge) as a bar of even thickness **with straight-cut ends and slightly rounded corners** (about 0.7 mm thick, corners about 0.25 mm). Tapered pointed ends were criticized as too sharp · the glow must fade to zero before the image edge, otherwise the box edge of the image shows. Use it instead of an underline below the document title (anchor the line image to the paragraph under the title so it follows both 1-line and 2-line titles) · the line must be **one continuous image** with the same thickness and glow throughout, a smoothstep gradient with both ends fading softly, drawn at 300 dpi. Never lay short bars over a long line, because it shows as a thick lump with colors that do not join (the work's owner said "the colored line is not smooth").
> **The cover background image and the logo on the cover must not be placed in the first page's header.** Word shows everything in the header as faded while reading or editing the document, so a full-page dark cover looks washed out (it is not faded in the PDF, so checking from the PDF alone will not find it; the work's owner said "looks washed out"). Anchor the floating behind-text image to the cover's first paragraph instead, and set `relativeHeight` the way Word does (background image 251658240 · images above it increase by 1024 each), because Word re-orders small numbers like 1, 2, 3 on save, and then the background image covers the logo.

Small text on a dark cover (labels, author info, notes) uses a size **of at least 8.5pt** and a light gray from `#CFCCDE` up; the subtitle uses a near-white light color. 7.5pt mid-gray text on a dark background looks faint.

**Use in code:** `doc.cover(title, subtitle=..., eyebrow=..., meta_rows=[...], logo="logo.png", style="night")`. The logo is optional · the glow line colors can be adjusted with `art_colors=(color1, color2, color3)` · the resulting look: `examples/example_srs-preview.png` (cover + inner page) · the example call: `scripts/example_srs.py` · `table()` uses this table header style by default (`header_style="classic"` = the old style)

## Table headers on inner pages

**Table headers on inner pages must not use a full-width solid dark fill**, even when the cover is dark, because tables are on every page, so dark color is heavy on the eye and wastes ink (the work's owner really asked for this change in one job).
Use a light fill of the brand color that still clearly reads as the header row, such as `#E4DCFD` (a lighter fill like `#F5F3FF` was called too faint by the work's owner), with bold dark brand-colored text.
There is only one border: a 1.5pt brand-colored line under the header row. No line on top (a black top line looks heavy and was asked to be changed), and no white gaps between header cells, because that would break the line under the header into segments.
Word cannot draw gradient borders; if you add a gradient, the color changes in steps along the columns.

## Page structure (moved from `SKILL.md` item 3; wording not changed)

```
หน้าปก        โลโก้กลาง → ชื่อเอกสาร (brand, bold) → ชื่อระบบ (text, bold)
              → บรรทัดเวอร์ชัน/วันที่ (9pt) → หมายเหตุการแก้ไข (8pt เอียง เทา)
              → ขึ้นหน้าใหม่
สารบัญ        field TOC (ผู้ใช้กด F9 อัปเดต) → ขึ้นหน้าใหม่
เนื้อหา        H1 มีเลขข้อเสมอ ("1. ภาพรวมระบบ") · H2 เป็น "1.1"
              ทุก H1/H2/H3 ตั้ง keep-with-next กันหัวข้อค้างท้ายหน้า
ท้ายเอกสาร    ตารางลงนามอนุมัติ
footer        "หน้า N" กลางหน้า สีเทา 9pt
```

## Figures in documents · beauty-gate rules · cover (moved from SKILL.md §0.1 items 6–8)

6. **Figures in documents:** the smallest text after real placement ≥ 7pt → minimum pixels on the canvas = `0.247 × canvas width(px) ÷ placed width(cm)` (a 2000px canvas placed 17 cm wide = 29px · placed on a 25.7 cm landscape page = 20px · use 26px to get 9pt) · a wide figure should go on a landscape page at the full column width (≥ 95%) · use the **version placed in the document without a figure title**, because the Word caption already gives the number and the figure's name · figure caption ≥ 9pt in body text color · after a figure, start a new section; the next paragraph must not flow onto the figure's page.
7. **What the beauty gate (`ด่านสวย`) often catches (put them as rules in the render script's `check`):** stray markdown marks (`**` · backtick) · Thai text in a mono font · a table overflowing a text column · a table of contents with a single entry stranded on the next page · a code list cut in the middle of a code (one code per line, one font for the whole column) · the "(รอยืนยัน)" tag uses the warning color, not the brand color · identity lost after the cover (chapter opener pages use the app's brand color bar) · a light cover available to print alongside the dark cover.
8. **Cover — plain lettering first, images later** (a project-specific cover that uses the logo shape or a real screen instead of decorative images → `doc-cover-design` (plugin `software-development`))**:** an illustration on the cover is optional, and an open cover with well-set lettering always beats an image that does not wow · a design that passed the gate: the document type (SRS · FSD · ARCH) large at 150–200px in the brand color as the only highlight (width at most ~85% of the column · a name over 5 letters such as TESTPLAN splits into 2 lines, never shrunk smaller than other copies, since the whole set must look the same size) → a short brand-colored line → Thai title → English title → a 1-sentence summary line (≥ 12pt, narrow column) → an info row at the page foot (labels ≥ 10pt) · leave the rest empty · parts with fixed positions (logo · document type · line · status tag) are drawn into the cover background image, while the title and info are Word text that can be searched and edited · the `(รอยืนยัน)` (awaiting confirmation) tag on a dark background uses a bright warning color, with no highlight fill · **if the user says the cover is not beautiful → cut the decorative images first** (curves, glowing dots, gradients), then make 3 plain-lettering covers to choose from (project has a logo or mockup → use `doc-cover-design` item 7 instead)
