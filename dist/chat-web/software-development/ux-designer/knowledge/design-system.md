# skill: design-system

Use for design tokens, a Tailwind theme or a starting palette

# Design System — 3-layer tokens and component specs

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the "Gate before starting" (`ด่านก่อนลงมือ`) section of `design-gate/design-references` (plugin `superuser`) even when a brand already exists (the brand controls color and fonts, while the search is for finding the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** screen code must have no raw colors or spacing. Every value references a token · tokens have 3 layers: **primitive** (raw value `--color-blue-600`) → **semantic** (role `--color-primary`) → **component** (`--button-bg`) · to change the theme, edit the middle layer in one place

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Write the tokens", "generate CSS from JSON", "Tailwind theme", "check the code for raw colours" | This file: steps 1–5 below |
| "New screen, no visual direction yet", "starting palette", "Thai and English font pair", "which chart fits" | [`references/design-direction-lookup.md`](references/design-direction-lookup.md) (sources: [`references/design-direction-lookup/sources.md`](references/design-direction-lookup/sources.md)) |

## Which one to use

| Task | Use |
|---|---|
| Code already exists; the user wants to know which values it uses and where it leaves the scale | `ui-craft` → `scripts/design_tokens.py` (reads the code → `docs/DESIGN.md`) |
| Write new tokens, generate CSS from JSON, check that code has no raw values | **this skill** |
| Spacing and font size scales | `ui-craft` items 1–2 (use the same scale as the tokens you set) |
| Pick starting colors and fonts | `design-system` |
| Colors and fonts of a brand that already has a document | `brand-kit` section "เขียนเป็นเอกสาร" (write as a document) (plugin `graphic-design`) → sync into the token file here |

## Steps

1. **Start from the template** `templates/design-tokens-starter.json` (it has all 3 layers) · put the brand colors in the primitive layer · for spacing use the 4 8 12 16 24 32 48 64 scale of `ui-craft`
2. **Generate CSS:** `node scripts/generate-tokens.cjs --config <tokens.json> -o <tokens.css>` (tested 2026-11-05 with the template; it produced a full `:root`)
3. **Check the code:** `node scripts/validate-tokens.cjs --dir src/` → reports raw colors and px that should be tokens (tested 2026-11-05: found 1 hex and 1 px in the sample file) · the result is a reason to look again, not a demand to fix every line
4. **Component states:** for buttons · inputs · cards, make a state table of default / hover / active / focus / disabled per `data/upstream/states-and-variants.md` before writing CSS
5. **Tailwind:** `data/upstream/tailwind-integration.md` — bind the tokens into the theme · colors must come from the brand, not from the framework's starter set (`design-gate/no-ai-look`)

The scripts are Node, install no extra packages, and make no network calls.

## Original files

| Topic | File in `data/upstream/` |
|---|---|
| Overview of the three layers | `token-architecture.md` |
| Raw values · roles · components | `primitive-tokens.md` · `semantic-tokens.md` · `component-tokens.md` |
| Component specs and states | `component-specs.md` · `states-and-variants.md` |
| Tailwind | `tailwind-integration.md` |

## Check before sending

1. `validate-tokens.cjs` leaves no raw colors or px in new code (except those with a written reason)
2. Every semantic text/background pair passes 4.5:1 in both light and dark mode
3. Every component has all 5 states

## References

- [`references/sources.md`](references/sources.md) — open when you need the origin, licence or the list of upstream files not copied
- [`references/design-direction-lookup.md`](references/design-direction-lookup.md) — open for a starting palette, font pair and Thai UX rules on a new screen


## reference: design-direction-lookup.md

<!-- merged from skill `design-direction-lookup` on 2026-11-27 · description was: Use for a starting palette and Thai-Latin fonts on a new screen -->
# design-direction-lookup — find 3 starting looks from a Thai or English brief

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the draft gives a starting point; it does not replace the beauty gate. Every direction must become a mockup and be chosen at the beauty gate of `ui-craft` step 9. If the search finds nothing, say so plainly; never invent colors or fonts and claim they came from data.

## Use when
- Starting a new screen project, or the user orders a new design, and there is no visual direction yet (`ui-craft` step 0 says to do step 0.1; this runs before its stage 3).
- You need a 2-mode palette, a Thai-Latin font pair, or Thai UX rules that fit the business, such as "ทำเว็บคลินิกทันตกรรม อยากได้โทนสีกับฟอนต์ไทยที่เข้ากัน".
- You want to know which chart fits the data, how the home page should order its sections, or what look rules a framework has.

Not for: a project whose look already passed the beauty gate (copy the sibling page per `ui-craft` step 0) · a whole brand set, logo, or corporate colors, or a customer who already has a brand → `graphic-design:brand-kit` · checking finished work for looking AI-made → `design-gate/no-ai-look` · web app or dashboard screens → `ui-craft` part `web-app-design` · mobile PWA → `ui-craft` part `mobile-app-design` · Windows desktop → `ui-craft` part `windows-app-design`.

## Steps
1. **Search one topic at a time.**
   ```bash
   python scripts/design_search.py "ร้านทองออนไลน์" --domain industry
   python scripts/design_search.py "ช่องวันที่ พ.ศ." --domain ux -n 5
   python scripts/design_search.py "ฟอร์ม validation" --domain stack --stack blazor --json
   ```
   - Domains: `industry` · `palette` (backup store; results start with a warning to search live first) · `font` · `look` · `ux` · `chart` · `landing` · `stack`. Upstream domains (English, [`data/upstream/uipro/README.md`](../data/upstream/uipro/README.md)): `style` · `product` · `motion` · `slide` · `slide-strategy` · `slide-copy`. Colors from upstream are not contrast-checked.
   - 1 run, 1 intent, 2–5 words, in Thai, English, or mixed. You may search again once with different words; if still not found, tell the user.
2. **Get colors live first, every time there is a network, before drafting.** Palettes in `data/` are a backup store; colors passed with `--palette` or `--extra-palettes` always beat the store. The method (search per `design-gate/design-references`, choose 3–5 active sites, extract colors with `scripts/brand_colors.py`, build palettes, `--palette` forms, record in DESIGN.md) is in [`live-colors.md`](live-colors.md); open it before this step.
   - The extractor reads only HTML and CSS. If it cannot extract a site, report that as is; never guess colors instead.
   - No network, or no site could be extracted: skip live colors. The draft uses the backup store with a warning on screen and in DESIGN.md: "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า".
3. **Draft 3 directions in one command.**
   ```bash
   python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
   ```
   - The draft drops a direction and takes the next if: contrast is below 4.5:1 for text or 3:1 for buttons and borders in either mode · it has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist is the first font · a Thai font has no Latin partner (such as Noto Sans Thai alone).
   - The 3 looks must not repeat, and any 2 directions need main colors far apart (under 20 degrees of hue counts as the same tone). An existing DESIGN.md is not overwritten unless `--force` is given.
   - If the brief matches no industry, the draft uses a temporary industry `custom`. If the source data contains ad words (ยกระดับ · ไร้รอยต่อ · seamless · elevate), the draft stops; fix the data.
   - Flags and the full order of the draft: [`draft-details.md`](draft-details.md).
4. **After the draft:**
   1. Open the comparison page and look at both modes yourself; do not trust the contrast numbers alone. In some Thai fonts the upper vowels hit the previous line.
   2. Send the 3 directions to `ui-craft` step 0.1 stage 3 (a fresh subagent per direction; an agent that cannot call a sub-team does each direction in turn and notes it under "ตัดสินใจเอง"). Each direction adds 1 bold move of its own; the draft does not choose it.
   3. If the customer has brand colors or fonts, substitute them in each direction and rerun the contrast check (`design-gate/parts/no-ai-look/scripts/slop_scan.py`).
   4. Choose the direction that passes the beauty gate and write the reason under `## ตัดสินใจเอง` of `docs/BUILD-PLAN.md`.

## Check before done
- [ ] `python scripts/design_search.py --self-test` · `python scripts/design_draft.py --self-test` · `python scripts/brand_colors.py --self-test` all pass.
- [ ] With a network: searched live per `design-gate/design-references`, and DESIGN.md lists the URLs of real business sites and design sources viewed, with the viewing date of each. With no network: DESIGN.md has the backup-store warning.
- [ ] If you changed the search or the data: `--eval references/relevance-cases.json` and the holdout is not below 85 %.
- [ ] DESIGN.md has 3 directions with distinct looks and says they are a starting point, not a verdict.
- [ ] The comparison page has no Inter as the main font, no Tailwind default colors, and no Thai font without a Latin partner.
- [ ] The project's existing DESIGN.md was not overwritten by accident (no `--force` unless needed).

## References
- [`query-guide.md`](query-guide.md) — open when choosing queries and domains or reading results.
- [`live-colors.md`](live-colors.md) — open at step 2: live color search, extraction, building palettes, `--palette` forms.
- [`draft-details.md`](draft-details.md) — open when tuning the draft (flags, order of checks), editing `data/` CSV files, or wanting a worked example.
- [`sources.md`](design-direction-lookup/sources.md) — sources and licences.


## reference: draft-details.md

# How the draft works (`design_draft.py`)

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

## Data

**The palettes in this set are a backup store for when live search is not possible · the looks and font pairs are also backup values, reviewed every 6 months** to match current trends (next review 2027-04-26 · `scripts/check/expiry.json` warns when the date is near) · with a network, always start from step 2

**Left out of this set on purpose** · icons: use one set across the whole app per `ui-craft` and `design-gate/no-ai-look`, no table search needed · motion: each look already has a motion slot, details are in `ui-craft/references/depth-and-flourish.md` and `graphic-design:video-editing` · Latin-only fonts: the font pairs already name the Latin font, and for the full list see fonts.google.com · stacks other than the 7 (Next.js · Vue · SwiftUI etc.) are added when real work needs them, not ahead of time

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


## reference: live-colors.md

# Search colors live first, then extract colors from real work

Do this every time there is a network, before drafting the 3 directions · color trends change fast, so the palettes in `data/` are a backup store for when live search is not possible, not the main source · colors passed to the draft with `--palette` or `--extra-palettes` always beat the store

0. **Search live per the `design-gate/design-references` skill of `superuser`:** find this year's reference work and real business sites in the field, and note which color tones you see
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

No network, or colors cannot be extracted from any site → skip to the draft step (`design-direction-lookup.md` step 3) without passing colors; the draft uses the backup store in `data/` with a warning on screen and in DESIGN.md saying "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า" (using the backup color store; a live search per design-references would be more current)


## reference: query-guide.md

# How to search design data

For use with `scripts/design_search.py` · search works in Thai, English and a mix, because the searcher segments Thai words itself and has a Thai-English synonym table

## How to search so you find it

- **1 search, 1 intent, 2–5 words** such as `ร้านทองออนไลน์` · `date picker พ.ศ.` · `ฟอนต์ไทยมีหัว ทางการ`. If you paste a whole paragraph, the irrelevant words spread the score thin.
- **Pick the domain that matches the question.** If you give none, the searcher assumes `industry`.

| You want to know | domain | Example queries |
|---|---|---|
| What personality, look, colours and fonts this business should have | `industry` | `คลินิกทันตกรรม` · `cooperative savings` |
| Backup palette library, 2 modes by mood or material (search live first, use the library when live search is not possible) | `palette` | `ทอง หรู` · `calm green` |
| Thai-Latin font pairs | `font` | `มีหัว ทางการ` · `rounded friendly` |
| Look (depth, motion, prohibitions) | `look` | `editorial` · `งานมือไทย` |
| UX rules and Thai rules | `ux` | `ช่องวันที่ พ.ศ.` · `touch target` |
| Which chart fits this data | `chart` | `แนวโน้มยอดขายรายเดือน` |
| Section order of the home page | `landing` | `สั่งซื้อผ่าน LINE` · `booking` |
| Framework-specific rules | `stack` + `--stack <name>` | `ฟอร์ม validation --stack blazor` |

- To see the available stack names: open the `data/stacks/` folder (1 file per stack), or search with a name that does not exist and the searcher will list the names
- To use the result further in a script, add `--json` · to get more than 3 rows, add `-n 10`

## When the search finds nothing

The searcher answers "ไม่พบที่ตรง" (no match found) when the words of the request that exist in the data are covered less than 25 %. Do this in order:

1. Switch to the words people in that field use, or switch language once (`ร้านขายยา` → `pharmacy`)
2. If it still finds nothing, tell the user plainly that the data has no row for this, choose the closest row yourself, and write it under `## ตัดสินใจเอง` (decided on my own)
3. Never invent an id, colour or font the searcher did not return and tell it as if it came from the data

## Reading the result

- `คะแนน` (score) is BM25, and is for comparing only within one query, not across queries
- `ครอบคลุม` (coverage) is the share of the query's words (weighted by rarity) that the row has · below 50 % means a partial match, so look at the row before using it
- A palette returns 1 result per id, but `--json` has both modes (`rows`)

## Measuring accuracy

`python scripts/design_search.py --eval references/relevance-cases.json` reports the % of cases where the expected id is in the top 3, split into the calibration set and the holdout set, and split into Thai and English · you may fix the searcher or the queries in the calibration set · **never edit a holdout case to make it pass**, because that set exists to measure whether the searcher works on words it has never seen


## reference: sources.md

# Sources · design-system

Part of plugin `software-development` · copied and adapted from ui-ux-pro-max-skill (MIT · commit `b7d5353` · viewed 2026-11-05) · the English original is kept unchanged in `data/upstream/` · licence at `data/upstream/LICENSE`

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/design-system` · MIT · commit `b7d5353` · viewed 2026-11-05 · the files in `data/upstream/` `scripts/` `templates/` are copied unchanged

## Not copied (reason)

- The slide-making system (`search-slides.py` · `generate-slide.py` · `slide-token-validator.py` · the `slide-*` CSV files): the CSV files already exist in `design-system/data/upstream/uipro/` · the rest duplicates `slide-deck`
- `fetch-background.py`: pulls images from the internet at run time, which breaks the rule of no downloads at run time
- The examples in the original use SaaS-style blue-purple only as a data format, not as recommended values
