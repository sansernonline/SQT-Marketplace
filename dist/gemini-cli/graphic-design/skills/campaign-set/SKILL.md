---
name: campaign-set
description: Use when one campaign (launch, sale, event, festival) needs assets for several platforms. Asset matrix from one master concept, derivation order, ship gate.
---

# Campaign Set

1 concept, every format it needs, in the right order. 5 one-off designs are not a campaign. 1 idea shown 5 ways is.

## Workflow

1. **Campaign card** — fill the card below. If you cannot write the 1-sentence summary, stop and get it from the owner
2. **Asset matrix** (the table of every asset needed) — 1 row per placement, using [asset-matrix-template.md](references/asset-matrix-template.md). Sizes come from `social-formats`
3. **Cut** — remove any row that does not serve the sentence or the audience's channels
4. **Style lock** — write or reuse a style lock sheet (`style-consistency`) before any generation or shoot
5. **Master first** — design the hero at the largest canvas of the main ratio. Get it approved before deriving anything
6. **Derive in order** — stills by ratio (9:16 → 4:5 → 1:1 → wide) → covers and banners → motion and video last, built from the still's look
7. **Name** every file with the matrix ID and `asset-organize` pattern
8. **Ship gate** (final check before posting) — each asset passes `design-review` and its matrix row is ticked. No tick, no post

## Campaign card

| Field | Example |
|---|---|
| One sentence | "Our new matcha drink is the calm way to cool down this hot season." |
| Audience | Office workers 22–35 near Silom, follow us on IG and LINE |
| One action | Order at the counter or LINE OA with code `MATCHA26` |
| Offer and dates | Buy 1 get 1, 1–15 April (Songkran week excluded) |
| Mandatory items | Logo, price, LINE OA ID, promo terms line |
| Tone | Calm, fresh, not shouting |
| Approver | Owner (ชื่อ), 24 h turnaround |

## Derivation order — why

| Order | Asset | Reason |
|---|---|---|
| 1 | Master 9:16 or 4:5 hero | Smallest text area. If it works here, it works on wider sizes |
| 2 | Other still ratios | Rearrange the same elements. Never stretch |
| 3 | Covers, banners, rich menu | Wide or special shapes reuse the hero's parts |
| 4 | Carousel and secondary posts | Same style, new content |
| 5 | Motion and video | Animate approved stills. Changing the look in video breaks the set |

## Worked example — small matrix

| ID | Placement | Canvas | Type | Copy on image | Due | Status |
|---|---|---|---|---|---|---|
| M1 | IG feed (master) | 1080 × 1350 | Still | "มัทฉะเย็น ซื้อ 1 แถม 1" + dates | 25 Mar | Approved |
| D1 | IG/FB story | 1080 × 1920 | Still | Same + LINE ID | 26 Mar | In review |
| D2 | LINE OA rich message | 1040 × 1040 | Still | Same + "แตะเพื่อรับโค้ด" | 26 Mar | To do |
| D3 | LINE rich menu large | 2500 × 1686 | Still | Menu labels | 27 Mar | To do |
| D4 | FB cover | 851 × 315 | Still | Headline only | 27 Mar | To do |
| V1 | TikTok / Reels 12 s | 1080 × 1920 | Video | Hook + offer, captions | 29 Mar | To do |

File for D1: `matcha26-d1-ig-story-v01-th.jpg`.

## Rules

- The campaign sentence is the filter for every row and every element
- Derive, do not redesign. Keep the same type, colours, subject and layout logic across rows
- Mandatory items (price, terms, ID) appear identically on every asset — copy them from the card, never retype them
- Thai promo text: check numbers and dates against the card on every row. A wrong date on 1 platform is the most common campaign error
- Deliver the matrix as a checklist file the team ticks through, saved in the campaign's `02-exports/` folder

## Related

- `social-formats` — sizes and safe zones per row
- `style-consistency` — the look shared by all rows
- `video-script-to-clip` — V rows
- `design-review` — the ship gate
- `asset-organize` — names and folders
