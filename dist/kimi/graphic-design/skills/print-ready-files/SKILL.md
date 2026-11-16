---
name: print-ready-files
description: Use when a flyer or name card goes to a print shop
---

# print-ready-files — prepare files for print shops and sign shops

> **Before sending to a print shop:** the work file must pass the eye gate of `no-ai-look` and have the line `ด่านก่อนลงมือ:` (Gate before starting:) from the design stage (that section of `design-references`, plugin `superuser`). If missing, go back and do that gate first, because print cannot be fixed afterward. For work the user or an outsider designed themselves, the line is not required, but you still run the eye gate of `no-ai-look`.

> **One rule:** ask the shop before starting the file what it needs (color mode · bleed · file type · color profile), then follow the shop. The numbers below are what most Thai shops ask for; use them when the shop does not say.

## Use when
- Sending a flyer, poster, name card, sticker, vinyl banner, or sign to a shop
- The shop sends the file back (colors off · white edge after cutting · Thai text off or strange letters · pixelated image)
- Working in Canva or another RGB program and then sending to a print shop

Not for: screen posts or ads → `social-formats` (sRGB, not CMYK) · online-store product pictures → `marketplace-product-images` · beauty and contrast review → `design-review` (do first) · brand colors, fonts, logo → `brand-kit` · Word/PDF documents read on screen → `software-development:branded-document-design`. The reviewer for this file is agent `design-critic`.

## Steps
1. **Ask the shop 5 things:** real size · bleed · accepted file types (AI · PDF · PSD · JPG) · the CMYK color profile · for a vinyl banner, where the edge fold or grommet holes go. None of the 8 Thai shops checked states a profile on its website, only "CMYK", so you must ask.
2. **Set the page to the real size plus bleed.** Default bleed **3 mm** on every side. Extend backgrounds and fills to the bleed edge; keep text and logo at least **3 mm** inside the cut line. Thai name card 90 × 55 mm (file with bleed 96 × 61 mm; an 85 × 55 size exists, ask the shop). Vinyl banner: edge fold 3 cm per side · text at least 5 cm from the edge · grommets every 50 cm (รอยืนยัน, one shop's figures).
3. **Set CMYK from the start.** Vivid screen colors (neon green · bright blue) cannot be printed. If working in Canva or RGB, tell the user the colors will look duller and have the shop make a proof first. Give the shop the Pantone code for key brand colors. If the shop names no CMYK profile, do not choose one yourself: send CMYK, tell the shop which profile you used, and ask for a proof (profile table in the reference).
4. **Small text and thin lines use pure 100K black only.** No rich black or registration black (a small plate shift blurs the text). Rich black is for large areas only. Total ink of all colors at most 300%.
5. **Resolution at real size.** Flyer, name card, poster, sticker: **300 ppi** (some shops accept 266; 72 is a screen value). Vinyl banner: **70–150 ppi** by viewing distance (close 150 and up · farther than 5 m 72 is enough · several meters wide can go below 100 · text and logo as vector). Never enlarge a small image and call it 300. Real resolution = pixel count ÷ print size in inches; read pixel size with Pillow, not the dpi value in the file.
6. **Thai fonts.** Check vowels and tone marks on screen first. If they float or sink, turn on the World-Ready composer (Illustrator/Photoshop: Preferences › Type › Show Indic Options, then Middle Eastern & South Asian or World-Ready). Then **Create Outlines** or embed the fonts in the PDF. Outlines freeze what you see, so a wrong tone mark at conversion is wrong permanently; keep 1 editable set. Check the font license allows embedding and printing: OFL fonts yes; SIPA national fonts (รอยืนยัน); purchased or aggregator fonts read the license, and if unsure convert to outlines (table in the reference).
7. **Export PDF as the shop asks.** If not specified, use PDF/X-1a (CMYK and spot only, transparency flattened, fonts embedded). PDF/X-4 only if the shop says it accepts it. Add trim marks and bleed; embed every image (not links).
8. **Check the PDF with tools**, then send with size · quantity · paper, and ask for a proof before the real print.

## ตรวจด้วยคำสั่ง (Check with commands)
```bash
pdffonts งาน.pdf        # คอลัมน์ emb ต้องเป็น yes ทุกแถว · ไม่มีแถวเลย = แปลงเป็นเส้นแล้ว
pdfinfo -box งาน.pdf    # TrimBox = ขนาดจริง · BleedBox ใหญ่กว่า TrimBox ด้านละ 3 มม. (8.5 pt)
pdfinfo งาน.pdf         # บรรทัด PDF version และ Producer บอกว่า export แบบไหน
```
Let the script compute instead of reading by eye (once per job; thresholds in [`references/print-specs.json`](references/print-specs.json), checked 2026-10-26; if the shop gives other values, use the flags):
```bash
python scripts/print_check.py pdf งาน.pdf --bleed-mm 3     # ระยะตัดตกทุกหน้า + ฟอนต์ฝัง (ต้องมี poppler)
python scripts/print_check.py ppi --px 1200 --mm 100       # 304.8 ppi · ไวนิลใส่ --kind vinyl [--min-ppi 150]
python scripts/print_check.py ink 80 70 60 90              # หมึกรวม C+M+Y+K ไม่เกิน 300%
python scripts/print_check.py --self-test                  # 3 มม. = 8.50 pt · 1200 px ที่ 100 มม. = 304.8 ppi · 8/8
```
Passing still means you must ask the shop and ask for a proof. With no poppler the script says how to install it; `ppi` and `ink` work right away. The color mode of images inside a PDF: Acrobat Preflight or have the shop check.

## Check before done
- Got the shop's answers to all 5 things, or noted which it did not answer
- Page size = real size + bleed · all text inside the safe margin
- CMYK · small text in 100K black · no color with total ink over 300%
- Every image passes the resolution at real size
- Thai vowels and tone marks looked right before outlines · `pdffonts` passes · the font license allows embedding and printing
- Told the user screen color and print color differ, and asked for a proof before a large run

## References
- [`references/print-specs.md`](references/print-specs.md) — open for the status behind each value, the CMYK profile table, PDF/X choice, Thai font licenses, or the worked example
- [`references/print-specs.json`](references/print-specs.json) — thresholds the script reads
- [`references/sources.md`](references/sources.md) — open when re-checking sources (last checked 2026-10-26)
