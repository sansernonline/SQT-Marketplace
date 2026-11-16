# skill: design-review

Use when a visual is about to ship or looks off

# Design Review — 8 points, 3 ranked fixes, 1 thing to keep

> **Pre-work gate:** work sent for review must carry the line `ด่านก่อนลงมือ:` as set out in that section of `design-references` (plugin `superuser`) · a missing line, or prototypes without links → fix number 1 · work designed by the user or an outsider does not need this line, but still gets the eye check of `no-ai-look`

> **One rule:** 8 points, 3 fixes, then ship. A review that lists 20 nitpicks is a redesign request. A review that only says "feels busy" is not a review.

## Use when
- A visual (post, banner, story, print proof) is about to ship, or looks off and you must say why.
- A second look at your own or someone else's design.

Not for: a second look at text, code or a plan → a new `reviewer` agent · fixing the image itself → `image-editing-brief`

## Steps
1. Know the job: placement, campaign sentence, one action (from the `campaign-set` card). Without it, point 1 cannot be judged.
2. View at real size: on a phone for social (or 375 px wide on screen), at arm's length for print proofs. Look at the exported file, not the layout.
3. 2-second test: look for 2 seconds, look away, say what it was about. Then squint, zoom to 10%, or blur 10 px: what still shows is the real hierarchy. If the offer or the one action disappears and the photo stays, point 2 fails whatever the sizes say.
4. Score the 8 points below, pass or fail by the criteria, 1 line each. On a first sketch check points 1 and 2 only; before it ships check all 8 plus the defects list.
5. Rank the top 3 fixes by impact on the one action. Each fix names the element, the change and the amount (not "feels busy"; say "remove the second badge; the price badge alone carries the offer"). With more than 3 candidates, rank with `decision-scoring` `priority`: `node <decision-scoring>/scripts/decide.mjs priority fixes.json` (`<decision-scoring>` = folder of skill `superuser:decision-scoring`): reach = how many pieces in the set the fault touches, impact 0.25–3 on the one action, confidence 0–1, effort in hours; example [fix-priority.example.json](references/fix-priority.example.json) (made-up numbers, run 2026-10-28); a tie → the cheaper fix first.
6. Name 1 specific thing to keep that the fixes must not break.
7. Write the result with the sheet in [review-sheet.md](references/review-sheet.md).
8. Severity: a fail on 1, 3 or 8 (wrong price, unreadable text, broken hands) blocks shipping. Fails on 4–7 can ship if the deadline is hard and they go on the next-round list. Judge against the job and the kit, not personal taste; when asked "is it good?", state the criterion first.
9. If you made the asset yourself, hand the exported file to a fresh `design-critic` agent (see `no-ai-look` 3.2), and run the check in `no-ai-look` section 3 (its script on HTML/CSS, the eye check 3.2 on images and other files).

## The eight points

