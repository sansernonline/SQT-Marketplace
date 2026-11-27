# skill: design-direction-lookup

Use for a starting palette and Thai-Latin fonts on a new screen

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
   - Domains: `industry` · `palette` (backup store; results start with a warning to search live first) · `font` · `look` · `ux` · `chart` · `landing` · `stack`. Upstream domains (English, [`data/upstream/uipro/README.md`](data/upstream/uipro/README.md)): `style` · `product` · `motion` · `slide` · `slide-strategy` · `slide-copy`. Colors from upstream are not contrast-checked.
   - 1 run, 1 intent, 2–5 words, in Thai, English, or mixed. You may search again once with different words; if still not found, tell the user.
2. **Get colors live first, every time there is a network, before drafting.** Palettes in `data/` are a backup store; colors passed with `--palette` or `--extra-palettes` always beat the store. The method (search per `design-gate/design-references`, choose 3–5 active sites, extract colors with `scripts/brand_colors.py`, build palettes, `--palette` forms, record in DESIGN.md) is in [`references/live-colors.md`](references/live-colors.md); open it before this step.
   - The extractor reads only HTML and CSS. If it cannot extract a site, report that as is; never guess colors instead.
   - No network, or no site could be extracted: skip live colors. The draft uses the backup store with a warning on screen and in DESIGN.md: "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า".
3. **Draft 3 directions in one command.**
   ```bash
   python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
   ```
   - The draft drops a direction and takes the next if: contrast is below 4.5:1 for text or 3:1 for buttons and borders in either mode · it has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist is the first font · a Thai font has no Latin partner (such as Noto Sans Thai alone).
   - The 3 looks must not repeat, and any 2 directions need main colors far apart (under 20 degrees of hue counts as the same tone). An existing DESIGN.md is not overwritten unless `--force` is given.
   - If the brief matches no industry, the draft uses a temporary industry `custom`. If the source data contains ad words (ยกระดับ · ไร้รอยต่อ · seamless · elevate), the draft stops; fix the data.
   - Flags and the full order of the draft: [`references/draft-details.md`](references/draft-details.md).
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
- [`references/query-guide.md`](references/query-guide.md) — open when choosing queries and domains or reading results.
- [`references/live-colors.md`](references/live-colors.md) — open at step 2: live color search, extraction, building palettes, `--palette` forms.
- [`references/draft-details.md`](references/draft-details.md) — open when tuning the draft (flags, order of checks), editing `data/` CSV files, or wanting a worked example.
- [`references/sources.md`](references/sources.md) — sources and licences.


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

No network, or colors cannot be extracted from any site → skip to the draft step (SKILL.md step 3) without passing colors; the draft uses the backup store in `data/` with a warning on screen and in DESIGN.md saying "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า" (using the backup color store; a live search per design-references would be more current)


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

# Sources · design-direction-lookup


- `data/upstream/uipro/` copied unchanged from ui-ux-pro-max-skill commit `28b3b8d` (MIT · 2026-10-29), as the owner ordered it copied for improvement
- The idea of a searchable dataset, the BM25 search with an abstain threshold, and the design-system generator come from nextlevelbuilder/ui-ux-pro-max-skill (MIT · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · viewed 2026-10-26) · the code and data here are entirely rewritten, not copied · what is done differently from the source: Thai word segmentation · 3 directions instead of 1 answer · dropping framework default colors · Thai-Latin font pairs
- BM25 is a widely published ranking method, written by us in `scripts/design_search.py` · k1 1.5 and b 0.75
- The contrast thresholds 4.5:1 and 3:1 follow `ui-craft` step 5 (WCAG 2.2 criteria 1.4.3 and 1.4.11)
- 3 directions · look · app personality from `ui-craft` step 0.1 · `ui-craft/references/web-looks.md` · `ui-craft/references/app-character.md`
- The color and font rules that are dropped match the rules `framework-default` and `overused-font` of `design-gate/parts/no-ai-look/scripts/slop_scan.py`


---

# skill: web-app-design

Use when designing a web app screen or mockup

# Web App Design

> **Gate before starting (every time) (`ด่านก่อนลงมือ`):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the "Gate before starting" section of `design-gate/design-references` (plugin `superuser`), even when a brand exists (the brand controls colors and fonts, while the search is for finding this piece's structure) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule:** every color in component code must come from a token.
> If a `#hex` shows up outside the token file, the design system has started to break, and it breaks silently.

## When to use this skill

- Building web app screens: dashboard, admin panel, internal tool, SaaS
- Wanting every page, made by different people, to look like one set
- Needing to support several brands or themes without touching component code
- Works with Angular / React / Vue / Svelte / plain HTML. It is pure CSS and tied to no framework.

## When **not** to use it

- A Windows desktop app: use `windows-app-design`
- A .docx/.pptx document: use `branded-document-design`
- A marketing website or landing page, because this system is built for **apps** that pack in data.
  A 13px base text is too small for a sales page.

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
> Order for finding values: the client's brand colors and fonts (if they exist, use them at once) → prototypes searched live by `design-gate/design-references` and palettes extracted by `design-direction-lookup` item 2 → only if nothing can be searched at all (no internet · the user ordered the old look kept), use the fallback values in `assets/appstrack.css`, write `(รอยืนยัน)` (awaiting confirmation), and keep going.
> The table of work type versus color tone in `colour-by-domain` (`diagram-figures` → `references/colour-by-domain.md`) is a starting point for search terms, not an answer.
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
| Screen spec document | `design-gate/polished-document-style` + `branded-document-design` |
| Diagrams to go with the spec | `markdown-visuals` |
| Spacing rules, visual order and the 5 states of a screen | `ui-craft` |
| Architecture diagrams | `software-diagrams` |

---

## Do not look AI-made

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script · every job must also pass the eye gate 3.2 (web pages answer items 10–14 too), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for every medium lives there.


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
