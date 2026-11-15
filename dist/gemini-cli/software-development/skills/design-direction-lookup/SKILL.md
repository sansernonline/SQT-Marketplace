---
name: design-direction-lookup
description: Use for a starting palette and Thai-Latin fonts on a new screen
---

# design-direction-lookup — find 3 starting looks from a Thai or English brief

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

Lives in plugin `software-development` · wording follows `human-writing` · used before `ui-craft` step 0.1 stage 3 (make 3 directions in parallel)

> **The one rule:** the draft gives a starting point; it does not replace the beauty gate — every direction produced must become a mockup and be chosen at the beauty gate of `ui-craft` step 9 · if the search says nothing was found, say so plainly; never invent colors or fonts and claim they came from data

## Use when

- Starting a new screen project, or the user orders a new design, and there is no visual direction yet (`ui-craft` step 0 says to do step 0.1)
- You need a 2-mode palette, a Thai-Latin font pair, or Thai UX rules that fit the business, e.g. "ทำเว็บคลินิกทันตกรรม อยากได้โทนสีกับฟอนต์ไทยที่เข้ากัน" (a dental clinic website, wants a matching color tone and Thai font)
- You want to know which chart fits this kind of data · how the home page should order its sections · what look rules a framework has

Do not use when: the project already has a look that passed the beauty gate (copy the sibling page per `ui-craft` step 0) · making a whole brand set, logo, or corporate colors (`brand-kit`) · checking finished work for looking AI-made (`no-ai-look`)

## Use another skill instead or alongside

| Situation | Use | Reason |
|---|---|---|
| Got the 3 directions, need to mock up and choose | `ui-craft` step 0.1 stages 3–5 and step 9 | This skill stops at the starting point; the choosing stage is there |
| Web app screens, dashboards, back-office systems | `web-app-design` | Page structure and components of the platform |
| Mobile app PWA | `mobile-app-design` | Small screen size, finger distance, Thai rules on small screens |
| Windows desktop app | `windows-app-design` | Real Fluent tokens beat palettes from here |
| Check the mockup before sending | `no-ai-look` (`slop_scan.py`) | The draft checks only colors and fonts, not the whole screen |
| The customer already has a brand, or a new brand must be made | `graphic-design:brand-kit` | Brand colors and fonts always beat the data here |

## 1 · Search one topic at a time

```bash
python scripts/design_search.py "ร้านทองออนไลน์" --domain industry
python scripts/design_search.py "ช่องวันที่ พ.ศ." --domain ux -n 5
python scripts/design_search.py "ฟอร์ม validation" --domain stack --stack blazor --json
```

- domain: `industry` · `palette` (backup store; results start with a warning to search live first) · `font` · `look` · `ux` · `chart` · `landing` · `stack`
- domains from ui-ux-pro-max-skill (English · [`data/upstream/uipro/README.md`](data/upstream/uipro/README.md)): `style` (88 styles with color values, shadow, motion, CSS, what to use it with, what not to use it with) · `product` (192 product types → page pattern, style, color and type mood, things to avoid) · `motion` · `slide` · `slide-strategy` · `slide-copy` · use together with our `look` and `industry` when choosing the 3 directions; colors from a source file are not contrast-checked · how to choose queries and read results → [`references/query-guide.md`](references/query-guide.md)
- 1 run, 1 intent, 2–5 words · Thai, English or mixed all work · you may search again with different words once; if still not found, tell the user
- The search segments Thai words with a dictionary built from the keywords column of the data and expands the query with a Thai-English synonym table, so `ร้านกาแฟมินิมอล` can be searched without spaces

## 2 · Search colors live first, then extract colors from real work

Do this every time there is a network, before drafting the 3 directions · color trends change fast, so the palettes in `data/` are a backup store for when live search is not possible, not the main source · colors passed to the draft with `--palette` or `--extra-palettes` always beat the store

0. **Search live per the `design-references` skill of `superuser`:** find this year's reference work and real business sites in the field, and note which color tones you see
1. **Choose 3–5 sites in the same field as the brief:** 2–4 Thai businesses and 1 large foreign one · choose only sites that are still active and recently redesigned, judged by the copyright year in the footer, news, or latest post · skip sites older than 2 years
2. **Look at this year's design work from at least 1 source** among those used by `ui-craft` step 0.1 stage 2 (Siteinspire or Awwwards), filtered by field or style, and note what you see that differs from the backup store
3. **Extract colors:**
   ```bash
   python scripts/brand_colors.py https://a.co.th https://b.co.th https://c.com
   python scripts/brand_colors.py <url เดิม> --palette web-<วงการ> > _to_delete/web-palettes.csv
   ```
   The result per site is brand colors ranked 1–4 with weight and source (theme-color · CSS variables such as `--primary` · frequency in CSS), the background and text colors, and the extraction date · the extractor reads only HTML and CSS and does not run JavaScript; for a site that needs JavaScript before it has content, the extractor says it could not extract; report that as is and never guess colors instead
