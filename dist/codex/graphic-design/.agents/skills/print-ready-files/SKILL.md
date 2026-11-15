---
name: print-ready-files
description: Use when a flyer or name card goes to a print shop
---

# print-ready-files — prepare files for print shops and sign shops

> **Before sending to a print shop:** the work file must pass the eye gate of `no-ai-look` and have the line `ด่านก่อนลงมือ:` (Gate before starting:) from the design stage (that section of `design-references`, plugin `superuser`) · if missing → go back and do that gate first, because print cannot be fixed afterward · for work that the user or an outsider designed themselves, this line is not required, but you still run the eye gate of `no-ai-look`

Lives in plugin `graphic-design` · write wording per `human-writing` · the owner is agent `design-critic` (checks the file and reports what must be fixed) · the brand's CMYK color values are kept in the kit of `brand-kit`

> **One rule:** ask the shop before starting the file what it needs (color mode · bleed · file type · color profile), then follow the shop · the numbers on this page are the values most Thai shops ask for, to use when the shop does not say

## Use when

- Sending a flyer, poster, name card, sticker, vinyl banner, or sign to be printed at a shop
- The shop sends the file back (colors off · white edge after cutting · Thai text off or turned into strange letters · image is pixelated)
- Working in Canva or a program that works in RGB and then must send to a print shop

## Do not use when (use something else instead or together)

| Job | Use |
|---|---|
| Posts, ads, or images on a screen | `social-formats` (screens use sRGB, not CMYK) |
| Product pictures for an online store | `marketplace-product-images` |
| Checking beauty, visual order, contrast | `design-review` (do it first, then prepare the file with this skill) |
| Brand colors, brand fonts, logo | `brand-kit` |
| Reports or Word/PDF documents read on a screen | `software-development:branded-document-design` (if installed) |

## Steps

1. **Ask the shop 5 things before starting:** real size · bleed · accepted file types (AI · PDF · PSD · JPG) · the CMYK color profile used · for a vinyl banner, where the edge fold or grommet holes go · none of the 8 Thai shops checked states a color profile on its website, only "CMYK", so you must ask yourself
2. **Set the page to the real size plus bleed** (table below) · extend background images and fills past the cut line to the edge of the bleed · keep text and logo inside the safe margin
3. **Set the color mode to CMYK from the start.** Colors that are vivid on screen (neon green · bright blue) cannot be printed · if working in Canva or an RGB program → tell the user the colors will look duller, and have the shop make a proof first · give the shop the Pantone code for key brand colors
4. **Small text and thin lines use pure 100K black only.** No rich black or registration black, because if the plate is off by a little the text blurs · rich black is for large areas only · total ink of all colors must not exceed 300%
5. **Images must be detailed enough at real size** (resolution table) · do not enlarge a small image and call it 300
6. **Thai fonts:** check vowels and tone marks on screen first, and if they float or sink, turn on the World-Ready composer (Illustrator/Photoshop: Preferences › Type › Show Indic Options, then choose Middle Eastern & South Asian or World-Ready) · then **Create Outlines** or embed the fonts in the PDF · converting to outlines freezes what you see on screen, so if a tone mark is wrong at conversion it is wrong permanently · keep 1 set of files whose text can still be edited
7. **Export to PDF as the shop asks:** if not specified → PDF/X-1a (Thai shops that name a preset ask for this one) · add trim marks and bleed · embed every image (not links)
8. **Check the PDF file with tools** (section "ตรวจด้วยคำสั่ง" (Check with commands)), then send with the message: size · quantity · paper · ask for a proof before the real print

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

The shop does not say → ask · no answer yet → do not choose yourself, send CMYK and tell the shop which profile you used, then ask for a proof

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
| Purchased fonts or free fonts from font-aggregator sites | Read that font's license · not sure → convert to outlines | — |

## ตรวจด้วยคำสั่ง (Check with commands) (poppler · commands verified to exist on poppler 25.07.0 · 2026-10-26)

```bash
pdffonts งาน.pdf        # คอลัมน์ emb ต้องเป็น yes ทุกแถว · ไม่มีแถวเลย = แปลงเป็นเส้นแล้ว
pdfinfo -box งาน.pdf    # TrimBox = ขนาดจริง · BleedBox ใหญ่กว่า TrimBox ด้านละ 3 มม. (8.5 pt)
pdfinfo งาน.pdf         # บรรทัด PDF version และ Producer บอกว่า export แบบไหน
```

Let the script compute instead of reading by eye (call once per job · the thresholds are in [`references/print-specs.json`](references/print-specs.json), checked 2026-10-26 · if the shop gives other values, use the flags):

