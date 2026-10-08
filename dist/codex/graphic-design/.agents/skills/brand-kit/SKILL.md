---
name: brand-kit
description: Use when starting or redoing a business brand, or posts look inconsistent. Brand kit with logo rules, colour roles, contrast, type scale, Thai-Latin fonts.
---

# Brand Kit

One folder, one README, everything the brand needs to look like itself. A small shop needs a kit it can read in 5 minutes, not a 60-page brand book.

For app or product screens, the `software-company` plugin's `graphic-design` and `ui-craft` skills (if installed) cover tokens for code. This skill is for marketing, social and print.

## Workflow

1. **Collect** — brand name (Thai and English), 1-sentence positioning, audience, 3 personality adjectives, existing logo files, and 2 competitors to look different from
2. **Copy the folder template** in [kit-template.md](references/kit-template.md) to `brand-kit/v1/`
3. **Logo** — collect or request the 4 versions (full colour · reversed white · solid black · solid white), set clear space and minimum size (below)
4. **Colour** — assign roles, not just swatches (table below); run the contrast check on every text/background pair you will actually use
5. **Type** — pick 1 Thai+Latin pairing from [thai-fonts.md](references/thai-fonts.md), confirm the licence file, set the scale
6. **Imagery and voice** — 3 adjectives each, plus 1 on-style and 1 off-style example
7. **Write the README** — the 5 rules that must never break, each with a 1-line reason
8. **Tag** `v1` and log changes in `CHANGELOG.md`; any change to colour, logo or font is `v2`

## Colour roles

| Role | Share of layout | Job | Rule |
|---|---|---|---|
| Background / neutral | ~60% | Canvas | Off-white or near-black, not pure #FFFFFF everywhere |
| Primary | ~30% | Recognition | The colour people name the brand by |
| Accent | ~10% | Action, price, CTA | Use sparingly. If it is everywhere, it stops drawing the eye |
| Text | — | Reading | Must pass 4.5:1 on every background it sits on |
| Semantic (optional) | — | Sale, warning | Do not reuse accent for "error" |

**Contrast check (WCAG 2.2 AA, criterion 1.4.3):** normal text ≥ **4.5:1**; large text (≥ 18 pt, or ≥ 14 pt bold) ≥ **3:1**. Logos are exempt but should still be legible. Check pairs with any WCAG contrast checker (WebAIM Contrast Checker, a Figma or Canva contrast plugin, browser DevTools).

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
- Thai body line-height **1.5–1.7** (stacked vowels and tone marks collide below about 1.4); Latin-only 1.4–1.5
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

## Related

- `style-consistency` — the per-campaign style lock that sits under the kit
- `design-review` — point 7 checks every asset against this kit
- `asset-organize` — folder and naming
