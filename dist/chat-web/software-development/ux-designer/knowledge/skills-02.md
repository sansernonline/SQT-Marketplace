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

Not for: a project whose look already passed the beauty gate (copy the sibling page per `ui-craft` step 0) · a whole brand set, logo, or corporate colors, or a customer who already has a brand → `graphic-design:brand-kit` · checking finished work for looking AI-made → `design-gate/no-ai-look` · web app or dashboard screens → `web-app-design` · mobile PWA → `mobile-app-design` · Windows desktop → `windows-app-design`.

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


---

# skill: web-app-design

Use when designing a web app screen, mockup or scroll-motion site

# Web App Design

> **Gate before starting (every time) (`ด่านก่อนลงมือ`):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the "Gate before starting" section of `design-gate/design-references` (plugin `superuser`), even when a brand exists (the brand controls colors and fonts, while the search is for finding this piece's structure) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule:** every color in component code must come from a token.
> If a `#hex` shows up outside the token file, the design system has started to break, and it breaks silently.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Design this app screen", "dashboard", "admin panel", "SaaS screen mockup" | This file: sections 1–8 below |
| "Marketing page with scroll motion", "chapter-by-chapter story site", "3D background that moves per chapter" | [`references/dynamic-website.md`](references/dynamic-website.md). Its rule: with reduced motion on, all content stays visible, and no text fades out. |

## When to use this skill

- Building web app screens: dashboard, admin panel, internal tool, SaaS
- Wanting every page, made by different people, to look like one set
- Needing to support several brands or themes without touching component code
- Works with Angular / React / Vue / Svelte / plain HTML. It is pure CSS and tied to no framework.

## When **not** to use it

- A Windows desktop app: use `windows-app-design`
- A .docx/.pptx document: use `document-design`
- A marketing website or landing page, because this system is built for **apps** that pack in data.
  A 13px base text is too small for a sales page. For scroll-motion sales pages, use the dynamic-website row in "Pick the part".

---

## 1 · Working order: mockup first, always

> **The project already has screens → copy the existing pages by `ui-craft` item 0 and do not use appstrack** (unless the owner asked for a redesign, or the existing pages have not passed the beauty gate (`ด่านสวย`)) · the order below is for projects with no look yet, or being redesigned · appstrack gives only the component classes and fallback values. The look of the work comes from the `theme.css` produced by the search.

```
0. Visual direction by ui-craft item 0.1 (search prototypes by design-references, type web or dashboard, then extract colors · hero screen · reference apps · 3 directions · pick 1 · logo) → copy assets/theme-template.css to mockup/theme.css and fill the 4 groups of values in section 2 from the chosen direction, with the source of every value
   Pages with pictures (hero · product · service · team) → `graphic-design:image-artist` finds the pictures by image-generation into public/images/ before step 2 · never draw basic shapes yourself in place of real ones
1. Copy assets/mockup-template.html + assets/appstrack.css next to theme.css (fallback look: assets/mockup-template-preview.webp · not the goal)
   Choose the page structure (sidebar · top bar · 2-side split · single page with no menu) from the prototypes you found and the number of menu items in the app, not from the template's structure
2. Edit the content into the real page to build (do not touch app code yet)
3. python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 1440
   python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 900
   python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 420
4. Open the images and look at every width, fix until satisfied, and only then let others review
5. Convert to components only after approval: copy the existing classes, write no new CSS
6. Wire scripts/check-design-tokens.mjs into CI from day one
```

**The mockup is delivered as one file** (`mockup/<code>-mockup.html`, every screen a section) → before sending, embed the contents of `appstrack.css` followed by `theme.css` in `<style>` instead of `<link>` · check tokens with the mockup file as its own token file: `node scripts/check-design-tokens.mjs mockup/<code>-mockup.html mockup --ext html`

---

## 2 · Design tokens

> **The look comes from this job's search. Do not stop to ask.**
> Order for finding values: the client's brand colors and fonts (if they exist, use them at once) → prototypes searched live by `design-gate/design-references` and palettes extracted by `design-system` → `references/design-direction-lookup.md` item 2 → only if nothing can be searched at all (no internet · the user ordered the old look kept), use the fallback values in `assets/appstrack.css`, write `(รอยืนยัน)` (awaiting confirmation), and keep going.
> The table of work type versus color tone in `colour-by-domain` (`diagrams` → `references/colour-by-domain.md`) is a starting point for search terms, not an answer.
> **Brand colors must pass 4.5:1 for both white text on the brand background and the brand color on the page background.** If a client's color is too light, make a darker shade for `--brand` and keep the original color for the logo and charts.

**Which values are fixed and which come from the search**

| Group | token | Comes from | Fallback (appstrack) |
|---|---|---|---|
| Color | `--brand` `--brand-2` `--brand-50` `--brand-100` · background and text when the chosen direction needs them | Client brand → palette extracted from prototypes | `#226CC6` (a darker shade of `#2A78D6`) |
| Type | `--font` · `--fs-xs` … `--fs-xl` | Brand font → the Thai-Latin font pair that prototypes in the field use · base size by how dense the work is (data-packed 13 · reading-heavy 14–15) | Inter + Noto Sans Thai · 11/12/13/15/22 |
| Shape | `--radius` `--radius-sm` `--radius-pill` · `--shadow` `--shadow-lg` | The chosen direction (flat square · soft round · floating cards) | 14 · 9 · 99 · cards with no shadow |
| Layout | `--sidebar-w` `--topbar-h` `--content-max` | Number of menu items, how long menu names are, whether the main work needs wide space | 232 · 56 · 1160 |
| **Fixed for every job** | tokens only · contrast ≥ 4.5:1 · status colors by meaning · neutral app frame · 1 primary button per page · Thai rules in section 5 | System rules, independent of the job | — |

The job's values live in the single file `theme.css` (template `assets/theme-template.css`) · every line has a comment giving its source · do not edit `appstrack.css`, so the component classes can update along with the skill.

The 96 tokens are in the `:root` block of `assets/appstrack.css`, and the full details are in **`references/tokens.md`**.

**Changing the brand color of the whole app = editing 4 values** (`--brand --brand-2 --brand-50 --brand-100`).
The other colors are computed from or refer to these 4. If you need to edit a 5th color, something is hardcoded somewhere.

`assets/appstrack.css` ships 5 sample color sets (ocean · emerald · sunset · plum · graphite).
Switch them with `body[data-theme]`, and switch sidebar light/dark with `body[data-side='dark']` (dark = a neutral dark gray, not tinted with the brand color).
**These sets exist to test that the system can really change color, not as options to pick from.** The job's colors always come from `theme.css`.

**Status colors (success · warning · error) do not change with the brand.** Green always means pass, and red always means fail.

**The app frame is neutral** (by the owner's preference, and the `ui-craft` beauty gate, platform note): sidebar · topbar · borders · menu icons are gray-black · brand color goes on data, primary buttons, links, the 3px menu selection bar and the logo · tint the frame only when the user asks.

---

## 3 · Screen layout

The fallback structure is sidebar + top bar · for apps with few menu items (≤ 5) or a single-page job, choose the structure from the prototypes you found, such as top bar only or a 2-side split.

- Fallback diagram (sidebar 232px · topbar 56px · content max 1160px · stat-grid · cards): `references/layout-diagram.md`
- **The settings menu sits at the bottom of the sidebar** (`.foot` has `margin-top:auto`)
- **1 h1 per page**, always with a description under the h1. A page that does not say what it does is a page that is not finished.
- **1 primary button per page** (`.btn-primary`, solid brand color, no gradient, no shadow). The rest are `.btn` or `.btn-ghost`.
- **3–5 KPI cards.** More than that and the numbers get too small to stand out.
- Every number laid out in a column needs the `.num` class, or the digits will not line up.

---

## 4 · Components already provided

Shell `.app-shell/.app-sidebar/.app-topbar/.app-main` · card `.card/.card-head/.card-body` ·
KPI `.stat-grid > .card.stat` · status `.pill-*` in 7 tones · 4 kinds of button ·
form `.field/.input/.select/.textarea` · table `.tb-wrap > .tb` ·
filters `.chips/.tabs` · `.prog` · `.ava` · `.md-html` · `.empty` · `.skeleton` · `.spinner` ·
`.toasts/.toast` · `.backdrop + .modal` · utilities `.row/.col/.grow/.ellipsis/.num`

The full list with descriptions is at the end of `references/tokens.md`.

**Icons:** inline SVG stroke, 15px in the sidebar / 14px in buttons / 11px in pills.
Always use `stroke="currentColor"`, so the icon changes color with the state by itself.

---

## 5 · Thai language

- `--font` must always include a font that has Thai glyphs (the fallback `Inter` has no Thai, so `Noto Sans Thai` is chained on) · a font chosen from the search must be opened with real Thai text before use
- Line height 1.6 (body text) / 1.85 (`.md-html`). Thai needs more than English.
- **No justify** · **no `text-transform: uppercase` on Thai text** (it has no effect, but the
  `letter-spacing` that comes with it throws the tone marks off) · for Thai table headers, remove uppercase
- Thai buttons are about 20% wider than English ones, so do not fix button widths
- Test with real Thai text, not Lorem ipsum

---

## 6 · Check the work

```bash
# 1. Is the design system still clean?
node scripts/check-design-tokens.mjs src/styles.css src/app

# 2. Does the look still hold at every width?
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 1440
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 900
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 420
```

Then open the images and check:

- [ ] No hardcoded colors (the checker must show ✓)
- [ ] At 1024px the sidebar shrinks to icons, and at 720px it becomes a drawer with an open button
- [ ] A table wider than the screen scrolls only inside its frame, **not the whole page** (drag sideways and the sidebar must not move)
- [ ] The job's theme (`theme.css`) + sidebar light/dark: no text blends into the background · every value in `theme.css` has a source comment
- [ ] Thai text does not overflow buttons · tone marks do not collide with vowels
- [ ] Contrast ≥ 4.5:1 for every text-on-background pair, including white on `--brand` (`--text-faint` on `--bg` is the closest call at 4.65. Never make it paler · measure any new brand color before use)
- [ ] Tab reaches every control, and a focus ring shows at every point
- [ ] An empty state (`.empty`) wherever a list may be empty, and loading wherever there is a wait: content uses a `.skeleton` outline in the shape of the real thing · `.spinner` only for short waits inside a button or beside text, never in the middle of the screen

---

## 7 · Anti-patterns

- **`#hex` in component files.** The number 1 cause of a broken theme. Let the checker catch it.
- **Gradients on buttons, chips or charts · a frosted-glass topbar.** These are AI signals in `design-gate/no-ai-look`, and chart colors must stay fixed. Use solid `--brand` and `--c-*`.
- **Tinting the sidebar, topbar or borders with the brand color.** The app frame is neutral (section 2).
- **Shadows under cards.** Static cards do not float. Separate them with lines and shifted background shades. `--shadow` is for dropdowns and tooltips only · `--shadow-lg` is for modals and toasts only.
- **Several primary buttons on one page.** Users do not know what to press.
- **`overflow-x` on `<body>`** to fix an overflowing table. Fix it at `.tb-wrap`.
- **`alert()` / `confirm()`.** Use `.toast` and `.modal`.
- **Inventing new font sizes** outside the job's `--fs-*` (`ui-craft` item 2 · minimum 11 · ≤ 5 sizes per screen)
- **Sending a fallback-look mockup without searching.** Every job then looks like Apps Track. Use the fallback only when searching is impossible, and write `(รอยืนยัน)`.
- **A `.modal` with no `position` set.** It sinks under `.backdrop` and nothing can be clicked
  (the CSS already has a comment explaining this. Do not delete it.)
- **Sending a mockup that was never rendered and looked at**

---

## 8 · Link to other skills

| Need | Use together with |
|---|---|
| User flow / IA before coloring | agent `ux-designer` |
| A Windows desktop app in the same tone | `windows-app-design` |
| Screen spec document | `design-gate/polished-document-style` + `document-design` |
| Diagrams to go with the spec | `diagrams` |
| Spacing rules, visual order and the 5 states of a screen | `ui-craft` |
| Architecture diagrams | `diagrams` |

---

## Do not look AI-made

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script · every job must also pass the eye gate 3.2 (web pages answer items 10–14 too), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for every medium lives there.


## reference: dynamic-website.md

<!-- merged from skill `dynamic-website` on 2026-11-27 · description was: Use when a marketing website needs scroll motion or 3D -->
# Dynamic Website — a chapter-by-chapter storytelling site that moves without making readers dizzy

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Pre-work gate) of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:` (Pre-work gate:)

> **One rule:** every motion passes through one gate (`T()` in JS + a kill-switch in CSS) and **each chapter has its own entrance** — fade-up repeated everywhere is the number 1 AI signal of this kind of website.

## Use when
- Marketing sites · seminar pages · product launch pages · "About us" pages read chapter by chapter
- One page with 3–7 full-screen chapters changed by wheel, keyboard or swipe (deck-mode), or a normal scrolling page where content appears on scroll (page-mode)
- A "meaningful" background (a network of people · a schedule route · a map) with a camera that moves per chapter

Not for: dashboard · admin · internal tool · SaaS → `web-app-design` + `ui-craft` (motion ≤ 350 ms) · presentation slides with speaker notes → `slide-deck` · no storyline yet → `slide-deck` → `references/presentation-design.md` steps 1–3 first · animated clip or moving logo → `video-editing` (plugin `graphic-design`)

## Steps
1. Run the pre-work gate above. Colour comes from the work: use the brand colour if there is one; otherwise search live per `design-gate/design-references` (type `web` or `motion`) and extract colours from the chosen work. If live search is impossible, use `#2A78D6` (text on light: `#226CC6`), write `(รอยืนยัน)` and carry on.
2. Pick the mode per part of the site: deck-mode (chapters stacked `position:absolute; visibility:hidden`, only `.on` visible) for story chapters, page-mode (normal scroll, reveal item 8 of `recipes.md`) for registration, payment, admin. One `route()` on `hashchange`; every view pushes its teardown into `cleanups[]`, and `route()` clears them before rendering the next view.
3. Declare the entrance in markup: `<section class="ch" data-enter="blurWords">` · heading `data-t` · followers `data-f` · image `data-w`. Content lives in HTML, not JS.
4. Copy recipes from `recipes.md`; a working example is `assets/example-deck.html`. Use token names that match `web-app-design` → `tokens.md`; type scale and fonts are in `tokens-and-fonts.md`.
5. Load three.js as a module in parallel; wait for `neural:ready` or 4 seconds; probe WebGL. If it fails, set `body.no-webgl` and show a 2D canvas fallback with the same meaning. Run `setAnimationLoop` only while the screen needs it.
6. Apply the 15 rules below. Self-host fonts and GSAP (`vendor/`) for real delivery; cdnjs is fine for a mockup.
7. Run the checks below, then go through item 3 of `design-gate/no-ai-look` (for HTML run its script; a script result of 0 items is not yet a pass, so also pass eye gate 3.2 and items 10–14).

## 15 rules
1. **One gate** — every duration · delay · stagger goes through `T(s) = reduced ? 0 : s` in JS and one kill-switch block in CSS · do not check reduced-motion per animation.
2. **4 entrances per site**, chosen per chapter in the markup, never the same one in 2 chapters in a row.
3. **Exit shorter than entrance, and accelerating** (`power3.in` 0.22 s) · the new chapter enters when the camera has flown about 40%.
4. **Clear the filter after the entrance** (`clearProps:'filter'`) · blur ≤ 10px and brief · never animate `backdrop-filter`.
5. **Animate only transform · opacity · clip-path** (+ filter briefly) · never width height top.
6. Hidden chapters get `visibility:hidden` + `pointer-events:none` · toggle `aria-hidden` in the timeline · hash with `replaceState`, never `pushState` per chapter (Back would need 5 presses).
7. **The background must mean something** — 1 dot = 1 person · line = schedule · pointer = camera flies there · no floating particles for fun, no endless glow, no gradient button fills.
8. **Heavy renderer loads later**: 4-second wait, WebGL probe, 2D fallback, CSS for `body.no-webgl`.
9. **A list inside a chapter scrolls first**: at the edge give a hint, stop, and only then change chapter.
10. **`passive:false` only for wheel/touch in deck-mode**, removed when the route changes · `scroll` and `pointermove` are always `{passive:true}`.
11. **Keyboard map is mandatory**: ↓ PgDn Space · ↑ PgUp · Home End · skip inside an input or modal · rail buttons have `aria-current="step"`.
12. **Move focus after changing chapter** (`section tabindex="-1"` then `.focus()`).
13. **Reduced motion must show all content** (WCAG 2.3.3) — real text at once, every word `.on`, particles at their destination.
14. **Limit GPU load** — `devicePixelRatio` ≤ 2 (1.75 under 900px) · clamp `dt` to 50 ms · loop only while needed.
15. **Self-host fonts** as woff2, split Thai/Latin with `unicode-range` · preload only 2 weights above the fold · `font-display:swap` · no Google Fonts `<link>` in delivered files.

Also: trackpad inertia must not skip 2 chapters (drop delta < 6 and anything within 1 s after a change) · release a `busy` lock by itself at 2.4 s · error toasts attach to the faulty spot with a retry button, never vanish alone · hide 3D labels with an occluder per chapter · large Thai headings with negative `letter-spacing` need a check at every weight (tone marks vs vowels: back off to -.01em; `uppercase` + wide ls is for Latin eyebrows only) · the 3D background sits at z-index 0 under `main` (z 1), deck opacity 1, page-mode .22, with a scrim `.deck::before`.

## Check before done
- Keyboard complete: change chapters with the map above · Tab walks the rail with a focus ring · focus moves with the chapter
- Emulate prefers-reduced-motion (DevTools → Rendering): all content visible in every chapter, numbers at final values, no faded words
- `data-enter` of every chapter checked: none the same twice in a row
- Lighthouse shows no passive-listener warning; `passive:false` exists only in deck-mode and is removed on leaving it
- Fonts self-hosted, 2 weights preloaded; with network unplugged the intended font still shows
- WebGL disabled (or `body.no-webgl`): the 2D fallback appears and is readable
- 1 hard trackpad swipe = 1 chapter · an inner list scrolls to the end first
- No hardcoded colours outside the token block (`web-app-design` → `scripts/check-design-tokens.mjs`)
- Screenshots at 1440 · 900 · 420 of every chapter (`web-app-design` → `scripts/screenshot.py`), actually looked at · the rail below 900px is a bottom bar and covers no content
- Go through the a11y and motion list of vercel-labs/web-interface-guidelines (local copy, do not fetch at run time; MIT · checked 2026-10-23) as a check list for focus · motion · touch target · contrast; do not copy its text

## References
- [`recipes.md`](recipes.md) — copy-ready code for every recipe
- [`structure-and-recipes.md`](structure-and-recipes.md) — open when building the skeleton or choosing a recipe (use / do not use, reduced-motion behaviour of each)
- [`tokens-and-fonts.md`](tokens-and-fonts.md) — open when setting tokens, type scale or a Thai font
- [`tools.md`](tools.md) — open when choosing GSAP vs CSS scroll-driven vs View Transitions vs scroll-snap, or when you need deeper GSAP API (then read only the plugin file you use from github.com/greensock/gsap-skills; this page's rules still outrank it)
- [`sources.md`](sources.md) — sources and check dates
- Other skills: colour tokens/forms for page-mode → `web-app-design` · motion principles and easing → `video-editing` · storyline and text budget → `slide-deck` · SEO of JS-rendered pages → `web-audit`


## reference: layout-diagram.md

# Screen layout diagram · web-app-design

Fallback structure, sidebar + top bar. Real sizes live in `theme.css`.

```
┌──────────┬─────────────────────────────────────────────────┐
│ 232px    │ topbar 56px · solid background · sticky          │
│ sidebar  ├─────────────────────────────────────────────────┤
│          │  Page title h1 22px  [secondary btn] [primary]   │
│ • menu   │  Description 12px, secondary color               │
│ • menu   │                                                 │
│          │  ┌─ stat-grid: number cards auto-fit 190px ────┐ │
│  ─────   │  └─────────────────────────────────────────────┘ │
│ Group 2  │  ┌─ card ────────────────┐ ┌─ card ──────────┐  │
│ • menu   │  │ table / form          │ │ activity/summary│  │
│          │  └───────────────────────┘ └─────────────────┘  │
│ ⚙ Settings│        ← content max 1160px, centered →         │
└──────────┴─────────────────────────────────────────────────┘
```


## reference: recipes.md

# Recipes — copy-ready code for dynamic-website

> Every block is ≤ 15 lines · rewritten in our own form, following the ideas of the reference site ai4ba.ai-cie.com (public code read 2026-10-22 · no licence stated, so the code is not copied directly) · sentences in «…» quotes are comments by that site's author, translated from Thai
> Requires: `gsap` 3.15 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js`) · `Observer.min.js` in the same folder (item 11 only) · the shorthands `$ = (s, r = document) => r.querySelector(s)` and `$$ = (s, r = document) => [...r.querySelectorAll(s)]`
> A fully assembled example: `assets/example-deck.html`

## Contents

1. [T gate and CSS kill-switch](#1-t-gate-and-css-kill-switch)
2. [splitWords](#2-splitwords)
3. [4 entrances and the exit](#3-4-entrances-and-the-exit)
4. [goChapter timeline skeleton](#4-gochapter-timeline-skeleton)
5. [iris page transition](#5-iris-page-transition)
6. [count-up](#6-count-up)
7. [decode](#7-decode)
8. [scroll reveal and lines](#8-scroll-reveal-and-lines)
9. [scrubWords](#9-scrubwords)
10. [wheel changes chapters, and locks inner scrolling lists](#10-wheel-changes-chapters-and-locks-inner-scrolling-lists)
11. [Observer touch swipe](#11-observer-touch-swipe)
12. [keyboard map](#12-keyboard-map)
13. [rail markup and CSS](#13-rail-markup-and-css)

---

## 1 T gate and CSS kill-switch

**When to use:** every file with motion — one gate in JS and one block in CSS, so each animation does not re-check reduced-motion · source app.js:238 · fx.js (reduced) · styles.css:157-162

```js
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = s => (reduced() ? 0 : s);          // every duration · delay · stagger goes through T()
// usage: tl.to(el, { opacity: 1, duration: T(.5), stagger: T(.08) })
// if you use gsap.matchMedia(): mm.add('(prefers-reduced-motion: no-preference)', () => { /* the moving parts */ });
```
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; transition-delay: 0ms !important; }
  html { scroll-behavior: auto; }
  [data-reveal], .lines .ln > span { opacity: 1; transform: none; }   /* all content must stay visible (WCAG 2.3.3) */
  .words .w { opacity: 1; }
}
```

## 2 splitWords

**When to use:** before the word-by-word entrances (item 3) · Thai has no spaces between words, so it splits at the spaces the author left in = put the spaces at the rhythm you want the words to enter · source app.js:285-300

```js
function splitWords(el) {
  if (el.dataset.split) return;                  // split once; returning to the same chapter does not split again
  el.dataset.split = 1;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType !== 3) return walk(c);        // keep the <em> <br> inside
    const frag = document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(p => {
      if (!p) return;
      if (/^\s+$/.test(p)) return frag.append(p);
      const w = document.createElement('span'); w.className = 'wd'; w.textContent = p; frag.append(w);
    });
    c.replaceWith(frag);
  });
  walk(el);
}
```
CSS: `.wd { display: inline-block; will-change: opacity, filter; }` — `will-change` only while entering, then clear it with `clearProps` (item 3)

## 3 4 entrances and the exit

**When to use:** every chapter declares its entrance in the markup `data-enter="blurWords|inkWords|blurLine|decodeWords"` · headline `data-t` · follower `data-f` · image `data-w` · source app.js:303-324 «4 entrances (never reuse fade+slide-up everywhere)»

```js
const ENTER = {
  blurWords: (els, at, tl) => els.forEach(el => { splitWords(el);
    tl.fromTo($$('.wd', el), { opacity: 0, filter: 'blur(8px)' },
      { opacity: 1, filter: 'blur(0px)', duration: T(.55), stagger: T(.075), ease: 'expo.out' }, at); }),
  inkWords: (els, at, tl) => els.forEach(el => { splitWords(el);          // readable from the first frame
    tl.fromTo($$('.wd', el), { opacity: .14 }, { opacity: 1, duration: T(.5), stagger: T(.09), ease: 'power2.out' }, at); }),
  blurLine: (els, at, tl) => tl.fromTo(els, { opacity: 0, filter: 'blur(10px)' },
    { opacity: 1, filter: 'blur(0px)', duration: T(.6), stagger: T(.08), ease: 'expo.out' }, at),
  wipe: (els, at, tl) => tl.fromTo(els, { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0 0 0 0)', duration: T(1.1), ease: 'expo.out' }, at),
  decodeWords: (els, at, tl) => els.forEach(el => { splitWords(el); $$('.wd', el).forEach((w, k) => {
    tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: T(.2), ease: 'none' }, at + T(k * .16));
    tl.call(() => decode(w, 900), null, at + T(k * .16)); }); }),     // item 7 · Latin letters only
};
```
```js
function enterChapter(sec, tl, at) {
  ENTER[sec.dataset.enter || 'blurWords']($$('[data-t]', sec), at, tl);
  ENTER.blurLine($$('[data-f]', sec), at + T(.25), tl);
  ENTER.wipe($$('[data-w]', sec), at + T(.1), tl);
  tl.set($$('.wd, [data-f], [data-w]', sec), { clearProps: 'filter,will-change' }, at + T(1.8));
}   // «clear the filter after the entrance finishes, so the text ends fully sharp and never stays blurred»
function exitChapter(sec, tl) {   // «the exit is shorter and speeds out (power3.in)»
  tl.to($$('.wd, [data-f], [data-w]', sec), { opacity: 0, filter: 'blur(8px)', duration: T(.22), stagger: T(.012), ease: 'power3.in', overwrite: 'auto' }, 0);
}
```

## 4 goChapter timeline skeleton

**When to use:** deck-mode — chapters stack with `position:absolute; visibility:hidden` and only `.on` is visible · one timeline per chapter change: exit → hide → (camera flies) → show + enter · source app.js:488-515 «the new chapter's content enters when the camera has flown about 40% of the way (overlap)»

```js
function goChapter(j) {
  j = Math.max(0, Math.min(CH.length - 1, j));
  if (deck.busy || j === deck.i) return;
  const cur = CH[deck.i], nxt = CH[j]; let at = 0;
  deck.busy = true; setTimeout(() => { deck.busy = false; }, 2400);     // «slow device: never lock for too long»
  const tl = gsap.timeline({ onComplete: () => { deck.busy = false; } });
  if (cur) { exitChapter(cur, tl); tl.add(() => { cur.classList.remove('on'); cur.setAttribute('aria-hidden', 'true'); }, T(.32)); at = T(.62); }
  world && world.chapter(nxt.id);                                        // the 3D camera flies in parallel (if there is one)
  tl.add(() => { nxt.classList.add('on'); nxt.removeAttribute('aria-hidden'); }, at);
  enterChapter(nxt, tl, at);
  deck.i = j; deck.last = performance.now();
  $$('.rail-i').forEach((b, k) => { b.classList.toggle('on', k === j); b.setAttribute('aria-current', k === j ? 'step' : 'false'); });
  history.replaceState(null, '', '#' + nxt.id); document.body.dataset.ch = nxt.id;   // do not use pushState
  nxt.focus({ preventScroll: true });                                    // move focus with the chapter (the section has tabindex="-1")
}
```
CSS: `.ch { position: absolute; inset: 0; visibility: hidden; pointer-events: none; } .ch.on { visibility: visible; pointer-events: auto; }`

## 5 iris page transition

**When to use:** changing route from a click on a "thing" on screen (a node in a network, a card) — a brand-colour circle grows from the click point, the page swaps behind the circle, then it fades out · not for every navigation · reduced → set the hash directly · source app.js:805-812, 875-884 · styles.css:563

```js
function iris(x, y, swap) {           // swap = the fn that changes the route when the circle covers the screen
  if (reduced()) return swap();
  const o = document.createElement('div'); o.className = 'iris'; document.body.append(o);
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;
  gsap.timeline()
    .fromTo(o, { clipPath: `circle(6px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: .62, ease: 'power3.in' })
    .add(swap)
    .to(o, { opacity: 0, duration: .55, delay: .25, onComplete: () => o.remove() });
}
```
```css
.iris { position: fixed; inset: 0; z-index: 70; background: var(--accent); pointer-events: none; }
```

## 6 count-up

**When to use:** statistic numbers that have just scrolled into view (`[data-count="1200"]`) — use it only on numbers you want remembered, not on every card · reduced → print the final value at once · source fx.js:41-50

```js
function countUp(el) {
  const to = Number(el.dataset.count), fmt = n => Math.round(n).toLocaleString('th-TH');
  if (reduced()) { el.textContent = fmt(to); return; }
  const dur = 1400, s = performance.now();
  (function tick(now) {
    const t = Math.min(1, (now - s) / dur), e = 1 - Math.pow(1 - t, 4);   // ease-out quart
    el.textContent = fmt(to * e);
    if (t < 1) requestAnimationFrame(tick);
  })(s);
}
```

## 7 decode

**When to use:** Latin-letter headlines (the pool is A-Z 0-9) — never use it on Thai, because floating vowels and tone marks break apart · reduced → print the real text at once · source fx.js:6-20

```js
function decode(el, dur = 1100, pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×=#%&/<>') {
  const final = el.dataset.text || (el.dataset.text = el.textContent);
  if (reduced()) { el.textContent = final; return; }
  const start = performance.now();
  const at = [...final].map((c, i) => (i / final.length) * dur * .7 + Math.random() * dur * .3);   // left settles before right
  (function tick(now) {
    const t = now - start;
    el.textContent = [...final].map((c, i) => c === ' ' || t >= at[i] ? c : pool[(Math.random() * pool.length) | 0]).join('');
    if (t < dur) requestAnimationFrame(tick); else el.textContent = final;
  })(start);
}
```

## 8 scroll reveal and lines

**When to use:** page-mode (a normally scrolling page) — CSS does the motion and JS only adds the class `.in` once with an IntersectionObserver · `.lines` = lines that appear from beneath a frame · reduced → the kill-switch in item 1 · source styles.css:148-162 · fx.js:22-39

```css
[data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity .9s var(--ease), transform 1.1s var(--ease); transition-delay: var(--d, 0ms); }
[data-reveal].in { opacity: 1; transform: none; }
.lines .ln { display: block; overflow: hidden; }
.lines .ln > span { display: inline-block; transform: translateY(115%); transition: transform 1.15s var(--ease); }
.lines.in .ln > span { transform: none; }
```
```js
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in');
  if (el.matches('[data-count]')) countUp(el);
  if (el.matches('[data-decode]')) decode(el);
  io.unobserve(el);                                              // play once
}), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
const observe = (root = document) => $$('[data-reveal], .lines, [data-count], [data-decode]', root).forEach(el => io.observe(el));
```
Use `--d` to delay items one by one within a group (`style="--d:80ms"`), at most 4–5 items — from the 6th on, the user waits.

## 9 scrubWords

**When to use:** one long sentence per page (`.words > .w`) that lights up word by word with the scroll position — not for body text · passive listener · returns a remover function to put in `cleanups` · source fx.js:52-65

```js
function scrubWords(el) {
  const words = $$('.w', el);
  if (reduced()) { words.forEach(w => w.classList.add('on')); return () => {}; }
  const onScroll = () => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  return () => removeEventListener('scroll', onScroll);
}
```
CSS: `.words .w { opacity: .18; transition: opacity .35s; } .words .w.on { opacity: 1; }`

## 10 wheel changes chapters, and locks inner scrolling lists

**When to use:** deck-mode only — `passive:false`, and remove the listener when the route changes · a `.scrollable` list inside a chapter scrolls first. At the edge, the first wheel only gives a hint. Once scrolling stops, the next wheel changes the chapter · this stops trackpad momentum from skipping 2 chapters · source app.js:724-748 «end of the list: the first time only a hint, the next time (after scrolling stops) changes the chapter»

```js
function onWheel(e) {
  const now = performance.now(), dy = e.deltaY, sinceWheel = now - (deck.lastWheel || 0); deck.lastWheel = now;
  const sc = e.target.closest('.scrollable');
  if (sc && sc.scrollHeight > sc.clientHeight + 4) {
    const atEdge = dy > 0 ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 : sc.scrollTop <= 1;
    if (!atEdge) { deck.innerAt = now; deck.edgeArm = 0; return; }                       // let the list scroll
    if (now - deck.innerAt < 700 || sinceWheel < 220) { e.preventDefault(); if (!deck.edgeArm) { deck.edgeArm = now; edgeHint(sc, dy); } return; }
    deck.edgeArm = 0;
  }
  e.preventDefault();      // «trackpad momentum: continuous scrolling after a chapter change is not counted»
  if (Math.abs(dy) < 6 || now - deck.last < 1000 || (sinceWheel < 160 && now - deck.last < 2200)) return;
  goChapter(deck.i + (dy > 0 ? 1 : -1));
}
addEventListener('wheel', onWheel, { passive: false });
cleanups.push(() => removeEventListener('wheel', onWheel));
```
`edgeHint(sc, dy)` = a small message under the list, "ดูครบแล้ว · เลื่อนอีกครั้งเพื่อไปบทถัดไป" (all seen · scroll again to go to the next chapter). It appears after 0.3 seconds and disappears by itself within 1.4 seconds.

## 11 Observer touch swipe

**When to use:** mobile deck-mode — catches only `touch`, not wheel (item 10 handles that) · skips areas that scroll on their own · source app.js:714-723 · gsap.com/docs/v3/Plugins/Observer

```js
gsap.registerPlugin(Observer);
const ob = Observer.create({
  target: window, type: 'touch', tolerance: 24, preventDefault: true,
  ignore: '.scrollable, textarea, .modal',
  onUp: () => goChapter(deck.i + 1),      // swipe up = next chapter
  onDown: () => goChapter(deck.i - 1),
});
cleanups.push(() => ob.kill());
```

## 12 keyboard map

**When to use:** every chapter-style site — required · skip when focus is in an input field or modal · left and right arrows are reserved for things inside a chapter (such as stepping through days in a schedule) · source app.js:749-759

```js
function onKey(e) {
  if (e.target.closest('input, textarea, select, [contenteditable], .modal')) return;
  const k = e.key;
  if (['ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i + 1); }
  else if (['ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i - 1); }
  else if (k === 'Home') goChapter(0);
  else if (k === 'End') goChapter(CH.length - 1);
  // ArrowLeft / ArrowRight: things inside a chapter (days in a schedule · sub-slides), not chapter changes
}
addEventListener('keydown', onKey);
cleanups.push(() => removeEventListener('keydown', onKey));
```

## 13 rail markup and CSS

**When to use:** 3–7 chapters — a numbered list on the right of the screen, the chapter name appears on hover or focus · the current chapter has `aria-current="step"` · below 900px it becomes a bottom bar · source app.js:481-483, 509 · styles.css:551-575

```js
const rail = $('#rail');
rail.innerHTML = `<button class="rail-arrow" type="button" data-step="-1" aria-label="บทก่อนหน้า">↑</button>`
  + CH.map((c, i) => `<button type="button" class="rail-i" data-i="${i}" aria-current="false"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${c.dataset.label}</span></button>`).join('')
  + `<button class="rail-arrow" type="button" data-step="1" aria-label="บทถัดไป">↓</button>`;
rail.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  deck.last = 0; goChapter(b.dataset.i != null ? +b.dataset.i : deck.i + +b.dataset.step);
});
```
```css
.rail { position: fixed; z-index: 5; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.rail-i { display: flex; align-items: center; gap: 10px; background: none; border: 0; padding: 7px 0; cursor: pointer; color: var(--muted); font-size: 13px; }
.rail-i .n { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; position: relative; padding-right: 26px; }
.rail-i .n::after { content: ""; position: absolute; right: 0; top: 50%; width: 14px; height: 1px; background: var(--line-2); transition: width .45s var(--ease); }
.rail-i.on { color: var(--ink); }  .rail-i.on .n::after { width: 22px; height: 2px; background: var(--accent); }
.rail-i .t { opacity: 0; transform: translateX(8px); transition: opacity .3s var(--ease), transform .45s var(--ease); white-space: nowrap; }
.rail-i.on .t, .rail:hover .rail-i .t, .rail-i:focus-visible .t { opacity: 1; transform: none; }
.rail-arrow { background: none; border: 1px solid var(--line-2); border-radius: 6px; width: 30px; height: 30px; cursor: pointer; color: var(--ink-2); margin: 6px 0; }
@media (max-width: 900px) {
  .rail { right: 0; left: 0; top: auto; bottom: 0; transform: none; flex-direction: row; justify-content: space-between; height: 60px; padding: 0 12px env(safe-area-inset-bottom, 0px); background: var(--bg); border-top: 1px solid var(--line); }
  .rail-i .t { display: none; }  .rail-i.on .t { display: inline; }
}
```


## reference: sources.md

# Sources · dynamic-website

## Sources (checked 2026-10-22)

The reference is the website ai4ba.ai-cie.com (public code read 2026-10-22 · no licence stated → every recipe is rewritten in our own form, keeping only the ideas and the author's Thai sentences inside «…» marks).

| Topic | Source |
|---|---|
| Structure · recipes · rules · anti-patterns | The website ai4ba.ai-cie.com (index.html · css/styles.css · js/app.js · js/fx.js · js/neural.js · js/net3d.js) public code read · no licence stated · the vendor/ that the site uses was not downloaded (`ยังไม่ได้ตรวจ` not yet checked) |
| GSAP free | README gsap@3.15.0 on cdn.jsdelivr.net and gsap.com/pricing "Now Free!" — free including every plugin, commercial use allowed · free since 3.13.0 (npm 2025-04-30) · the full licence (Standard "No Charge" GSAP License · effective 2025-04-30 · last revised 2025-05-30) was read from the copy web.archive.org/web/20261017164627/https://gsap.com/standard-license because gsap.com returned a maintenance page for some pages · the text prohibits only "Prohibited Uses", meaning use in a no-code visual animation builder that competes with Webflow · the short explanation on the same page also says you may not charge end users, which contradicts the text and the pricing page, so the text governs · checked 2026-10-26 · npm gsap@3.15.0 states a license pointing to gsap.com/standard-license and has no LICENSE file in the package |
| GSAP CDN | cdnjs.com/libraries/gsap 3.15.0 (2026-04-13) · `gsap.min.js` · plugins in the same folder (`Observer.min.js` `ScrollTrigger.min.js` `SplitText.min.js` — checked 2026-10-26: all 4 files returned HTTP 200 at `cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/<name>.min.js` · api.cdnjs.com/libraries/gsap states version 3.15.0 and licence "Standard 'No Charge' GreenSock License") |
| CSS scroll-driven | developer.mozilla.org animation-timeline · drweb.de |
| View Transitions | web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available (2025-10-16) |
| `@starting-style` · scroll-snap | developer.mozilla.org/@starting-style · caniuse.com/css-snappoints |
| Lenis | github.com/darkroomengineering/lenis (MIT · 1.3.x) |
| Observer · SplitText | gsap.com/docs/v3/Plugins/Observer · Codrops "7 Must-Know GSAP Animation Tips" (2025-09-03) · Osmo masked text reveal |
| Accessibility | WCAG 2.3.3 w3.org/WAI/WCAG21/Understanding/animation-from-interactions · Heilmann 2019 (focus after scrolling) · developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners |
| Performance | web.dev/articles/animations-guide (transform/opacity · use will-change sparingly) · cost of blur and backdrop-filter: blog.openreplay.com · f22labs.com (community articles, not benchmarks) · effect of scroll-jacking on INP (`ยังไม่ได้ตรวจ` not yet checked) |
| Thai fonts | fontsource.org · fonts.google.com · github.com/line/seed |
| External skills referenced | github.com/greensock/gsap-skills (MIT · per a report compared 2026-10-22 · file content `ยังไม่ได้ตรวจ` not yet checked) · github.com/vercel-labs/web-interface-guidelines (MIT · checked 2026-10-23) |


## reference: structure-and-recipes.md

# Structure and recipe index · dynamic-website

Open when building or changing the page skeleton (modes, router, cleanup list, heavy renderer) or choosing which recipe to copy from `recipes.md`.

## Structure

```
hashchange → route()
   │ #view.out 180 ms → cleanup() ← cleanups[] (Observer.kill · ถอด wheel/keydown · clearInterval · ยกเลิก rAF)
   ├─ hash เป็นชื่อบท → deck-mode: body.deck-mode → goChapter(j): [ออกบทเดิม]→ซ่อน→[กล้องบิน]→โชว์→[เข้าบทใหม่]
   │                                   rail · คีย์บอร์ด · wheel · Observer (touch) · history.replaceState
   └─ อื่น ๆ ────────→ page-mode: body.page-mode → IntersectionObserver ติด .in · พื้นหลังหรี่เหลือ .22
getWorld(): รอ renderer หนักไม่เกิน 4 วินาที → WebGL ได้? → three.js (กล้องเป็น object ที่ GSAP tween) · ไม่ได้ → body.no-webgl + เครือข่าย 2D canvas
```

| Part | How |
|---|---|
| 2 modes | **deck-mode** chapters stacked with `position:absolute; visibility:hidden`, only `.on` is visible · **page-mode** a normal scrolling page, using reveal item 8 of recipes · one site can have both modes (story chapters = deck · registration, payment, admin = page) |
| hash router | One function `route()` on `hashchange` · changing chapters uses `replaceState` (so the Back button is not full of chapters) · changing pages uses a normal hash |
| cleanup list | Every view pushes its own teardown function into `cleanups[]` · `route()` clears them all before rendering a new view — no leftover listeners, no leaking timers |
| markup that declares the entrance | `<section class="ch" data-enter="blurWords">` · heading `data-t` · followers `data-f` · image `data-w` · content lives in HTML, not in JS |
| heavy renderer | Load three.js as a module in parallel · wait for `neural:ready` or 4 seconds · probe WebGL · if it fails → `body.no-webgl` + a 2D canvas fallback that conveys the same meaning · `setAnimationLoop` only while the screen needs it |

## Recipe index

All code is in `recipes.md` (each block ≤ 15 lines, with its source).

| Recipe | What it does | Use / do not use | reduced-motion |
|---|---|---|---|
| T gate + kill-switch | The one gate of all motion | Every file · do not re-check per item | itself |
| splitWords | Split text into `.wd` by spaces | Before a per-word entrance · Thai = put spaces at the rhythm you want the entrance to follow | not affected |
| blurWords | Default entrance, words blurred → sharp | Thai/Latin headings ≤ 12 words | duration 0 · clear blur |
| inkWords | Words darken from .14 | Long closing sentence · readable from the first frame | same |
| blurLine | Whole block blurs in with stagger 0.08 | Followers `data-f` · paragraphs · forms | same |
| wipe | `clip-path` bottom → top | 1 image or figure per chapter | same |
| decodeWords | Random characters run until they settle | Latin headings only · **not for Thai** (floating vowels break) | type the real text at once |
| exit | Short exit, accelerating | Pair with every entrance | 0 |
| goChapter | One timeline: exit → hide → camera → show → enter | deck-mode | immediate |
| iris | A brand-colour circle grows from the click point, swap page behind the circle | Route change from clicking a "thing" on screen · not every navigation | skip, set the hash directly |
| count-up | A number flows to its value | 1 statistic you want remembered · not every card | type the final value |
| scroll reveal + .lines | CSS does the motion, IO adds `.in` | page-mode | kill-switch |
| scrubWords | Words light up by scroll position | 1 long sentence per page · not body text | every word `.on` |
| wheel + inner-list lock | Wheel changes chapter, list scrolls first | deck-mode only · `passive:false` | T=0 makes it immediate |
| Observer swipe | Swipe changes chapter `tolerance:24` | Mobile deck-mode · skip `.scrollable` | same |
| keyboard map | ↓ PgDn Space · ↑ PgUp · Home End | Every chapter-style site (mandatory) | same |
| rail | Number list 01–05 on the right · bottom bar on mobile | 3–7 chapters | CSS only |


## reference: tokens-and-fonts.md

# Tokens, type scale and Thai fonts · dynamic-website

Open when setting colour tokens, type sizes or choosing a Thai font for large headings.

## Tokens and type scale

**Colour comes from the work** — if there is a brand colour, use it · if not → **search references first:** take the project's words and search live per `design-gate/design-references` (plugin `superuser`) type `web` or `motion`, then extract colours from the chosen work · the stored palette library is for when live search is impossible · if live search is impossible → house value `#2A78D6` (dark shade `#226CC6` for text on a light background), write `(รอยืนยัน)` (awaiting confirmation) and carry on · the values in the table are the reference site's, so stick to the **token list and its roles**, not the colour values · token names match `web-app-design` → `references/tokens.md` so page-mode pages (forms · admin) can use the same set

| Token | Reference value | Type role | Value |
|---|---|---|---|
| `--bg` · `--surface` | `#F7F6F2` · `#FFF` | body text | 400 16px/1.6 "IBM Plex Sans Thai", system-ui |
| `--ink` · `--ink-2` · `--muted` | `#0F0F0E` · `#3A3934` · `#6B6A63` | hero display | `clamp(52px, 8.4vw, 132px)` · lh 1.04 · ls -.035em · 700 |
| `--line` · `--line-2` | `#E4E1D8` · `#CFCBBF` | chapter heading (deck) | `clamp(42px, 5.7vw, 94px)` · lh 1.02 · ls -.04em |
| `--accent` · `--accent-ink` · `--accent-soft` | brand colour · dark shade · light shade 95% | kicker h2 | `clamp(40px, 5.2vw, 76px)` · lh 1.05 · ls -.035em |
| `--ok` `--warn` `--bad` (+ `-soft`) | green · amber · red — do not change with the brand | closing sentence | `clamp(34px, 4.2vw, 66px)` · lh 1.16 · 600 · max-width 12.5em |
| `--ease` | `cubic-bezier(.16,1,.3,1)` (expo-out) | lead / hero-sub | 18px or `clamp(17px,1.6vw,20px)` · max-width 34–36em |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | large outlined number | `clamp(100px,9vw,170px)` · `-webkit-text-stroke` 1.5px ink 13% |
| `--r` · `--pad` · `--max` · `--top` | 8px · 24px→16px · 1200px · 64px→56px | eyebrow / small | 12–13px · ls .04–.28em (Latin only) · `tabular-nums` |

- Large Thai headings with negative `letter-spacing` must be checked at every weight — when tone marks collide with vowels, back off to -.01em · `uppercase` + wide ls is for Latin eyebrows only (`web-app-design` item 5)
- The 3D background sits at z-index 0 under `main` (z 1) · deck opacity 1 · page-mode .22 · with a gradient scrim `.deck::before` «ให้ตัวหนังสืออ่านง่ายเหนือเครือข่าย»

## Thai fonts for large headings

| Font | Licence | Suited to | Note |
|---|---|---|---|
| IBM Plex Sans Thai | OFL 1.1 | Body text + chapter headings (the reference site uses it) | Latin is Plex Sans · loopless (the looped one is named IBM Plex Sans Thai Looped · checked 2026-10-23) easy to read at small size |
| Anuphan | OFL 1.1 | Large loopless headings, modern | Adapted from Plex Thai in a loopless style · negative ls allowed |
| Bai Jamjuree | OFL 1.1 | Large angular headings | The maker states "suited to headings" |
| Kanit | OFL 1.1 | Large bold headings | Cut terminals, narrow ls allowed · many weights |
| Noto Sans Thai | OFL 1.1 | Safe fallback for every job | Pairs with Noto Sans Latin |
| LINE Seed Sans TH | OFL 1.1 (github.com/line/seed) | Large round friendly headings | On Google Fonts (`ยังไม่ได้ตรวจ` not yet checked) |
| Sarabun | OFL | Official-document body text | Not a large-heading font |
| Chakra Petch | (`ยังไม่ได้ตรวจ` not yet checked) | Technology headings — `slide-deck` uses it | Check the licence before self-hosting |

**Pairing with Latin:** looped Thai pairs with Latin serif · loopless Thai pairs with Latin sans is a starting convention, not a hard rule. Several looped Thai fonts go with sans, but a serif paired with loopless Thai often looks odd · sets already designed as pairs: Trirong · Taviraj (looped Thai + serif · OFL) · IBM Plex Sans Thai (loopless + sans) · sources: Anuthin Wongsunkakon on the Linotype Neue Frutiger Thai page at myfonts.com · Smich Smanloh "Thai Type Pairing" ATypI 2020 · the Trirong and Taviraj descriptions in google/fonts · Wikipedia IBM Plex (all checked 2026-10-23)

Download everything as woff2 and self-host (rule 15) · do not `<link>` Google Fonts in the delivered files


## reference: tokens.md

# Token reference — Apps Track-style web app design system

> Warning: **the color values in this file are a finished example, not a standard.**
> Always pick colors from the work itself first (see the item "colors come from the work" in `SKILL.md`).
> What to take from this file is **the list of tokens and their roles**, not the values.
> Colors, fonts, type sizes, radii, shadows and layout widths are fallbacks. The project's values live in `theme.css` (`SKILL.md` item 2) · spacing and breakpoints follow this file.

All definitions are in `assets/appstrack.css`, in the `:root` block.
**Nothing below the `=== base ===` line may contain a raw color**, because the checker uses that line as the boundary.

## Contents

1. [Brand — solid color](#brand--solid-color)
2. [Surfaces · lines · shadows](#surfaces--lines--shadows)
3. [Typography](#typography)
4. [Data colors (charts) — always solid](#data-colors-charts--always-solid)
5. [Pill (status) — three values as a set](#pill-status--three-values-as-a-set)
6. [Layout](#layout)
7. [Switching theme / brand](#switching-theme--brand)
8. [Ready-made component classes](#ready-made-component-classes)

---

## Brand — solid color

| Token | Value | Used for |
|---|---|---|
| `--brand` | `#226cc6` (a darker shade of the house default `#2A78D6`) | primary button · selected chip · progress bar · link · selected tab · menu selection bar · border on focus · logo |
| `--brand-2` | `#6a5cd6` | 2nd data color paired with `--brand` (charts) |
| `--brand-50` | `#eef4fd` | avatar · mention background · focus ring |
| `--brand-100` | `#dde9fb` | spinner track |

> **No gradient** — buttons, chips, progress and charts use solid `--brand` (`design-gate/no-ai-look`: purple-blue gradient → 1 solid brand color)
> **`--brand` must pass 4.5:1** for white text on a brand background (`#226cc6` = 5.21) · brand on `--bg` (4.87) · brand on `--brand-50` (4.71) — checked 22 Oct 2026

## Surfaces · lines · shadows

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#f6f7fb` | page background |
| `--surface` | `#ffffff` | cards · inputs · normal buttons |
| `--line` | `#eef0f5` | lines inside cards · table lines |
| `--line-strong` | `#e4e7ee` | input border · button border |
| `--skeleton` | `#e4e7ee` | loading placeholder (`.skeleton`) |
| `--shadow` | thin 2-layer shadow | dropdown · tooltip (small floating things) |
| `--shadow-lg` | deep 2-layer shadow | modal · toast · floating menu |
| `--radius` / `--radius-sm` / `--radius-pill` | `14px` / `9px` / `99px` | card / button·input / pill·chip |
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | things that appear (dropdown · toast · modal) — shoots fast then settles (expo-out) |
| `--ease-io` | `cubic-bezier(.65, 0, .35, 1)` | things that move (sliding a panel · switching tabs) · durations follow `ui-craft` item 7 |

> **Cards have no shadow** — a still card does not float; it is separated from the page by the `--line` border + `--surface` fill on `--bg` (`ui-craft` item 4) · the topbar is a solid `--surface` fill, no frosted glass

**2-part shadow from one color:** `--shadow` and `--shadow-lg` above are already 2-layer shadows in the color `rgba(20, 30, 55)` · for a project whose background is not blue-gray (cream, green, dark theme) or that needs 3 levels, add this set to the project's `:root` (not yet in `appstrack.css`).

| Token | Value | Used for |
|---|---|---|
| `--shadow-color` | `223 47% 15%` (the HSL channels of `rgba(20, 30, 55)`) | the color of every shadow layer · change the hue to match the background; do not use translucent black |
| `--elev-1` | `0 1px 2px hsl(var(--shadow-color) / .12), 0 2px 6px hsl(var(--shadow-color) / .06)` | small raised pieces: a table header that sticks to the top while scrolling · a switch knob |
| `--elev-2` | `0 1px 3px hsl(var(--shadow-color) / .14), 0 8px 20px hsl(var(--shadow-color) / .08)` | dropdown · tooltip (replaces `--shadow`) |
| `--elev-3` | `0 2px 4px hsl(var(--shadow-color) / .12), 0 18px 40px hsl(var(--shadow-color) / .12)` | modal · toast (replaces `--shadow-lg`) |

The first layer is narrow and darker (under the piece, where light cannot reach); the second is wide and faint (ambient light) · at higher levels the wide layer is offset further down in the same direction · a still card still has no shadow · for layered shadows, translucent edges and other depth language → `ui-craft` → `references/depth-and-flourish.md`

**Nested corners:** inner radius = outer radius − the distance from the outer edge to the inner item (padding), so the 2 curves are parallel, e.g. a `--radius` 14 card with an image 6 from the edge → the image radius is 8 · if the result is 0 or negative (padding ≥ outer radius) → use `--radius-sm`, because the 2 corners are so far apart the eye no longer compares them · source: vercel-labs/web-interface-guidelines, section nested radii (MIT · checked 2026-10-23)

## Typography

| Token | Value | Used for |
|---|---|---|
| `--text` | `#333b4a` | headings · main metric numbers (Key Performance Indicator · KPI) |
| `--text-body` | `#414957` | body text (the default for body) |
| `--text-muted` | `#5f6673` | labels · descriptions · table headers · empty state · inactive menu |
| `--text-faint` | `#69707d` | timestamps · menu group headings · supporting text |

Contrast (Web Content Accessibility Guidelines (WCAG) 2.2 level AA needs ≥ 4.5:1 · checked 22 Oct 2026): `--text-muted` on white 5.78 · on `--bg` 5.40 · `--text-faint` on white 4.98 · on `--bg` 4.65 ← the lowest in the system; never make it fainter

A 5-size scale, matching `ui-craft` item 2 (lg 22 · md 15 · base 13 · sm 12 · xs 11 · smallest 11):

| Level | Size | |
|---|---|---|
| h1 · KPI number | 22px / 500 · KPI 600 | page title · KPI uses `letter-spacing:-.4px` + `tabular-nums` |
| h2 | 15px / 500 | card heading · app name in the sidebar |
| body · h3 | 13px / 1.6 · h3 bold 500 | body text · input · tab · menu · sub-heading |
| button · description under h1 | 12px | |
| label · pill · table header · faint | 11px | table headers are uppercase with letter-spacing .4px (English only) |

The default font is `Inter` + `Noto Sans Thai` — Inter is chosen because it reads easily at 11–13px in dense data screens (`graphic-design` item 6 says to give a reason when using a widely used font) · a project with a brand font uses the project's · **Inter has no Thai letters**; if you forget to add Noto Sans Thai
the browser uses a system font as fallback, whose height does not match, and Thai looks smaller and shorter than English.

Every number laid out in a column must use `.num` (`tabular-nums`), otherwise the digits will not line up.

## Data colors (charts) — always solid

`--c-blue #4a8ee0` · `--c-teal #2bbd8a` · `--c-amber #f0ad2e` · `--c-green #1f9d3f` ·
`--c-violet #6a5cc9` · `--c-red #e87f7c` · `--c-grey #c8ced9`
Plan/actual pair: `--c-plan #e0eaf8` vs `--c-actual #5a97e0` · overdue is defined as `--c-late #e58079`

## Pill (status) — three values as a set

| Tone | Background | Text | Line | Used for |
|---|---|---|---|---|
| green | `#e9f7ef` | `#17794a` | `#d6efe1` | done · normal |
| blue | `#eaf2fd` | `#2160ab` | `#d8e7fb` | review · in progress |
| amber | `#fdf5e4` | `#96660d` | `#f7e9c9` | waiting · warning |
| orange | `#fdefe6` | `#a2541b` | `#f8ddcb` | nearly overdue |
| red | `#fdedec` | `#a63a34` | `#f8d9d7` | stuck · error |
| violet | `#f1eefc` | `#52439f` | `#e3ddf8` | special type |
| grey | `#f2f4f8` | `#626a7a` | `#e7eaf1` | closed · not started |

## Layout

| Token | Value |
|---|---|
| `--sidebar-w` | `232px` (≤1024px shrinks to 64px · ≤720px becomes a 240px drawer) |
| `--topbar-h` | `56px` |
| `--content-max` | `1160px` |

Breakpoints: **1024px** the sidebar shrinks to icons · **720px** the sidebar becomes a drawer (`body.nav-open`)
If a table is wider than the screen, scroll horizontally **only inside `.tb-wrap`**; never let the whole page scroll.

## Switching theme / brand

**Switch the accent across the whole app** — `body[data-theme]`: empty (ocean `#226cc6`) · `emerald #097a54` · `sunset #b8501a` · `plum #7a4ee8` · `graphite #0a7a90`
Each theme changes only 4 tokens (`--brand --brand-2 --brand-50 --brand-100`) · every `--brand` passes 4.5:1 with white text · `--bg` · the theme's own `--brand-50`

**Light/dark sidebar** — `body[data-side='dark']` changes 9 sidebar tokens · the dark background is `--sidebar-dark-bg #1f2329`, a neutral gray, not tinted with the brand color
Active menu: light mode = a gray fill `--sidebar-active-bg` + a 3px brand-colored bar (`--sidebar-active-bar`) · dark mode = a translucent overlay `--on-brand-veil` + a white bar
The app frame is neutral — the brand color inside the frame appears only in the selection bar and the logo.

**For a new customer brand**, copy a `body[data-theme='…']` block and put in the customer's 4 values (if the customer's color is too bright → use a darker shade that passes 4.5:1 as `--brand`, and keep the original color for the logo and charts)
You do not touch a single line of any component.

## Ready-made component classes

| Group | Classes |
|---|---|
| Structure | `.app-shell` `.app-sidebar` `.nav-link(.on)` `.app-topbar` `.app-main > .inner` `.page-head` |
| Card | `.card` `.card-head` `.card-body` |
| KPI | `.stat-grid` `.card.stat` (`.label` `.value` `.foot`) |
| Status | `.pill.pill-green/blue/amber/orange/red/violet/grey` |
| Button | `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` |
| Form | `.field > label` `.input` `.select` `.textarea` `.err` |
| Table | `.tb-wrap > .tb` (`.right`) |
| Filter | `.chips > .chip(.on)` · `.tabs > .tab(.on)` |
| Other | `.prog > i` `.ava(.ava-lg)` `.md-html` `.empty` `.skeleton(.lg)` (loading content) `.spinner` (a short wait inside a button) `.toasts > .toast(.ok/.err)` `.backdrop + .modal` |
| Utility | `.row` `.row-between` `.col` `.grow` `.ellipsis` `.wrap` `.mt-*` `.mb-*` `.gap-*` `.num` `.muted` `.faint` |


## reference: tools.md

# Choosing tools · dynamic-website

Open when deciding between GSAP, CSS scroll-driven animation, View Transitions and scroll-snap, or when you need more GSAP depth.

| Need | GSAP 3 (+ Observer · ScrollTrigger · SplitText) | CSS scroll-driven (`animation-timeline`) | View Transitions (same-document) | CSS scroll-snap |
|---|---|---|---|---|
| Status 2026-10 | 3.15.0 on cdnjs · every plugin free since 3.13 (2025-04) | MDN "Limited availability" · Chrome/Edge 115+ · Safari 26+ · Firefox behind a flag (Interop 2026) | Baseline Newly available · Firefox 144 · Chrome 111 · Safari 18 | 97% supported · Chrome 69 · Safari 11 · Firefox 68 |
| Choose when | Chapters that overlap in time · camera/3D rig · capturing wheel and swipe · splitting words | Progress bar · parallax · reveal in a normal scrolling page — must look fine even when it does not run | Switching a route or state where old and new DOM exist together (list → detail · theme · chapter switch with no 3D) | Chapter-style site with no JS · want the browser to handle scrolling itself |
| Do not use for | Simple reveals that CSS + IO already do | Things that must work on Firefox today with no fallback · scroll-jacking (cannot be done) | Continuous scroll-linked effects · 3D camera | Chapters with a scrolling list inside (snap will fight) · overlapping exit/enter timelines |
| reduced motion | `T()` + `gsap.matchMedia()` | kill-switch `@media (prefers-reduced-motion)` | `::view-transition-group(*){animation:none}` | turn off `scroll-behavior:smooth` |

- `@starting-style` (Baseline 2024-08) for transitions when appearing from `display:none` · Lenis 1.3.x (MIT) if you want smooth scrolling — drive it with `gsap.ticker` so there is only one rAF loop, and `respectReducedMotion:true` (the default)
- Load GSAP from cdnjs for the mockup · for real delivery, self-host the files in `vendor/` (the site must open without depending on a CDN that is down)
- If you need deeper GSAP API than this page gives (pin and scrub of ScrollTrigger · nested timelines · Flip · MorphSVG) → open the maker's official skill at github.com/greensock/gsap-skills (MIT) and read only the file of the plugin you use, do not load the whole set into context · the rules on this page (reduced motion · passive · budget) still outrank their advice