```bash
python scripts/print_check.py pdf งาน.pdf --bleed-mm 3     # ระยะตัดตกทุกหน้า + ฟอนต์ฝัง (ต้องมี poppler)
python scripts/print_check.py ppi --px 1200 --mm 100       # 304.8 ppi · ไวนิลใส่ --kind vinyl [--min-ppi 150]
python scripts/print_check.py ink 80 70 60 90              # หมึกรวม C+M+Y+K ไม่เกิน 300%
python scripts/print_check.py --self-test                  # 3 มม. = 8.50 pt · 1200 px ที่ 100 มม. = 304.8 ppi · 8/8
```

Passing still means you must ask the shop and ask for a proof · no poppler → the script says how to install it, while `ppi` and `ink` work right away

Images: real resolution = pixel count ÷ (print size in inches) · use Python Pillow to read the pixel size and calculate, and do not trust the dpi value in the file · the color mode of images inside a PDF can be checked with Acrobat Preflight or by having the shop check (a free command on this machine has not been tested)

## Real example

Task: a coffee shop will print 500 A5 flyers and a 1 × 2 m vinyl banner for the storefront, designed in Canva

| Step | What was done | Result |
|---|---|---|
| Ask the shop | Asked the 5 things in step 1 | The shop wants PDF CMYK, 3 mm bleed, vinyl with grommets at 4 corners |
| Flyer | Canva download PDF for print, ticked crop marks and bleed, chose CMYK | `pdffonts` every row emb yes · `pdfinfo -box` BleedBox larger than TrimBox by 8.5 pt per side |
| Vinyl banner | Real-size file 100 × 200 cm at 100 ppi · text 5 cm from the edge | Told the user the logo's neon green will look duller, asked for a proof |

## Check before sending

- [ ] Got the shop's answers to all 5 things, or noted which ones the shop did not answer
- [ ] Page size = real size + bleed · all text is inside the safe margin
- [ ] CMYK · small text in 100K black · no color with total ink over 300%
- [ ] Every image passes the resolution at real size
- [ ] Thai vowels and tone marks looked right before converting to outlines · `pdffonts` passes · the font license allows embedding and printing
- [ ] Told the user that screen color and print color differ, and asked for a proof before a large print run

## Sources (last checked 2026-10-26)

- Thai print shops' file submission pages (the shop sets its own rules): [Roongsiri Greenprint](https://roongsirigreenprint.com/design-and-preparing-files-for-printing/) · [Plusprinting](https://plusprinting.bookplus.co.th/artworkforprint/) (PDF/X-1a:2001) · [GiantPrint checklist](https://giantprint.co.th/prepare-print-files-checklist-sme/) · [GiantPrint vinyl resolution](https://giantprint.co.th/vinyl-banner-resolution-dpi-guide/) · [Lanna Printing](https://lannaprinting.com/articles/) · [Hero Print](https://hero-print.com/) · [Laxmirung name cards](https://laxmirung.com/office-namecard/blog/business-card-size-print-setup) · [PP-Sticker vinyl](https://pp-sticker.com/print/vinyl-banner/) · [Pimdai vinyl](https://pimdai.com/first-time-vinyl-banner-order-file-and-size-guide/)
- 100K black and total ink: [Nettl](https://www.nettl.com/uk/shop/file-supply/5366) · [Caxton](https://caxton.co.nz/page/What-is-Rich-Black) · [4over4](https://v2.4over4.com/guide/cmyk-values-for-print-explained) · vinyl 100–150 ppi: [4over4 FAQ](https://mapp.4over4.com/faqs/banners/what-resolution-do-i-need-for-banner-printing)
- Color profiles: [ICC registry FOGRA39](https://registry.color.org/cmyk-registry/fogra39) · [ICC registry FOGRA51](https://registry.color.org/cmyk-registry/fogra51) · [ECI downloads](https://www.eci.org/doku.php?id=en:downloads)
- PDF/X: [CreativePro](https://creativepro.com/choosing-the-right-pdf-preset/) · the PDF Association conformance table (read through search results, the web page returned 403) · iso.org and helpx.adobe.com returned 403 when checked
- Fonts: [OFL FAQ](https://openfontlicense.org/ofl-faq/) · [DIP-SIPA license](https://fedoraproject.org/wiki/Licensing/DIP_SIPA_Font_License) · floating tone marks: [Wongnai](https://www.wongnai.com/articles/how-to-fix-thai-intonation-marks) · [Grappik](https://grappik.com/how-to-fix-thai-intonation-marks) (no Adobe page was found, so it is still a method from users)
