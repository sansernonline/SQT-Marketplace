# skill: brand-kit

Use when a brand, a matching image series or messy files need a system

# Brand Kit

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

One folder, one README, everything the brand needs to look like itself.

For app or product screens, the `software-development` plugin's `design-system` skill (if installed) covers writing tokens for code (CSS variables, Tailwind theme) and `ui-craft` covers reading existing screens; without it, keep to this skill. This skill is for marketing, social and print. A software project's one-off visuals (logo, poster, LINE art) are lighter work in `graphic-design:design-by-type`; once the brand needs a full kit or campaign, work here.

## Workflow

0. **Search for references first:** take the project's keywords and search live as `design-gate/design-references` (plugin `superuser`) says, type `logo` (use `color` for colours), then pull the colours from the piece you choose · design the logo itself by the route in `design-by-type` `references/logo.md` (marks built from a licensed font's letterforms, never hand-drawn paths) · use the stored palette library only when a live search is not possible
1. **Collect** — brand name (Thai and English), 1-sentence positioning, audience, 3 personality adjectives, existing logo files, and 2 competitors to look different from
2. **Copy the folder template** in [kit-template.md](references/kit-template.md) to `brand-kit/v1/`
3. **Logo** — collect or request the 4 versions (full colour · reversed white · solid black · solid white), set clear space and minimum size (below)
4. **Colour** — assign roles, not just swatches (table below); run the contrast check on every text/background pair you will actually use
5. **Type** — pick 1 Thai+Latin pairing from [thai-fonts.md](references/thai-fonts.md), confirm the licence file, set the scale
6. **Imagery** — 3 adjectives, plus 1 on-style and 1 off-style example. **Voice** — not 3 adjectives: 1 before/after Thai pair written by the owner (how they would say it vs how a stranger would) · particles ครับ/ค่ะ yes or no · `คุณ` or no pronoun · 1 register from `human-writing` `references/thai-grammar.md` section 4
7. **Write the README** — the 5 rules that must never break, each with a 1-line reason
8. **Tag** `v1` and log changes in `CHANGELOG.md`; any change to colour, logo or font is `v2`

## Colour roles

| Role | Share of layout | Job | Rule |
|---|---|---|---|
| Background / neutral | ~60% | Canvas | Off-white or near-black, not pure #FFFFFF everywhere |
| Primary | ~30% | Recognition | The colour people name the brand by |
| Accent | ~10% | Action, price, call to action (CTA) | Use sparingly. If it is everywhere, it stops drawing the eye |
| Text | — | Reading | Must pass 4.5:1 on every background it sits on |
| Semantic (optional) | — | Sale, warning | Do not reuse accent for "error" |

**Contrast check (Web Content Accessibility Guidelines (WCAG) 2.2 AA, criterion 1.4.3):** normal text ≥ **4.5:1**; large text (≥ 18 pt, or ≥ 14 pt bold) ≥ **3:1**. Logos are exempt but should still be legible. Check pairs with any WCAG contrast checker (WebAIM Contrast Checker, a Figma or Canva contrast plugin, browser DevTools).

Worked example (a Thai café palette with 7 pairs, where white on amber fails and amber buttons carry dark text): [references/contrast-example.md](references/contrast-example.md)

## Type scale

- 1 Thai+Latin family for headlines and 1 for body (it can be the same family in 2 weights)
- Scale ratio 1.25 (major third) from a 16 px body: **16 · 20 · 25 · 31 · 39 · 49** px. On a 1080 px-wide social canvas: body 32–40 px, headline 72–120 px
- Thai body line-height **1.5–1.7** (stacked vowels and tone marks collide below about 1.4); Latin-only 1.4–1.5 (ค่ากลางอยู่ใน `human-writing` `references/thai-line-breaking.md`)
- Thai glyphs look smaller than Latin at the same size in many fonts — compare x-height and bump Thai 5–10% if the pairing looks uneven (judge by eye at real size)
- Looped Thai (มีหัว) for body and small text; loopless (ไม่มีหัว) for headlines and short display text

## Logo rules

