# skill: print-ready-files

Use when a flyer or name card goes to a print shop

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


## reference: print-specs.md

# Print specs: sizes, resolution, PDF types, color profiles, font licenses, example

Open this when you need the status behind a value, the CMYK profile table, the PDF/X choice, a Thai font license answer, or the worked example. Thresholds the script reads are in [`print-specs.json`](print-specs.json).

## Sizes and distances

| Topic | Value | Status |
|---|---|---|
| Bleed | **3 mm** on every side (some shops 3–5 mm · the US uses 0.125 inch = 3.175 mm) | agreed by 5 shops |
| Safe margin inside the cut line | at least **3 mm** (various shops say 2–4 mm) | agreed by 5 shops |
| Thai name card | **90 × 55 mm** · file including bleed 96 × 61 mm (an 85 × 55 size exists too, ask the shop) | agreed by 4 shops |
| Vinyl banner: edge fold and grommets | edge fold 3 cm per side · text at least 5 cm from the edge · grommets every 50 cm | (รอยืนยัน) one shop's figures found, other shops say only "keep text away from grommets" |

## Resolution at real size

| Job | Resolution | Status |
|---|---|---|
| Flyer, name card, poster, sticker (offset and digital) | **300 ppi** at the real print size (some shops accept 266) · 72 ppi is a screen value | agreed by 5 shops |
| Vinyl banner | **70–150 ppi** by viewing distance: close viewing 150 and up · farther than 5 m, 72 is enough · a sign several meters wide can go below 100 · text and logo use vector | agreed by 4 sources (a range) |

## PDF for printing

| Type | How it differs | Use when |
|---|---|---|
| **PDF/X-1a** (ISO 15930-1 and -4) | CMYK and spot colors only, no RGB · transparency is flattened · fonts must be embedded | The shop does not say, or asks for "PDF/X" |
| **PDF/X-4** (ISO 15930-7) | Keeps transparency and layers · accepts RGB and profiled colors, and the shop converts them | The shop says it accepts X-4 (newer digital printers) |

## CMYK color profiles

The shop does not say: ask. No answer yet: do not choose yourself; send CMYK, tell the shop which profile you used, and ask for a proof.

| Profile | What it is | Status |
|---|---|---|
| Coated FOGRA39 (ISO Coated v2) | Offset on coated paper, per ISO 12647-2:2004 | confirmed by 3 sources (ICC registry) |
| PSO Coated v3 (FOGRA51) | The newer version, per ISO 12647-2:2013 | confirmed by 3 sources (ICC registry · ECI) |
| Japan Color 2001 Coated | Japanese standard, ships with Adobe programs · shops in Asia may ask for it | (รอยืนยัน) 2 sources · no Thai shop was found asking for either one |

## Thai font licenses and embedding in PDF

| Font | Can it be embedded in a PDF and printed for sale? | Status |
|---|---|---|
| Google Fonts fonts under the SIL Open Font License (OFL) | Yes, fully or partially embedded, and commercial printing is allowed | confirmed from the license issuer itself (OFL FAQ items 1.1 and 1.12) |
| The 13 national fonts of SIPA (TH Sarabun New etc.) | The DIP-SIPA license allows use, copying, modification, and distribution, and forbids selling the font alone (bundling with software is allowed) · a modification must be notified to DIP and SIPA in writing and the font renamed · it does not mention embedding directly · TH Sarabun New is GPL-2.0 or later with an exception that allows embedding in documents | (รอยืนยัน) checked 2026-10-26 from a secondary source, SIPA's official text not yet read |
| Purchased fonts or free fonts from font-aggregator sites | Read that font's license · not sure: convert to outlines | none |

## Checking images and PDFs

Poppler commands verified to exist on poppler 25.07.0 (2026-10-26). Images: real resolution = pixel count ÷ print size in inches; use Python Pillow to read the pixel size and calculate, and do not trust the dpi value in the file. The color mode of images inside a PDF can be checked with Acrobat Preflight or by having the shop check (a free command on this machine has not been tested).

## Real example

Task: a coffee shop will print 500 A5 flyers and a 1 × 2 m vinyl banner for the storefront, designed in Canva.

| Step | What was done | Result |
|---|---|---|
| Ask the shop | Asked the 5 things in step 1 | The shop wants PDF CMYK, 3 mm bleed, vinyl with grommets at 4 corners |
| Flyer | Canva download PDF for print, ticked crop marks and bleed, chose CMYK | `pdffonts` every row emb yes · `pdfinfo -box` BleedBox larger than TrimBox by 8.5 pt per side |
| Vinyl banner | Real-size file 100 × 200 cm at 100 ppi · text 5 cm from the edge | Told the user the logo's neon green will look duller, asked for a proof |


## reference: sources.md

# Sources · print-ready-files

Last checked 2026-10-26.

- Thai print shops' file submission pages (the shop sets its own rules): [Roongsiri Greenprint](https://roongsirigreenprint.com/design-and-preparing-files-for-printing/) · [Plusprinting](https://plusprinting.bookplus.co.th/artworkforprint/) (PDF/X-1a:2001) · [GiantPrint checklist](https://giantprint.co.th/prepare-print-files-checklist-sme/) · [GiantPrint vinyl resolution](https://giantprint.co.th/vinyl-banner-resolution-dpi-guide/) · [Lanna Printing](https://lannaprinting.com/articles/) · [Hero Print](https://hero-print.com/) · [Laxmirung name cards](https://laxmirung.com/office-namecard/blog/business-card-size-print-setup) · [PP-Sticker vinyl](https://pp-sticker.com/print/vinyl-banner/) · [Pimdai vinyl](https://pimdai.com/first-time-vinyl-banner-order-file-and-size-guide/)
- 100K black and total ink: [Nettl](https://www.nettl.com/uk/shop/file-supply/5366) · [Caxton](https://caxton.co.nz/page/What-is-Rich-Black) · [4over4](https://v2.4over4.com/guide/cmyk-values-for-print-explained) · vinyl 100–150 ppi: [4over4 FAQ](https://mapp.4over4.com/faqs/banners/what-resolution-do-i-need-for-banner-printing)
- Color profiles: [ICC registry FOGRA39](https://registry.color.org/cmyk-registry/fogra39) · [ICC registry FOGRA51](https://registry.color.org/cmyk-registry/fogra51) · [ECI downloads](https://www.eci.org/doku.php?id=en:downloads)
- PDF/X: [CreativePro](https://creativepro.com/choosing-the-right-pdf-preset/) · the PDF Association conformance table (read through search results, the web page returned 403) · iso.org and helpx.adobe.com returned 403 when checked
- Fonts: [OFL FAQ](https://openfontlicense.org/ofl-faq/) · [DIP-SIPA license](https://fedoraproject.org/wiki/Licensing/DIP_SIPA_Font_License) · floating tone marks: [Wongnai](https://www.wongnai.com/articles/how-to-fix-thai-intonation-marks) · [Grappik](https://grappik.com/how-to-fix-thai-intonation-marks) (no Adobe page was found, so it is still a method from users)
