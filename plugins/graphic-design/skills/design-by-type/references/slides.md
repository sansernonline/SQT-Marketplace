# Slide deck · company profile

Story, slide order and layouts live in `software-development:presentation-design`; the owner's liked deck is `style-consistency/references/corporate-profile-deck.md`. This file adds the beauty rules and where to find popular decks. Tested 2026-11-19 on a fictional Thai last-mile logistics company (cover + services slide, 1920x1080); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Behance search `<industry> company profile` | full decks from real agencies, often for real firms | appreciations · views on the project page (e.g. a Vietnamese last-mile profile: 115 appreciations · 4,011 views, 2026-11-19); blocks scripts after ~5 pages |
| Dribbble search `<industry> presentation` / `pitch deck` | single strong slides | views show on the search page; the shot page hides them when not logged in |
| Real competitors' sites and brand colours (Thai ones too) | what to stay away from, and the local look | none |
| Template stores (Slidesgo · Envato) | common layouts | usually none; use as "what not to look like" |

## Beauty rules

1. The slide title states the point, not the topic ("4 บริการ เรียงตามทางที่ของเดิน", not "บริการของเรา"). Source: `presentation-design`.
2. One key number per slide is the focal element, with its measuring period and `(รอยืนยัน)` underneath. Source: Behance GHTK deck; uipro `slide-layout-logic.csv` row proof.
3. Services that are not equal are not drawn equal: one lead card, or the services placed in their real order along a route or timeline, instead of a grid of 4 icon cards. Source: `depth-and-light.md` section 1, `no-ai-look`.
4. Every slide has at least 2 overlaps (a card across the photo's diagonal cut, a photo bleeding off a card, a route end-dot over a card edge). Source: `depth-and-light.md`.
5. Light from the top left on every slide; 2-layer shadows tinted toward the background, never pure black.
6. The back layer has one strong thing: a real photo cut on a diagonal, a dimmed photo on a dark base, or a full-bleed colour block. A slide without one looks flat (test 2026-11-19).
7. Cover: text left, photo right, with one element crossing the seam. Source: uipro `slide-layout-logic.csv` hook = split-hero.
8. Thai line height 1.4 or more; break lines where the idea ends, never mid-word (the test broke "ตรวจ/สภาพ" before fixing).
9. A small italic English word above the Thai heading is fine (the owner's liked deck does it); capsule badges and wide-tracked capitals on the cover are not (`no-ai-look` `eyebrow-badge`).
10. Credit real photos on the slide and crop out any text or ads inside the photo.
11. Measure contrast on coloured panels; a mid green with white text measured 3.4:1 and had to go darker to reach about 5:1 (pixel measurement 2026-11-19).
12. Content slides carry a footer: section name left, page number right. Source: `presentation-design`.
13. Shift the deck colour away from every reference and every competitor (in Thai logistics: Flash yellow, Kerry orange, Grab and GHTK green, DHL red).

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A card sitting beside the diagonal photo cut instead of across it → move it across the cut.
- A route line running through text → reroute and move the labels.
- Wide-tracked "COMPANY PROFILE" capsule on the cover → removed.
- Content slide on a plain dark base → added a dimmed real photo behind.
- Two CSS rules fighting so the key number shrank → render and look, every time.

## Check before sending
- [ ] Title states the point
- [ ] One key number, with period and `(รอยืนยัน)` if unconfirmed
- [ ] No grid of identical icon cards
- [ ] ≥ 2 overlaps per slide, one light direction
- [ ] Back layer has one strong thing
- [ ] Contrast measured on every coloured panel
- [ ] Footer and photo credit present