| Rule | Default to write in the kit |
|---|---|
| Clear space | Height of 1 defined element (e.g. the symbol's height, or the cap height of the wordmark) on all 4 sides |
| Minimum size | Digital: test the wordmark at 24 px high and raise until it reads; print: about 15 mm wide — confirm with a test print |
| Backgrounds | Full colour on light; reversed on primary or dark; one-colour on photos only with a contrast overlay |
| Never | Stretch, rotate, recolour outside the kit, add shadow or outline, place on busy photo areas, retype the wordmark in another font |

Draw the clear-space box on a page in the kit (`logo/usage.png`) — people follow a picture, not a sentence.

## Rules

- Everything in the kit is a decision with a 1-line reason
- Not in the kit = not brand. A new colour enters only with a new kit version, never through a one-off post
- Confirm every font licence from the licence file in the download, not from a blog
- Keep the kit beside the work: [references/file-organize.md](references/file-organize.md) puts it at `00-brand-kit/`

## เขียนเป็นเอกสาร (full brand guideline)

Use this when an organisation or team needs a full guide (tone of voice, key messages, approval rules, file storage) or must sync colours into design tokens · a small shop is fine with the Workflow above

- **One file:** `docs/brand-guidelines.md`, which every person and every agent reads from one place · its colours and fonts are the source, and the token file follows them
- Start from `templates/brand-guidelines-starter.md` · put `(รอยืนยัน)` (awaiting confirmation) for any data you do not have, and do not invent it
- Sync tokens: `node scripts/sync-brand-to-tokens.cjs` · check a file: `scripts/validate-asset.cjs` · compare image colours: `scripts/extract-colors.cjs` · brand summary to paste into a prompt: `scripts/inject-brand-context.cjs`
- Full steps, topic/source-file table, limits and checklist: [references/brand-guidelines.md](references/brand-guidelines.md)

## Related

- [references/style-lock.md](references/style-lock.md) — the per-campaign style lock that sits under the kit
- `design-review` — point 7 checks every asset against this kit
- [references/file-organize.md](references/file-organize.md) — folder and naming

## เรียกเป็นคำสั่ง

`/graphic-design:brand-kit [brand or company name]`

Run `brand-kit` with the `brand-keeper` agent for: **$ARGUMENTS**

Ends with a README you can read in 5 minutes and a v1 version tag.

## Parts

Hard rules of the two absorbed jobs (full steps in each file):
- **Style lock** ([`references/style-lock.md`](references/style-lock.md)): write the style lock sheet before the first generation, never after · one sheet per campaign; a "slightly different" style is a new sheet · a mid-campaign change needs a version bump and a reason in the log · keep the sheet in the campaign folder next to the asset matrix.
- **File organize** ([`references/file-organize.md`](references/file-organize.md)): names are lowercase with hyphens only · 1 naming pattern per team, and changing it means a new kit version · `scripts/apply_renames.py` checks first and copies only with `--apply`, never moves · review `04-archive/` every quarter, and nothing leaves it without a reason in the log.

| When | Open |
|---|---|
| A series of images must look like one set | [references/style-lock.md](references/style-lock.md) · [references/style-lock-sheet.md](references/style-lock-sheet.md) · [references/style-lock-worked-example.md](references/style-lock-worked-example.md) |
| Company profile or capability deck page system | [references/corporate-profile-deck.md](references/corporate-profile-deck.md) |
| Design files are messy or versions are lost | [references/file-organize.md](references/file-organize.md) · [references/naming-and-tree.md](references/naming-and-tree.md) |
| Copying and renaming files in 1 batch | `scripts/apply_renames.py` |

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: brand-guidelines.md

# Brand guidelines — the full brand guidelines document

The long part of the "write it as a document" section in `SKILL.md` · use it when an organisation or team needs a full manual: voice, key messages, work-approval rules, file storage, or needs colours synced into tokens.

> **The one rule:** brand guidelines must be one file, `docs/brand-guidelines.md`, that every person and every agent reads from one place · the colours and fonts in it are the source, and the token file follows them, not the other way round.

Copied and adapted from ui-ux-pro-max-skill (MIT · commit `b7d5353` · viewed 2026-11-05) · the original English text is kept unchanged in `data/upstream/` · licence at `data/upstream/LICENSE`

## Choose the right job

| Job | Use |
|---|---|
| Small shop that wants a brand kit readable in 5 minutes (4 logo versions, colours by role, Thai fonts) | `SKILL.md` section Workflow |
| Organisation or team that needs a full manual: voice, key messages, work-approval rules, file storage | This file |
| Read existing code and summarise it into tokens | `ui-craft` → `design_tokens.py` (plugin `software-development`) |
| Write three-layer tokens and generate CSS | `design-system` (plugin `software-development`) |
| Check the contrast of a colour pair | The example table in `SKILL.md` |

## Steps

1. **Start from the template** `templates/brand-guidelines-starter.md` → copy it to `docs/brand-guidelines.md` and fill in the brand's real information · information not yet available gets `(รอยืนยัน)` (pending confirmation), never made up.
2. **Fill in one section at a time** by the table below · read the source file only for the section you are working on.
3. **Colours and fonts are numbers that can be checked** · choose Thai fonts by `thai-fonts.md`, and do not apply the upstream's English font examples to Thai work.
4. **Sync into tokens** (when there is an app or website): `node scripts/sync-brand-to-tokens.cjs` → gives `assets/design-tokens.json` · it creates `design-tokens.css` automatically if skill `design-system` is installed alongside, and if not, the script warns and writes only the JSON · if the project already has tokens or a `:root`, the script stops and reports, and does not overwrite (`--force` only for files it synced itself last time).
5. **Check the work before sending:** `node scripts/validate-asset.cjs <file>` (file name, size, type) · `node scripts/extract-colors.cjs <image>` compares the image's colours with the palette · `node scripts/inject-brand-context.cjs` prints a brand summary to paste into an agent's prompt.

All 4 scripts are in `scripts/` of skill `brand-kit`, written in Node, installing no extra packages and making no network connection · they read and write files relative to the folder they run in (the project root), not the skill folder.

## Sections and source files

| Section | File in `data/upstream/` |
|---|---|
| Voice | `voice-framework.md` |
| Key messages | `messaging-framework.md` |
| Visual identity | `visual-identity.md` · `logo-usage-rules.md` |
| Colours and type | `color-palette-management.md` · `typography-specifications.md` |
| Work files and approval | `asset-organization.md` · `approval-checklist.md` |
| Consistency check | `consistency-checklist.md` |
| Change the brand and sync everywhere | `update.md` |
| Document structure | `brand-guideline-template.md` |

## Limits to know

- The upstream is written in English and its examples are SaaS-style blue-purple · use it as a skeleton only, real colours come from the brand (`design-gate/no-ai-look` item 1)
- `update.md` is a command from the original ClaudeKit (`/brand update`), which our marketplace does not have yet, so follow the steps in the file by hand
- There is no logo or icon generator — the owner chose not to use work an agent draws itself, so always ask for reference examples first (`icon-design`)

## Check before sending

1. `docs/brand-guidelines.md` has no value that did not come from the brand owner (where unknown, use `(รอยืนยัน)`)
2. Every text/background colour pair passes 4.5:1 (normal text)
3. If tokens were synced, open `assets/design-tokens.json` and compare the colours with the document once

## Sources

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/brand` · MIT · commit `b7d5353` · viewed 2026-11-05 · files in `data/upstream/` `scripts/` `templates/` copied without changes


## reference: contrast-example.md

# Worked example · contrast matrix · brand-kit

### Worked example — contrast matrix

Palette for a Thai café: primary `#0F5C4D` (deep teal), accent `#F2A93B` (amber), text `#1F2328`, background `#FAF7F2`, muted text `#6B7280`.

| Text on background | Ratio | Body text (4.5) | Headline ≥ 18 pt (3.0) |
|---|---|---|---|
| `#1F2328` on `#FAF7F2` | 14.78 | Pass | Pass |
| `#0F5C4D` on `#FAF7F2` | 7.39 | Pass | Pass |
| `#FFFFFF` on `#0F5C4D` | 7.90 | Pass | Pass |
| `#6B7280` on `#FAF7F2` | 4.52 | Pass (just) | Pass |
| `#1F2328` on `#F2A93B` | 7.91 | Pass | Pass |
| `#FFFFFF` on `#F2A93B` | 2.00 | **Fail** | **Fail** |
| `#F2A93B` on `#FAF7F2` | 1.87 | **Fail** | **Fail** |

Ratios computed with the WCAG relative-luminance formula. Decision written into the kit: amber buttons carry **dark** text, never white; amber is never used for text on the light background.


## reference: corporate-profile-deck.md

# Page system · Thai corporate profile deck (red · white · charcoal)

Open when a company profile, capability deck, sales deck or one-page set must look like one set, and the owner wants this look (owner said "สวย ชอบๆ" on 2026-11-17, a Thai IT-services company profile made in Canva, 16:9, 13 pages). Borrow the system, never the brand: swap in the client's own colours and logo.

## Why it works

- One fixed page frame repeats on every content page, so 11 dense pages still read as one set.
- Red is spent only on things that point: bars, icon tiles, bullets, one keyword in a title. Body text stays charcoal on near-white, so the page stays calm.
- Every content page has the same 3 bands: header · one body pattern · bottom strip. The eye learns where to look after page 2.
- Thai and English sit together without fighting: English is the small italic kicker, Thai is the big title; English terms go in parentheses after the Thai.

## Measured values

Measured 2026-11-17 with PyMuPDF on pages 1, 2, 4 and 7 (colours binned to steps of 8, so treat them as ± 8) and `pdffonts` on page 1.

| Role | Value |
|---|---|
| Accent red (bright) | about `#e81018` |
| Accent red (shade, for the gradient end) | about `#c00808` |
| Title and body text | charcoal about `#202830` |
| Page background | about `#f8f8f8`, cards pure white |
| Icon tile behind red line icons | pale red tint (not measured) |
| Latin fonts | Gotham Bold · Book · Bold Italic · Book Italic, DM Sans Bold (paid Gotham → free stand-in Montserrat, not side-by-side checked) |
| Thai font | Prompt Regular (free, Google Fonts); titles look like a bold Prompt-style loopless face |
| Canvas | 1440 × 810 pt (16:9) |

## The page frame (every content page)

1. **Header, top left:** a short red slanted bar (parallelogram leaning like `/`) · English kicker in grey italic, medium size · Thai title below it in bold charcoal, the largest text on the page · a short red rule under the title (about 1/20 of the page width).
2. **Header, right of the title:** a thin red slash, then a 2-line Thai subtitle in regular weight.
3. **Logo** small at the top right, the same spot on every page.
4. **Bottom strip:** a full-width white pill with a soft shadow. At its left, a red gradient parallelogram label with a 2-line white bold italic heading; then 4–5 items, each a red line icon over 2 short lines of text, split by thin vertical rules.
5. **Edges:** a red ribbon curve in the bottom-right corner, faint diagonal light streaks in the background, and where there is a photo, it bleeds off the left edge and fades into the white.

## Body patterns (pick one per page)

| Pattern | Used for | How it is built |
|---|---|---|
| Card row | services, products | 4 equal white cards, large radius, soft shadow · photo on top fading into white · red rounded-square icon tile overlapping the photo's lower edge · bold italic English name · 1–2 Thai lines · short red rule · 4 red square bullets |
| Hub | capabilities, product family | logo in a centre circle with a red ring · 4–6 capsule cards around it, each a red icon tile + name + small photo · dotted connectors ending in small red ring nodes |
| Process | how we work | 5 cards with photos · red parallelogram tab "01 Analysis" across each card · red chevrons between cards |
| Two columns of labelled boxes | features and benefits | red parallelogram section labels · 2×2 white feature boxes with red line icons · benefit list with red check boxes |
| Logo wall | clients | 4×2 white rounded tiles, one logo each, nothing else |
| Contact | last page | white card: red icon tiles for phone, mail, web, address · QR code in red corner brackets · red pill button with the LINE ID |

The cover is the only page without the frame: logo top left, the company name very large in 2 lines, a short red rule, the Thai legal name, then a 2-line tagline with one phrase in red bold italic; the right half is a photo cut by a diagonal, with a red ribbon across the bottom.

## When building one

- Write the style lock sheet ([style-lock-sheet.md](style-lock-sheet.md)) from the table above, with the client's colours in place of the red.
- Build pages with **live text layers** (Canva, PowerPoint, HTML, Figma). The source deck's pages 2–12 are each one flat image: no text can be searched, copied, edited or read aloud, and the file is 24 MB. Use images only for photos and icons.
- One icon set, one stroke weight, red only. Photos share light and colour temperature (checklist rows 1–5 in `SKILL.md`).
- Check every AI-made photo for fake text on screens and signs (the source's kiosk screen shows garbled Thai) and fix or replace it.
- A client logo wall needs each client's permission.
- Drop empty trailing pages (the source ends with a blank page 13).

## Clash with `design-gate/no-ai-look`

This look uses several signals that `design-gate/no-ai-look` section 2 says are never the default: grids of identical cards, icon tiles above headings, every page title + bullets, swoosh ribbons, and words like "ยกระดับ" and "ในยุคดิจิทัล". The owner chose the look, so the layout signals may stay: note the owner's pick under **ตัดสินใจเอง** and add a `slop-ok` comment in HTML/CSS output. The words do not get a pass: still run the copy through `human-writing`.


## reference: file-organize.md


# Asset Organize

Files you cannot find do not exist. The fix is 1 folder tree, 1 naming pattern and 1 version rule, written in the brand kit README so new people learn it on their first day.

## Workflow

1. **Inventory** — list every file with path, size, date modified. Group by campaign or use (PowerShell: `Get-ChildItem -Recurse -File | Select FullName,Length,LastWriteTime | Export-Csv inventory.csv`; Linux: `find . -type f -printf '%p,%s,%TY-%Tm-%Td\n' > inventory.csv`; Mac: use `gfind` from findutils or a spreadsheet)
2. **Create the tree** below (template with sub-folders in [naming-and-tree.md](naming-and-tree.md))
3. **Decide the tokens** (the parts of a file name) — campaign codes, asset names, platform and format codes from the code list. Write them into the brand kit README
4. **Map old → new** in `rename-log.csv` (header `old,new`) before touching any file
5. **Check, then copy** in 1 batch: `python scripts/apply_renames.py rename-log.csv` checks the plan and touches nothing (missing source · two rows with the same new name · new name already on disk · names that break the rules below); fix until it passes, then add `--apply`: files are copied, not moved, and the originals stay. `--undo` removes the copies (only the ones still identical to the original). Check that the file count before and after is the same · delete the old files only after the user has looked (`_to_delete/`, never `rm`) · `--self-test` (5 ข้อ)
6. **Archive the unknown** — anything nobody can identify goes to `04-archive/<yyyy-mm>-unsorted/`, never deleted
7. **Announce** the tree and pattern; old shared links will break, so share the log

## Folder tree

```
brand-assets/
├── 00-brand-kit/          README, logo, colour, type (see brand-kit)
├── 01-masters/            editable sources: .psd .ai .fig links .afdesign .prproj
│   └── <campaign>/
├── 02-exports/            finished files only, named and versioned
│   └── <campaign>/
├── 03-source-media/       photos, footage, AI generations not yet used
│   └── <yyyy-mm>-<shoot-or-batch>/
├── 04-archive/            dead campaigns, read-only
└── _inbox/                drop zone, emptied weekly
```

Status lives in the folder, not the file name: drafts stay in `01-masters/`, only approved files reach `02-exports/`.

## Naming pattern

```
<campaign>[-<id>]-<asset>-<platform>-<format>-v<NN>[-<lang>].<ext>
```

| Token | Rule | Example |
|---|---|---|
| campaign | Short code, year-month if it recurs | `songkran26`, `2026-11-sale` |
| id (optional) | Row ID from the campaign asset matrix (`campaign-set`), lowercase, so "fix D3" finds one file | `m1`, `d3`, `v1` |
| asset | What it shows, 1–2 words | `hero`, `menu-matcha`, `promo-a` |
| platform | Code from the list | `ig`, `fb`, `tt`, `yt`, `line`, `x`, `li`, `print` |
| format | Placement or ratio | `feed45`, `story`, `reel`, `cover`, `richmenu-l`, `a4` |
| vNN | 2 digits so it sorts: `v01` … `v12` | `v03` |
| lang (optional) | `th`, `en` when both exist | `-th` |

Example: `songkran26-hero-ig-feed45-v03-th.png` · with a matrix ID: `songkran26-m1-hero-ig-feed45-v03-th.png`

## Version rules

- Every save that leaves your machine is a new version. Never overwrite a file you have sent
- Masters and exports share the version number — `v03` export was made from `v03` master
- Small fixes after approval: `v03` → `v04`, not `v03b`
- Banned words in names: `final`, `new`, `latest`, `edit`, `copy`, `ล่าสุด`, `แก้` — they soon stop being true
- Keep the last approved export and the one before it in `02-exports/`; the current working version stays in `01-masters/`; older versions move to `04-archive/`

## Thai-specific rules

- **No Thai characters, spaces or emoji in file names.** Thai names break in zip files between Windows and Mac, become `%E0%B8...` in URLs, and some upload tools reject them. Romanise: `เมนูมัทฉะ` → `menu-matcha`
- Thai titles go inside the file (metadata or a `README.md` per campaign folder), not in the name
- Use the Gregorian year in codes (`2026`, `26`) so sorting matches every tool; write the พ.ศ. year only in visible copy

## Rules

- Lowercase, hyphens only, no spaces or underscores mixed
- 1 pattern per team. Changing it means a new brand-kit version
- Review `04-archive/` every quarter. Nothing leaves the archive without a reason in the log


## reference: kit-template.md

# Brand kit folder template

Copy this tree to `brand-kit/v1/` (or to `00-brand-kit/` inside the asset tree from `brand-kit`).

```
brand-kit/
└── v1/
    ├── README.md              ← the five-minute read (template below)
    ├── CHANGELOG.md           ← one line per version
    ├── logo/
    │   ├── <brand>-logo-colour.svg / .png / .pdf
    │   ├── <brand>-logo-reversed.svg
    │   ├── <brand>-logo-black.svg
    │   ├── <brand>-logo-white.svg
    │   ├── <brand>-symbol-*.svg          (icon-only versions, if any)
    │   └── usage.png                     (clear space, min size, don'ts drawn)
    ├── colour/
    │   ├── palette.md                    (roles, hex, RGB, Cyan Magenta Yellow Key (CMYK), contrast matrix)
    │   └── swatches.png
    ├── type/
    │   ├── fonts.md                      (families, weights, scale, licence links)
    │   └── licences/                     (the SIL Open Font License (OFL) text, OFL.txt, of every font shipped)
    ├── imagery/
    │   ├── on-style/                     (3–6 examples)
    │   └── off-style/                    (2–3 examples of what not to do)
    ├── voice.md
    └── templates/                        (post, story, cover, banner, doc header)
```

## README.md template

```markdown
# <Brand ไทย> / <Brand English> — brand kit v1

<One paragraph: who we are, for whom, how we want people to feel.>

## Five rules that never break
1. <rule> — because <reason>
2. ...

## Colour
| Role | Hex | RGB | CMYK | Use |
|---|---|---|---|---|
| Background | | | | |
| Primary | | | | |
| Accent | | | | |
| Text | | | | |

Allowed text/background pairs (all ≥ 4.5:1, or ≥ 3:1 for headlines ≥ 18 pt): <list>
Forbidden pairs: <list>

## Type
Headline: <family + weight> · Body: <family + weight> · Scale: <px list> · Thai line-height: <1.6>

## Logo
Clear space: <definition> · Minimum size: <px / mm> · See logo/usage.png

## Imagery
Three adjectives: <a, b, c> · See imagery/on-style and imagery/off-style

## Voice
Three adjectives: <a, b, c> · Banned habits: <e.g. no "!!!", no English jargon in Thai copy>

## Version
v1 · <date> · owner <name>
```

## CHANGELOG.md line format

`v2 · 2026-11-01 · accent #F2A93B → #E8A030 to match print · approved by <name>`

## CMYK note

Screen hex values do not convert one-to-one to print. Ask the print shop (โรงพิมพ์) for a proof of the primary and accent, then record the CMYK they matched — not the number a converter guessed.


## reference: naming-and-tree.md

# Naming codes, full tree and rename log

## Platform and format codes

| Platform | Code | Format codes |
|---|---|---|
| Instagram | `ig` | `feed11` · `feed45` · `feed34` · `story` · `reel` · `profile` |
| Facebook | `fb` | `feed11` · `feed45` · `story` · `reel` · `cover` · `link` · `event` |
| TikTok | `tt` | `video` · `cover` · `profile` |
| YouTube | `yt` | `thumb` · `short` · `banner` · `profile` |
| LINE OA | `line` | `richmenu-l` · `richmenu-s` · `richmsg` · `profile` · `cover` · `card` |
| X | `x` | `post169` · `header` · `profile` |
| LinkedIn | `li` | `post` · `link` · `cover` · `logo` |
| Website | `web` | `hero` · `og` · `banner` |
| Print | `print` | `a4` · `a5` · `a3` · `card` · `rollup` |

Sizes for each format: see `campaign-set`.

## Full tree with campaign sub-folders

```
brand-assets/
├── 00-brand-kit/v1/ ...
├── 01-masters/
│   └── songkran26/
│       ├── songkran26-hero-master-v03.psd
│       └── songkran26-video-master-v02.prproj
├── 02-exports/
│   └── songkran26/
│       ├── README.md                    (campaign sentence, Thai titles, approver)
│       ├── asset-matrix.md              (from campaign-set)
│       ├── songkran26-hero-ig-feed45-v03-th.png
│       ├── songkran26-hero-ig-story-v03-th.png
│       └── songkran26-hero-line-richmsg-v03-th.png
├── 03-source-media/
│   ├── 2026-03-shoot-cafe/
│   └── 2026-03-ai-batch-hero/           (keep prompt files next to generations)
├── 04-archive/
│   ├── 2025-songkran25/
│   └── 2026-03-unsorted/
└── _inbox/
```

## rename-log.csv

```csv
old_path,new_path,renamed_on,by,note
"Desktop/โพสต์สงกรานต์ final.png","02-exports/songkran26/songkran26-hero-ig-feed11-v01-th.png",2026-10-06,ploy,
"Downloads/IMG_4471.jpg","03-source-media/2026-03-shoot-cafe/cafe-interior-001.jpg",2026-10-06,ploy,
"untitled-2.png","04-archive/2026-03-unsorted/untitled-2.png",2026-10-06,ploy,unknown origin
```

## Batch rename (after the log is approved)

PowerShell, one line per row of the log:

```powershell
Import-Csv rename-log.csv | ForEach-Object { New-Item -ItemType Directory -Force (Split-Path $_.new_path) | Out-Null; Move-Item -LiteralPath $_.old_path -Destination $_.new_path }
```

macOS / Linux:

```bash
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; mkdir -p "$(dirname "$new")"; mv -n "$old" "$new"; done
```

Dry run on a copy of the folder first (`-WhatIf` / `echo`), and keep the reverse ready (swap old_path and new_path):

```powershell
Import-Csv rename-log.csv | ForEach-Object { Move-Item -LiteralPath $_.old_path -Destination $_.new_path -WhatIf }   # dry run
Import-Csv rename-log.csv | ForEach-Object { Move-Item -LiteralPath $_.new_path -Destination $_.old_path }          # reverse
```

```bash
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; echo mv -n "$old" "$new"; done   # dry run
tail -n +2 rename-log.csv | while IFS=, read -r old new _; do old=${old//\"/}; new=${new//\"/}; mkdir -p "$(dirname "$old")"; mv -n "$new" "$old"; done   # reverse
```

Count files before and after (`(Get-ChildItem -Recurse -File).Count` or `find . -type f | wc -l`); the numbers must match.


## reference: sources.md

# Sources · brand-kit

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html


## reference: style-lock-sheet.md

# Style lock sheet template

Save as `02-exports/<campaign>/style-lock-v<N>.md`. Fill every line; "TBD" means the look is not locked yet.

```markdown
# Style lock — <campaign> v<N>

Brand kit: <version> · Owner: <name> · Locked on: <yyyy-mm-dd>
Anchor images: <file names, 1–3>

## Look
| Element | Locked value |
|---|---|
| Medium / style | (e.g. editorial food photography / flat vector / 3D clay) |
| Light | (direction, quality, time, colour temperature) |
| Lens and angle | (focal length family, camera height) |
| Depth of field | |
| Palette | (hex, dominant first, share %) |
| Texture / finish | (grain, matte or gloss, sharpness) |
| Background | |
| Motif | (the recurring element) |
| Composition grid | (subject position, text area, logo position) |
| Characters / products | (reference image names, must-match details) |

## Style block (paste into every prompt)
<constant text>

## Constant negatives
<list>

## Tool lock
Tool: <name> · Model version: <...> · Aspect ratios used: <...>
Style / reference image: <file> · Strength: <value> · Seed policy: <fixed n / free>
Post-processing: <preset / Look-up table (LUT) name>

## Off-style examples (do not)
- <file> — why
- <file> — why

## Accepted log
| File | Subject line | Seed | Date | Checked by |
|---|---|---|---|---|

## Version history
| Version | Date | Change | Reason |
|---|---|---|---|
| v1 | | Initial | |
```

## Recurring character sheet (add when a mascot or model repeats)

| Item | Value |
|---|---|
| Name / code | |
| Reference images | front · side · three-quarter · full body |
| Fixed features | face shape, hair, eye colour, outfit colours (hex), accessories |
| Age range, build | |
| Expressions allowed | |
| Never | (e.g. no change of outfit colour, no glasses) |

For real people: written consent covering AI-generated variations and where they will be used.


## reference: style-lock-worked-example.md

# Worked example · brand-kit

Sheet: "Matcha26 v1". Anchor: approved hero.

**Style block (constant):**
> Editorial food photography, soft window light from the right in late morning, 85mm lens, shallow depth of field, eye-level. Muted sage green, warm cream and pale oak palette with one small amber accent. Calm, natural, matte finish, fine film grain. Clean cream wall background with empty space in the upper right.

**Negatives (constant):** text, logo, hands, straws, oversaturated colour, busy background.

**Subject lines (variable):**
- "A ceramic cup of hot matcha with a leaf of foam art."
- "A matcha cheesecake slice on a small cream plate."
- "A paper takeaway cup with a plain cream sleeve."

Grid check of 6 images: #4 came out with blue-hour light → fails check 2 → regenerated with the same seed and "late morning" moved to the front of the block → accepted.


## reference: style-lock.md


# Style Consistency

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Goal: 10 assets that look like one person made them.

## Workflow

1. **Pick 1–3 anchor images** — the approved hero, or reference photos that show the look · no anchor yet → **ค้นต้นแบบก่อน:** run the project's keywords through a live search per `design-gate/design-references` (plugin `superuser`), type `illustration`, then pull the colours from the chosen work · use the stored palette bank only when live search is unavailable
2. **Write the style lock sheet** with [style-lock-sheet.md](style-lock-sheet.md) before generating anything else
3. **Build the style block** — the fixed part of every prompt (light, lens, palette, style, negatives); only the subject line changes per image
4. **Lock the tool settings** — same model and version, same aspect-ratio family, same style/reference image, seed where it helps
5. **Generate in batches** of 4–8 and lay them out side by side, never judge one alone
6. **Run the checklist** below on each; reject early
7. **Log** the accepted prompt, seed and settings in the sheet; a change to the look is a new sheet version

## Ways to hold a style (general tool features)

| Technique | Holds | Limits |
|---|---|---|
| Fixed style block in every prompt | Light, lens, palette, mood | Wording alone drifts across subjects |
| Style or reference image | Colour, texture, rendering style | Can copy the reference's content too — use a neutral one |
| Character or subject reference | A recurring person, mascot or product | Needs clear front and side references; check identity every image |
| Same seed | Composition family for similar prompts | Breaks when the subject changes a lot |
| Same model version | Everything | A model update changes the look — re-test the sheet |
| Post-processing preset (Look-up table (LUT), Lightroom preset, same grain) | Colour and finish across all images | Cannot fix wrong light direction |
| Shared layout template | Text position, logo, margins | — · a full page system for decks: [corporate-profile-deck.md](corporate-profile-deck.md) |

## Consistency checklist (per image)

| # | Check | Pass when |
|---|---|---|
| 1 | Palette | Dominant colour and accents from the sheet; no off-sheet colour larger than a small detail |
| 2 | Light | Same direction, quality and colour temperature as the sheet |
| 3 | Lens and angle | Same focal family and camera height |
| 4 | Composition | Subject and text area in the sheet's grid positions |
| 5 | Texture and finish | Same grain, sharpness, depth of field |
| 6 | Motif | The recurring element is present |
| 7 | Character / product identity | Same face, proportions, label, colours |
| 8 | Stranger test | Placed in a grid with the others, a stranger would not pick it as the odd one out |

Fail on any → reject or send to `image-generation`; do not keep "because it is done".

## Rules

- Write the sheet before the first generation, not reverse-engineered after
- One sheet per campaign; a "slightly different" style is a new sheet
- Mid-campaign changes need a version bump and a reason in the log
- Keep the sheet in the campaign folder next to the asset matrix

## Not an AI look

Before handing over, run the check in `design-gate/no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files. Lock the style against its section 4 so the whole series avoids the same AI defaults.

## References

- [`style-lock-sheet.md`](style-lock-sheet.md) — the sheet to fill in (step 2)
- [`style-lock-worked-example.md`](style-lock-worked-example.md) — open for a model style block with negatives and a grid check
- [`corporate-profile-deck.md`](corporate-profile-deck.md) — open for a company profile or capability deck: the owner's picked page system (red · white · charcoal, header + body pattern + bottom strip), measured colours and fonts


## reference: thai-fonts.md

# Free Thai + Latin fonts for brand work

General information, not legal advice — read the licence file that ships with the font before commercial use; for disputes ask a lawyer (ทนาย).

All fonts below are distributed under the **SIL Open Font License 1.1** (OFL): free for commercial print, web, video, logos and apps; you may not sell the font file by itself; include the licence text if you redistribute the font files.

| Font | Thai style | Latin | Weights | Best for | Pair with |
|---|---|---|---|---|---|
| IBM Plex Sans Thai | Loopless (also *IBM Plex Sans Thai Looped*) | Matches IBM Plex Sans | 7 | Tech, corporate, clean | IBM Plex Sans; Plex Serif for editorial |
| Noto Sans Thai | Loopless (also *Noto Sans Thai Looped*, *Noto Serif Thai*) | Matches Noto Sans | Variable | Neutral, multilingual, long text | Noto Sans; Noto Serif Thai for formal |
| Sarabun | Looped | Built in | 8 + italics | Body text, documents, formal | Kanit or Prompt for headlines |
| Kanit | Loopless | Built in | 9 + italics | Bold headlines, sport, retail promo | Sarabun body |
| Prompt | Loopless | Built in | 9 + italics | Friendly modern headlines, food, lifestyle | Sarabun or Noto Sans Thai Looped body |
| Anuphan | Loopless | Built in | Variable | Minimal geometric | Noto Sans Thai Looped body |
| LINE Seed Sans TH | Loopless | Built in | 4 | Friendly, app-like voice | Itself, or Sarabun for long body |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://github.com/google/fonts/tree/main/ofl (folders sarabun, kanit, prompt, ibmplexsansthai, notosansthai, anuphan) · https://github.com/line/seed (LINE Seed, OFL 1.1) · weight counts (รอยืนยัน on Google Fonts specimen page)

## Notes that trip people up

- **Sarabun (Google Fonts) is not TH Sarabun New / TH SarabunPSK.** The TH versions belong to the 13 national fonts (ฟอนต์แห่งชาติ) released through Software Industry Promotion Agency (SIPA) under their own free licence (checked 2026-10-26 from secondary sources only: most of the 13 use the DIP-SIPA licence, which allows free use, copying and adapting but not selling the font on its own, and adapting needs written notice to DIP and SIPA plus a new font name; TH Sarabun New is GPL-2.0-or-later with a font exception for documents that embed it; no official SIPA licence text was reachable, so read the licence file in the download before shipping). They are the government-document fonts, a different design with a smaller visual size — do not mix them in one layout.
- Weight names differ between families: Kanit Medium looks heavier than Sarabun Medium. Pair by eye at the real size.
- Under about 14 px on screen, or 7 pt in print, looped Thai reads better than loopless.
- Free-font sites that repackage files sometimes strip the licence or add their own terms — download from Google Fonts, the foundry's GitHub, or the official site, and keep the `OFL.txt` in `type/licences/`.
- Paid Thai foundries (for example Cadson Demak) licence per use — desktop, web, app, broadcast. Check before using a paid font in a video ad.
