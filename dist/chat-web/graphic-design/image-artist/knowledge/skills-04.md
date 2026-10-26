# skill: image-editing-brief

Use when an existing or AI image needs a change (remove object, fix colour, swap background, upscale).

# Image Editing Brief

Change only what the brief names. AI edits drift: ask for a new cup and the lighting, the face and the palette change too. The keep list is the anchor.

## Workflow

1. **Name the problem precisely** — "make it better" is not an edit. Ask what is wrong and where
2. **Choose the edit type** from the table below — it decides the tool feature and the instruction style
3. **Write the brief** with [edit-brief-template.md](references/edit-brief-template.md): keep list, change list, mask area
4. **Save the original** as `<name>-v01` before any edit. Each edit is a new version. Never overwrite
5. **Make 1 change per round** when the tool allows. Several changes at once make the drift worse
6. **Check the keep list first**, then the change. A perfect change that broke the lighting is a fail
7. **Stop at round 3** on the same change — re-brief, composite by hand, or regenerate from `brief-to-image`

## Edit types

| Edit | Tool feature (general names) | Instruction that works | Watch for |
|---|---|---|---|
| Remove object | Generative fill / erase / inpaint with mask | Mask the object plus a small margin; describe what should be there instead ("plain oak counter") | Repeated textures, ghost shadows left behind |
| Add object | Inpaint with mask | Mask only where it goes; state size, angle and light direction matching the scene | Wrong light direction, wrong scale, floating object |
| Replace background | Background removal + new background or inpaint | Describe the new background's light to match the subject | Halo around hair and glass; mismatched shadows |
| Extend canvas | Outpaint / generative expand | Say which side and by how much (e.g. "extend top by 42% for a 4:5 → 9:16 canvas") | Repeated patterns, new objects appearing |
| Colour change | Selective colour, recolour, or inpaint | Give the target hex; restrict to the object | Colour bleeding into skin or background |
| Retouch / clean | Healing, spot removal | List each blemish or item | Over-smoothing; plastic skin |
| Fix AI artefacts | Inpaint per area | 1 area per round (hand, then text, then edge) | New artefacts in the redone area |
| Upscale | Upscaler, super resolution | Target pixel size, not "high quality" | Invented textures, sharpened noise, altered faces |

## Keep list — what usually must survive

- Identity of people and products (face, label, logo shape)
- Light direction and colour temperature
- Palette and dominant colour
- Composition anchor (where the subject sits, where text will go)
- Brand elements (packaging, colours from the kit)

## Worked example

**Image:** story background, iced matcha on a counter; text area top-right.
**Problem:** a straw appears (brand rule: no straws in photos), a stray cup on the right, and the image is 4:5 but the story needs 9:16.

| Round | Change | Mask / setting | Result |
|---|---|---|---|
| 1 | Remove straw — "glass rim with no straw, same condensation" | Mask straw + 10 px | Pass; keep list intact |
| 2 | Remove right cup — "continue the oak counter and blurred shop interior" | Mask cup and its shadow | Pass after 1 retry (first try left a shadow) |
| 3 | Extend top by 42% for 9:16 — "continue the cream wall, no objects" | Outpaint top only | Pass; top area is clean text space |

Verification: face of glass, layer colours, light from right, palette — all unchanged. Saved as `matcha26-bg-v04.png`.

## Rules

- 1 edit brief version per round. Never rewrite the whole brief mid-edit
- The original file is the reference for every future edit
- Do not edit product labels, prices or certification marks with AI — retouch by hand or reshoot. A changed label is a false claim
- People: no edits that change a real person's identity, body or what they appear to say without their consent
- If the edit is larger than the keep list, it is a new image — go back to `brief-to-image`

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there. Fix AI tells (plastic skin, teal-orange grade, warped text) as part of the edit.

## Related

- `brief-to-image` — when regeneration is cheaper than editing
- `style-consistency` — keep the edited image on the set's style
- `design-review` — point 8 checks for artefacts after editing


## reference: edit-brief-template.md

# Edit brief template

Save as `briefs/<asset-name>-edit.md`, next to the original brief.

```markdown
# Edit brief — <file name> (from v<NN>)

Original: <path to v01> · Target use: <placement + canvas>
Tool and version: <...>

## Problem in one line
<what is wrong, where>

## Keep (must not change)
- [ ] Subject identity: <product label / face / shape>
- [ ] Light: <direction, warm/cool>
- [ ] Palette: <dominant hex>
- [ ] Composition anchor: <subject position, text space>
- [ ] Brand elements: <...>

## Change list (one per round)
| # | Edit type | Area (mask) | Instruction | Done |
|---|---|---|---|---|
| 1 | | | | ☐ |
| 2 | | | | ☐ |

## Round log
| Round | Change # | Result | Keep list broken? | Next |
|---|---|---|---|---|
| 1 | | | | |

## Output
File: <name>-v<NN> · Verified by: <name> · Date: <yyyy-mm-dd>
```

## Canvas-extension maths

To go from one ratio to another with the same width W:

- New height = W ÷ (target width/height ratio)
- 4:5 → 9:16 at W = 1080: 1350 → 1920 px, add 570 px (42% of 1350)
- 1:1 → 4:5 at W = 1080: 1080 → 1350 px, add 270 px (25%)
- 16:9 → 1:1 at H = 1080: crop width 1920 → 1080, or extend height to 1920

Decide where the new pixels go (top for text space, bottom only if it stays outside the story UI zone).


---

# skill: brand-kit

Use when starting or redoing a brand, or posts look inconsistent. Logo rules, colour roles, Thai-Latin fonts.

# Brand Kit

One folder, one README, everything the brand needs to look like itself. A small shop needs a kit it can read in 5 minutes, not a 60-page brand book.

For app or product screens, the `software-company` plugin's `ui-craft` skill (if installed) covers tokens for code; without it, keep to this skill. This skill is for marketing, social and print. A software project's one-off visuals (logo, poster, LINE art) are lighter work in `software-company:graphic-design`; once the brand needs a full kit or campaign, work here.

## Workflow

0. **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `logo` (สีใช้ `color`) แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
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

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

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

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there.

## Related

- `style-consistency` — the per-campaign style lock that sits under the kit
- `design-review` — point 7 checks every asset against this kit
- `asset-organize` — folder and naming


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
