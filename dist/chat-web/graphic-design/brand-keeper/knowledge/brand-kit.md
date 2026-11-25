# skill: brand-kit

Use when starting a brand or needing a style guideline

# Brand Kit

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

One folder, one README, everything the brand needs to look like itself.

For app or product screens, the `software-development` plugin's `design-system` skill (if installed) covers writing tokens for code (CSS variables, Tailwind theme) and `ui-craft` covers reading existing screens; without it, keep to this skill. This skill is for marketing, social and print. A software project's one-off visuals (logo, poster, LINE art) are lighter work in `software-development:graphic-design`; once the brand needs a full kit or campaign, work here.

## Workflow

0. **Search for references first:** take the project's keywords and search live as `design-references` (plugin `superuser`) says, type `logo` (use `color` for colours), then pull the colours from the piece you choose · design the logo itself by the route in `design-by-type` `references/logo.md` (marks built from a licensed font's letterforms, never hand-drawn paths) · use the stored palette library only when a live search is not possible
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
- Keep the kit beside the work: `asset-organize` puts it at `00-brand-kit/`

## เขียนเป็นเอกสาร (full brand guideline)

Use this when an organisation or team needs a full guide (tone of voice, key messages, approval rules, file storage) or must sync colours into design tokens · a small shop is fine with the Workflow above

- **One file:** `docs/brand-guidelines.md`, which every person and every agent reads from one place · its colours and fonts are the source, and the token file follows them
- Start from `templates/brand-guidelines-starter.md` · put `(รอยืนยัน)` (awaiting confirmation) for any data you do not have, and do not invent it
- Sync tokens: `node scripts/sync-brand-to-tokens.cjs` · check a file: `scripts/validate-asset.cjs` · compare image colours: `scripts/extract-colors.cjs` · brand summary to paste into a prompt: `scripts/inject-brand-context.cjs`
- Full steps, topic/source-file table, limits and checklist: [references/brand-guidelines.md](references/brand-guidelines.md)

## Related

- `style-consistency` — the per-campaign style lock that sits under the kit
- `design-review` — point 7 checks every asset against this kit
- `asset-organize` — folder and naming

## เรียกเป็นคำสั่ง

`/graphic-design:brand-kit [brand or company name]`

Run `brand-kit` with the `brand-keeper` agent for: **$ARGUMENTS**

Ends with a README you can read in 5 minutes and a v1 version tag.

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

- The upstream is written in English and its examples are SaaS-style blue-purple · use it as a skeleton only, real colours come from the brand (`no-ai-look` item 1)
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


## reference: kit-template.md

# Brand kit folder template

Copy this tree to `brand-kit/v1/` (or to `00-brand-kit/` inside the asset tree from `asset-organize`).

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


## reference: sources.md

# Sources · brand-kit

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html


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
