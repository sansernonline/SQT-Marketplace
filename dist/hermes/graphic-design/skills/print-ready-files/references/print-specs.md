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