4. **Build 1–2 new palettes** with `--palette` · the builder uses colors shared by many sites as primary and accent, shifts the hue slightly so it matches no single brand, then works out background, text, border and status colors that pass contrast in both modes · to get 2 sets, run again with another group of sites (for example a premium group and an affordable group) and append the CSV files
5. **Feed them to the draft:**
   ```bash
   python scripts/design_draft.py "<โจทย์>" --extra-palettes _to_delete/web-palettes.csv
   python scripts/design_draft.py "<โจทย์>" --palette "ร้านเก่า:bg=#FAF7F2,surface=#FFFFFF,text=#2B2118,text_muted=#6B5A48,primary=#8A3B12,secondary=#D9B26F,accent=#2F6F6A,border=#D8CBB8"
   ```
   `--palette` can be repeated for several sets and takes 3 forms: 8 named roles (as in the example · `secondary` may be omitted) · 8 colors in the order bg surface text text_muted primary secondary accent border · or 1–7 brand colors (the first is the main color) · light mode uses the colors passed in as they are, while on_primary, status colors and dark mode are worked out by the draft to pass contrast · `secondary` has no column in the table and is recorded in notes · colors that fail contrast or are Tailwind defaults are rejected with the reason
   `--palettes` selects and orders some sets as directions A B C · if the brief matches no industry in the data, the draft uses a temporary industry `custom` and picks the look and font pair from words in the brief instead of stopping
   A palette that fails contrast does not stop the command: the draft first tries setting on_primary to white or black, and if it still fails, drops it and notes it under "dropped before drafting" (`ที่ตัดออกก่อนร่าง`) · colors extracted from other people's work go in `--reference-colors [degrees]` (default 8) to shift the hue and make DESIGN.md state the source truthfully (if contrast fails after shifting, the draft adjusts lightness by at most 10% before dropping) · if 2 industries score close, the result names both; choose with `--industry` · the heading font does not repeat across the 3 directions · `--voice rounded|angular|modern|formal|classic|hand` gives direction A a font pair with the chosen personality, picked from the project's basics (`ui-craft/references/font-voice.md` · column `voice` in `font-pairs.csv`)
6. **Record in DESIGN.md:** the URL of every site viewed, the design sources viewed, the viewing date of every source, the colors obtained, and sites that could not be extracted

No network, or colors cannot be extracted from any site → skip to section 3 without passing colors; the draft uses the backup store in `data/` with a warning on screen and in DESIGN.md saying "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า" (using the backup color store; a live search per design-references would be more current)

## 3 · Draft 3 directions in one command

```bash
python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
```

The draft works in this order:

1. Find the industry from the brief; if not found, the draft uses a temporary industry `custom` and picks the look and fonts from words in the brief (does not guess colors)
2. Order the directions as the industry row sets (look · palette · font pair, same position); if live colors were passed in, palettes are ordered as passed; then check each direction
3. **Drop directions that fail, then take the next one:** contrast below 4.5:1 for text or 3:1 for buttons and borders in either mode · has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist as the first font · a Thai font with no Latin partner, such as Noto Sans Thai alone
4. The looks of the 3 directions must not repeat · if the directions set by the industry are not enough, the draft fills in from looks found by the industry's words
   · the main colors of any 2 directions must be far apart in both RGB distance and hue (under 20 degrees counts as the same tone) · each direction uses a different page structure per look: large left-aligned type (editorial) · boxes of several sizes (bento) · toolbar with a dense table (dense)
5. Find 5 related UX rules (Thai rules go first when scores are close)
6. Write `docs/DESIGN.md` and the HTML comparison page (2-mode swatches · Thai headings and body in the real font · a line that checks vowels and tone marks · buttons · status badges) · **an existing file is not overwritten** unless `--force` is given

Text the draft generates passes the ad-word filter (ยกระดับ · ไร้รอยต่อ · seamless · elevate etc.; the Thai words mean "elevate" and "seamless") · if the source data has these words, the draft stops and tells you to fix the data

## 4 · After you have the draft

1. Open the comparison page and look at both modes yourself; do not trust the contrast numbers alone · in some Thai fonts the upper vowels hit the previous line, which you must see with your eyes
2. Send the 3 directions to `ui-craft` step 0.1 stage 3 (a fresh subagent per direction · an agent that cannot call a sub-team does each direction itself in turn and notes it under "ตัดสินใจเอง" (own decisions)) · each direction adds 1 bold move of its own; the draft does not choose it for you
3. If the customer has brand colors or fonts, substitute the values in each direction and rerun the contrast check (`no-ai-look/scripts/slop_scan.py`)
4. Choose the direction that passes the beauty gate, and write the reason under `## ตัดสินใจเอง` (own decisions) of `docs/BUILD-PLAN.md`

