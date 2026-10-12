---
name: design-review
description: Use when a visual is about to ship or looks off for no clear reason. 8-point pass or fail check (hierarchy, contrast, spacing, type) and top 3 fixes.
---

# Design Review

8 points, 3 fixes, then ship. A review that lists 20 nitpicks is a redesign request. A review that only says "feels busy" is not a review.

## Workflow

1. **Know the job** — placement, campaign sentence, one action (from the `campaign-set` card). Without it, point 1 cannot be judged
2. **View at real size** — on a phone for social (or 375 px wide on screen), at arm's length for print proofs
3. **2-second test** — look for 2 seconds, look away, and say what it was about
4. **Score the 8 points** below — pass or fail by the criteria, 1 line each
5. **Rank the top 3 fixes** by impact on the one action. Each fix names the element, the change and the amount
6. **Name 1 thing to keep** that the fixes must not break
7. Write the result with the sheet in [review-sheet.md](references/review-sheet.md)

## The eight points

| # | Point | Pass when | Fail signs |
|---|---|---|---|
| 1 | First read | In 2 seconds a stranger names the product or offer intended | They name the background, a model's face, or "a promotion" |
| 2 | Hierarchy | Exactly 1 primary element, clearly largest or highest contrast; 3 levels or fewer | 2 elements the same size and weight; price and headline fight |
| 3 | Contrast | Body text ≥ 4.5:1, large text ≥ 3:1 (WCAG AA); text over photo passes a squint test | Text on busy photo areas without overlay; amber on white |
| 4 | Spacing | 1 spacing scale (e.g. multiples of 8 px); outer margin ≥ inner gaps; text clear of safe zones | Random gaps; text touching edges; text in the story's bottom 35% |
| 5 | Alignment | Every element sits on a shared edge or centre line | Items "almost" aligned (off by a few px); centred and left-aligned mixed |
| 6 | Type | ≤ 2 families; ≤ 3 sizes; Thai line-height ≥ 1.5 for body; no single word alone on a headline line | Third font; faux bold; clipped tone marks or vowels; one-word last line |
| 7 | Consistency | Colours, fonts and logo from the brand kit; matches sibling assets' style lock | Off-kit colour; stretched or recoloured logo; different lighting style |
| 8 | Craft | No artefacts, no stretching, no default effects, correct spelling in both languages | AI artefacts (fingers, warped text, melted objects); jagged cut-outs; typos in price or date |

Point 3 source: WCAG 2.2 criterion 1.4.3 — ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Severity: a fail on 1, 3 or 8 (wrong price, unreadable text, broken hands) blocks shipping. Fails on 4–7 can ship if the deadline is hard and they go on the next-round list.

## Writing fixes

| Weak | Strong |
|---|---|
| "Feels busy" | "Remove the second badge; the price badge alone carries the offer" |
| "Make the text pop" | "Add a 40% black gradient behind the headline's bottom half; ratio goes from 2.1 to 6.8" |
| "Logo too small" | "Logo to 120 px wide, top-left inside the 6% side margin" |
| "Not on brand" | "Background #FFFFFF → #FAF7F2 (kit background)" |

## Worked critique

**Asset:** IG story, 1080 × 1920, café "ซื้อ 1 แถม 1" promo. Photo of two drinks, headline in white Kanit Bold over a light window background, price badge bottom-centre, LINE ID at the very bottom.

| # | Result | Note |
|---|---|---|
| 1 First read | Fail | Read as "two drinks"; the offer was not noticed in 2 s |
| 2 Hierarchy | Fail | Headline and price badge same size, both orange |
| 3 Contrast | Fail | White headline on bright window ≈ 1.6:1 |
| 4 Spacing | Fail | Badge and LINE ID sit in the bottom 35%, under reply bar |
| 5 Alignment | Pass | Central axis kept |
| 6 Type | Pass | Kanit + Sarabun, line-height 1.6 |
| 7 Consistency | Pass | Kit colours and logo used correctly |
| 8 Craft | Pass | No artefacts; dates checked |

**Top 3 fixes**

1. Move badge and LINE ID up into the middle band (above y = 1248 px) — the offer is currently hidden by the story UI
2. Make "ซื้อ 1 แถม 1" the single primary element: 140 px, dark `#1F2328` on an amber panel; drop the headline to 64 px
3. Darken the top third with a 50% gradient or move the headline onto the counter area — contrast to ≥ 4.5:1

**Keep:** the photo's soft side light and the two-glass composition — that is what makes it look premium.

## Rules

- At most 3 fixes per round. More than that means the brief needs rewriting
- Each fix has element + change + amount
- Praise 1 specific thing. That protects what works in the next round
- Judge against the job and the kit, not personal taste. When asked "is it good?", state the criterion first

## Related

- `brand-kit` — the source for point 7
- `social-formats` — safe zones for point 4
- `style-consistency` — sibling comparison for point 7
- `image-editing-brief` — when the fix is in the image itself