| # | Point | Pass when | Fail signs |
|---|---|---|---|
| 1 | First read | In 2 seconds a stranger names the product or offer intended | They name the background, a model's face, or "a promotion" |
| 2 | Hierarchy | Exactly 1 primary element, clearly largest or highest contrast; 3 levels or fewer | 2 elements the same size and weight; price and headline fight |
| 3 | Contrast | Body text ≥ 4.5:1, large text ≥ 3:1 (Web Content Accessibility Guidelines (WCAG) AA); text over photo passes a squint test · icons, chart lines and button outlines ≥ 3:1 against their background · no meaning carried by colour alone (price up/down also has an arrow or a word) | Text on busy photo areas without overlay; amber on white; a pale-grey icon on white |
| 4 | Spacing | 1 spacing scale (e.g. multiples of 8 px); outer margin ≥ inner gaps; text clear of safe zones (look up the platform's safe-zone guide live; links in social-formats/references/platform-sizes.md) | Random gaps; text touching edges; text inside the story's bottom UI zone |
| 5 | Alignment | Every element sits on a shared edge or centre line | Items "almost" aligned (off by a few px); centred and left-aligned mixed |
| 6 | Type | ≤ 2 families; ≤ 3 sizes; Thai line-height ≥ 1.5 for body; no single word alone on a headline line | Third font; faux bold; clipped tone marks or vowels; one-word last line |
| 7 | Consistency | Colours, fonts and logo from the brand kit; matches sibling assets' style lock | Off-kit colour; stretched or recoloured logo; different lighting style |
| 8 | Craft | No artefacts, no stretching, no default effects, correct spelling in both languages | AI artefacts (fingers, warped text, melted objects); jagged cut-outs; typos in price or date |

Point 6, 4 quick checks (house rules): levels differ by size **and** weight, not colour alone · line length 45–75 Latin characters, about 35–55 Thai characters · no letter-spacing on Thai body text (it breaks vowel and tone-mark stacking; tracking only on short Latin caps) · one alignment per text block (a centred headline over left-aligned body needs a visible reason).

Rendered-image defects, checked in this order, each hit written with its place: (1) text overflowing or clipped at an edge (look here first) · (2) overlaps: text on text, on a face or the product, footnote touching content · (3) uneven gaps between items that should repeat; outer margin smaller than set · (4) dark on dark or light on light that looked fine in the editor · (5) template decoration that stayed after the text changed length · (6) Thai tone marks or upper vowels missing or colliding after rendering (known with some fonts: `software-development` `data-analysis` 3.10.6): mark the font and swap it.

Left-over placeholders: before shipping run `grep -rniE "lorem|xxx|todo|\[insert|ชื่อ-นามสกุล|ใส่ข้อความ|ตัวอย่างข้อความ" <source files>`; on an image, read the text layer or the OCR. A hit is a fail on point 8.

Alt text: every post, banner or video cover that goes out has 1 line of alt text in the delivery sheet: what is seen plus any text on the image, in Thai, short, not starting with "ภาพของ". Example: `ถ้วยมัทฉะเย็น 2 แก้วบนเคาน์เตอร์ ข้อความ "ซื้อ 1 แถม 1 ถึง 15 เม.ย."`. Where each platform stores alt text: (รอยืนยัน) open the platform's help page first and do not promise a step before that.

## Check before done
- At most 3 fixes, each with element + change + amount
- 1 specific thing to keep is named
- All 8 points scored (or points 1–2 for a first sketch), placeholders grep run, alt text line written
- The `ด่านก่อนลงมือ:` line was checked on work made by us

## References
- [`references/review-sheet.md`](references/review-sheet.md) — open to write the result
- [`references/fix-priority.example.json`](references/fix-priority.example.json) — open when ranking more than 3 fixes
- [`references/worked-critique.md`](references/worked-critique.md) — open for a model critique (IG story) and weak-to-strong fix wording
- [`references/sources.md`](references/sources.md) — WCAG source and check dates
- Related: `brand-kit` (point 7) · `social-formats` (safe zones, point 4) · `style-consistency` (sibling comparison, point 7)

## เรียกเป็นคำสั่ง

`/graphic-design:design-review <path to the asset>`

Run `design-review` with the `design-critic` agent on: **$ARGUMENTS**

Output is pass or fix for each point, plus the top 3 fixes ranked by impact.


## reference: review-sheet.md

# Design review sheet

Copy per asset. Keep it next to the file or in the campaign folder as `review-<asset-id>-vNN.md`.

```markdown
# Review — <file name> (v<NN>)

Job: <placement> · Campaign sentence: <...> · One action: <...>
Viewed at: <phone / 375 px / print proof at 100%> · Reviewer: <name> · Date: <yyyy-mm-dd>

Two-second read: "<what the reviewer said it was about>"

| # | Point | Pass / Fail | Note |
|---|---|---|---|
| 1 | First read | | |
| 2 | Hierarchy | | |
| 3 | Contrast (ratio: ___ ) | | |
| 4 | Spacing / safe zone | | |
| 5 | Alignment | | |
| 6 | Type | | |
| 7 | Consistency with kit and set | | |
| 8 | Craft (artefacts, spelling TH/EN, price, date) | | |

Alt text (1 line, Thai): <text>
Left-over placeholders (grep): <none / list>

Blocking fails (1, 3, 8): <list or none>

## Top three fixes
1. <element> — <change> — <amount>
2.
3.

## Keep
<one specific thing>

## Verdict
☐ Ship · ☐ Ship after fixes 1–3 · ☐ Re-brief
```

## Quick tools

- Contrast ratio: any Web Content Accessibility Guidelines (WCAG) checker (WebAIM Contrast Checker, a Figma or Canva plugin, browser DevTools colour picker)
- Squint test: blur the image (Gaussian 8–10 px) — the primary element must still stand out
- Alignment: turn on a grid or drag guides in the design tool; check left edges and centre lines
- Thai proofreading: read the copy aloud; check ๆ, tone marks, and that numbers use one system (Arabic or Thai digits, not mixed)


## reference: sources.md

# Sources · design-review

- Point 3: WCAG 2.2 criterion 1.4.3 — ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html · the 3:1 for graphics is criterion 1.4.11 (anthropics/knowledge-work-plugins `design/skills/accessibility-review`, Apache-2.0 · ideas only, rewritten · ตรวจ 2026-11-10; (ยังไม่ได้เปิดหน้า W3C ของ 1.4.11 ในรอบนี้))


## reference: worked-critique.md

# Worked critique and fix wording · design-review

Open when you need a model of a finished review or of how to word a fix.

## Writing fixes

| Weak | Strong |
|---|---|
| "Feels busy" | "Remove the second badge; the price badge alone carries the offer" |
| "Make the text pop" | "Add a 40% black gradient behind the headline's bottom half; ratio goes from 2.1 to 6.8" |
| "Logo too small" | "Logo to 120 px wide, top-left inside the 6% side margin" |
| "Not on brand" | "Background #FFFFFF → #FAF7F2 (kit background)" |

## Worked critique

**Asset:** Instagram (IG) story, 1080 × 1920, café "ซื้อ 1 แถม 1" promo. Photo of two drinks, headline in white Kanit Bold over a light window background, price badge bottom-centre, LINE ID at the very bottom.

| # | Result | Note |
|---|---|---|
| 1 First read | Fail | Read as "two drinks"; the offer was not noticed in 2 s |
| 2 Hierarchy | Fail | Headline and price badge same size, both orange |
| 3 Contrast | Fail | White headline on bright window ≈ 1.6:1 |
| 4 Spacing | Fail | Badge and LINE ID sit in the story's bottom UI zone, under the reply bar |
| 5 Alignment | Pass | Central axis kept |
| 6 Type | Pass | Kanit + Sarabun, line-height 1.6 |
| 7 Consistency | Pass | Kit colours and logo used correctly |
| 8 Craft | Pass | No artefacts; dates checked |

**Top 3 fixes**

1. Move badge and LINE ID up into the middle band (above y = 1248 px) — the offer is currently hidden by the story UI
2. Make "ซื้อ 1 แถม 1" the single primary element: 140 px, dark `#1F2328` on an amber panel; drop the headline to 64 px
3. Darken the top third with a 50% gradient or move the headline onto the counter area — contrast to ≥ 4.5:1

**Keep:** the photo's soft side light and the two-glass composition — that is what makes it look premium.
