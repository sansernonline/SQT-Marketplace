# Building a cover in real Word — the recipe that passed, and the reusable cover builder

Used with `cover-design.md` item 5 · proven 2026-10-15 (cover builder, round 2) only for Software Requirements Specification (SRS) covers: the text in the version badge is Word text on the badge shape in the background image · the vertical position of the Word text matches the preview image (median per style 0 px · horizontal not corrected) · the background image does not fade · comes out as exactly 2 pages (Word 365 on Windows 11 · Word via Component Object Model (COM) → PDF → `pdftoppm`)

## Cover builder `scripts/cover-engine/`

```
cover-engine/src/
├─ build_all.py    สั่งทั้งหมดในคำสั่งเดียว
├─ fonts.py        (รันเมื่อ COVER_INSTALL_FONTS=1) ตัดฟอนต์ variable เป็นไฟล์ static แล้วติดตั้งให้ผู้ใช้คนเดียว (ไม่ใช้ admin)
├─ capture.py      ถ่ายจอจาก mockup จริงที่ 2x (แนวหน้าจอจริง)
├─ render.py       HTML → ภาพตัวอย่าง 150 จุดต่อนิ้ว (dots per inch, dpi) · ภาพพื้น 300 dpi (ซ่อนข้อความ) · ตำแหน่งกล่องข้อความ → build/layout/*.json · checks.json
├─ docx_build.py   ภาพพื้น + ข้อความ Word ในกรอบยึดกับหน้า ด้วย brandkit.py
├─ word_pdf.py     Word COM → PDF → PNG
├─ calibrate.py    วัดระยะเหลื่อมระหว่าง Word กับภาพตัวอย่าง แก้รอบถัดไป
└─ web/            cover.html · cover.js (3 หน้า pageTile · pageShot · pageGrid + ป้ายเวอร์ชัน `pill` · บรรทัดชื่อชุด `seriesLine`) · projects.js (ข้อมูลโปรเจกต์ — แก้ที่นี่) · set.html
```

How to use it on a new project:
1. Copy the whole `cover-engine/` folder to the project's render folder (for example `docs/design/cover/`)
2. Put each project's logo SVG in `cover-engine/assets/<project>/` (screenshots that can be captured go to `build/shots/shot-<screen>.png`), then edit `src/web/projects.js`: logo SVG path · colors · fonts · Thai/English document title · the sentence that states the job · code, version, date · layout style (the 3 sample projects in the file are LiteNet tiled grid · Telex real screen · SwipeOS hand-pose table)
3. **Edit the parts still tied to the 3 prototype projects** (the builder does not yet read everything from `projects.js`):
   - `web/cover.js`: add the logo shape path to `GEO` and make the page function of the chosen style (`pageTile` tiled grid of logo shapes · `pageShot` real screen with a title bar overlaid · `pageGrid` grid of hand-pose symbol images) use the new project's data · number of cells and color per document type
   - `render.py`: the lists `PROJECTS` · `DOCS` · the print-cover condition (`if p == "litenet"`)
   - `calibrate.py`: the project list · `docx_build.py`: `PAGE2` (colors and page 2 content) · `fonts.py`: `SOURCES` and `NEEDED`
   - `web/set.html`: the document types in the set image (currently BRD · SRS · ARCH)
   - Remove the 3 sample projects from `projects.js` (their SVG files do not come along)
4. Set `BRANDKIT_DIR` = the folder `branded-document-design/scripts` in plugin `software-development` (if not set, the script finds the neighboring skill folder itself) · for the real-screen style set `COVER_MOCKUP` = path of the mockup file (1 project per run) · to use a Chrome installed on the machine → `COVER_CHROME` (not set = Playwright's Chromium)
5. Run `python src/build_all.py`, then open every image in `covers/*-set.png` and `build/qa/*-80-1.png`
- Requires: Python + `python-docx` `pillow` `numpy` `playwright` `fontTools` `pywin32` · Chrome · Word (for the PDF) · `pdftoppm` · internet (Google Fonts at render time · fonts from GitHub)
- **`fonts.py` installs fonts on the user's machine** (`%LOCALAPPDATA%\Microsoft\Windows\Fonts` + registry HKCU) and downloads files from the `main` branch of google/fonts without checking a hash — run it only when `COVER_INSTALL_FONTS=1` is set after the user allows it · say in the report what was installed · **to remove:** delete the installed `.ttf` files in `%LOCALAPPDATA%\Microsoft\Windows\Fonts` and the values `<font name> (TrueType)` in `HKCU\Software\Microsoft\Windows NT\CurrentVersion\Fonts`
- `docx_build.py` currently builds only the SRS cover (the BRD and ARCH covers have background images and positions, but are not yet tested in Word)

## Word recipe

1. **Background image** 2480 × 3508 (300 dpi) with the editable text hidden · **the logo is in the background image** (not a separate Word picture) · `anchor_picture(first paragraph, png, 0, 0, 21.0, 29.7, z=251658240)` → positioned relative to the page · `behindDoc=1` · that paragraph has 0 line spacing, exact 1pt · no header
2. **Text** 1 box in the HTML = 1 Word paragraph in a page-anchored frame (`w:framePr hAnchor=page vAnchor=page x y w`) · exact line spacing · break lines with `<br>` only · the frame is 80 px wider than the real box so Word does not wrap lines itself
3. **Unit conversion (150 dpi):** twips = px × 9.6 · pt = px × 0.48 · English Metric Unit (EMU) = px × 6096 · cm = px ÷ 1240 × 21 · `w:line` = line-height(px) × 9.6
4. **Fonts:** `style_run(font=...)` on every run, then `thai_runs(paragraph)` with `bk.FONT` set to that box's font (setting one value for the whole file → a SemiBold name becomes Regular) · body and footer call `thai_runs` too
5. **Page 2:** set `pageBreakBefore` on the first heading, do not add an empty page-break paragraph · hide the cover footer with `different_first_page_header_footer`
6. **Images not compressed:** put `<w:doNotAutoCompressPictures/>` in the position required by the `settings.xml` schema · the .docx keeps the full image, but the PDF from Word is still reduced to 200 ppi (no switch in COM)
7. **Word COM:** open its own instance with `DispatchEx` (do not touch a Word the user has open) · `EmbedTrueTypeFonts=True` `SaveSubsetFonts=False` → file about 5 MB · `ExportAsFixedFormat(..., 17, OptimizeFor=0)`
8. **Position adjustment:** `calibrate.py` shifts the ink of each box against the Word 150 dpi image (±14 px) and keeps the median per style (font | weight | size | line spacing) in `build/calib.json` · round 1 had a worst offset of 8 px, round 2 reduced it to 0

## Traps found

| Symptom | Cause | Fix |
|---|---|---|
| PDF shows font name "…SemiBold,Bold" (fake bold) | Weight 700 is not installed | Install the static file of every weight used |
| Thai text is BrowalliaNew | The Latin font (Space Grotesk) has no Thai glyphs, and `thai_runs` was not called | Split the footer by language · call `thai_runs` in every part · check with `pdffonts` |
| A variable font becomes Calibri in the PDF | Word only knows Regular/Bold per family | Cut it into static files with `fontTools.varLib.instancer` and give each its own family name |
| The cover background image looks faded when editing in Word | The image was placed in the header | Anchor it to the first paragraph (item 1) |
| The giant document code collides with the table cells | Fixed size, but the cell size changes | Compute the size from the width of 3 cells and the cap height |

## ยังไม่ได้ตรวจ (not yet checked)

Opening on a machine without the fonts (fonts are embedded, but not yet tried) · printing the print cover on a real printer · the reading order of the text frames with a screen reader