## 5 · Data

**The palettes in this set are a backup store for when live search is not possible · the looks and font pairs are also backup values, reviewed every 6 months** to match current trends (next review 2027-04-26 · `scripts/check/expiry.json` warns when the date is near) · with a network, always start from step 2

**Left out of this set on purpose** · icons: use one set across the whole app per `ui-craft` and `no-ai-look`, no table search needed · motion: each look already has a motion slot, details are in `ui-craft/references/depth-and-flourish.md` and `graphic-design:motion-basics` · Latin-only fonts: the font pairs already name the Latin font, and for the full list see fonts.google.com · stacks other than the 7 (Next.js · Vue · SwiftUI etc.) are added when real work needs them, not ahead of time

The CSV files in `data/` (multi-value fields separated by `;`) are checked by `scripts/check_data.py` · the search reads every file at startup, no need to build an index ahead of time

| File | Contents |
|---|---|
| `industries.csv` | Industry → personality · look · palette · font pair · cautions · deciding rules |
| `palettes.csv` | Backup color store by color role, 2 rows per id (light · dark) · used when there are no colors from a live search |
| `font-pairs.csv` · `thai-fonts.csv` | Thai-Latin pairs · smallest body size · line-height · licence |
| `looks.csv` | Looks of `ui-craft/references/web-looks.md` · depth · motion · prohibitions |
| `ux-rules.csv` · `charts.csv` · `landing.csv` · `stacks/<stack>.csv` | UX rules including Thai rules · charts · section order · per-framework rules |

If you add a new row and cannot find it with Thai words, put that word in the row's keywords column, because the dictionary segmentation is built from this column.

## A real example

**Brief:** "เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช ลูกค้า 35–60 ซื้อผ่านมือถือ" (a website selling gold jewelry, an old shop in Yaowarat, customers aged 35–60 buying on mobile)

**Run:** `python scripts/design_draft.py "<โจทย์>" --out _to_delete/gold/DESIGN.md --html _to_delete/gold/gold-design-directions.html`

**Result (run 2026-10-26):** matched `gold-shop` as rank 1 · direction A luxury + palette `gold-leaf` + fonts Chonburi/Taviraj · direction B editorial + `yaowarat-red` + Trirong/Taviraj · direction C Thai craft + `thai-silk` + Anuphan/IBM Plex Sans Thai · every palette passes contrast in both modes · 5 UX rules, for example money amounts use tabular-nums and show the last update time of the price · the end of DESIGN.md says palette `night-vault` was dropped because its main color on a light background got 2.91:1 · the comparison page passed `slop_scan.py` with no findings

## Check before sending

- [ ] `python scripts/design_search.py --self-test` · `python scripts/design_draft.py --self-test` · `python scripts/brand_colors.py --self-test` all pass
- [ ] With a network → searched live per `design-references`, and DESIGN.md notes the URLs of real business sites and design sources viewed, with the viewing date of every source · with no network → DESIGN.md has the backup-store warning
- [ ] If you changed the search or the data → run `--eval references/relevance-cases.json` and the holdout is still not below 85 %
- [ ] DESIGN.md has 3 directions with distinct looks and says they are a starting point, not a verdict
- [ ] The comparison page has no Inter as the main font, no Tailwind default colors, and no Thai font without a Latin partner
- [ ] Did not overwrite the project's existing DESIGN.md by accident (no `--force` unless necessary)

## Sources

- `data/upstream/uipro/` copied unchanged from ui-ux-pro-max-skill commit `28b3b8d` (MIT · 2026-10-29), as the owner ordered it copied for improvement
- The idea of a searchable dataset, the BM25 search with an abstain threshold, and the design-system generator come from nextlevelbuilder/ui-ux-pro-max-skill (MIT · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · viewed 2026-10-26) · the code and data here are entirely rewritten, not copied · what is done differently from the source: Thai word segmentation · 3 directions instead of 1 answer · dropping framework default colors · Thai-Latin font pairs
- BM25 is a widely published ranking method, written by us in `scripts/design_search.py` · k1 1.5 and b 0.75
- The contrast thresholds 4.5:1 and 3:1 follow `ui-craft` step 5 (WCAG 2.2 criteria 1.4.3 and 1.4.11)
- 3 directions · look · app personality from `ui-craft` step 0.1 · `ui-craft/references/web-looks.md` · `ui-craft/references/app-character.md`
- The color and font rules that are dropped match the rules `framework-default` and `overused-font` of `no-ai-look/scripts/slop_scan.py`
