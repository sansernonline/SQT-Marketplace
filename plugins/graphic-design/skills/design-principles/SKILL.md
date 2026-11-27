---
name: design-principles
description: Use before any logo, video, banner, icon or image job to know what good looks like
---

# design-principles — what good looks like, per medium

> **One rule:** read the principle of the medium before you make anything, and judge the finished piece against it. A principle says what good looks like and why. It has no step order and no "who does it": steps live in the playbook, how-to lives in the skills.

## 3 layers, one job each

| Layer | Answers | Who reads it | Where |
|---|---|---|---|
| **หลักคิด** (principles) | What is good, and why? | everyone, maker and critic | general: superuser `design-gate/parts/design-method/guide.md` (12 steps) · per medium: the table below |
| **skill** | How do I make this piece right? (rules, numbers, scripts) | the agent doing the piece | the skill named in the table |
| **playbook** | In what order, who does each step, when is it done? | the team lead | `superuser/references/playbook-*.md` of this plugin |

How to tell which layer a sentence belongs to:
- a line with `ใคร:` → playbook only;
- a line with a number or a working rule (24 px · 4.5:1 · 3 seconds) → skill, unless the number is the principle itself and cites its source;
- a line that says why something is good → principle.

A playbook never repeats how-to; it links to the skill. A skill never says who does it; it may end with 1 line "whole job → playbook `<name>`".

## Medium → principle → skills → playbook

| Medium | Principle file | Main skills | Playbook |
|---|---|---|---|
| Logo · wordmark · brand mark | [`design-by-type/references/logo.md`](../design-by-type/references/logo.md) (Beauty rules) + [`meaning-first.md`](../design-by-type/references/meaning-first.md) | `design-by-type` · `brand-kit` · `icon-design` | `design` · `brand-setup` |
| Poster · flyer · key visual | [`design-by-type/references/poster.md`](../design-by-type/references/poster.md) | `design-by-type` · `print-ready-files` | `design` |
| Banner · social post · ad | [`design-by-type/references/banner.md`](../design-by-type/references/banner.md) | `banner-design` · `social-formats` · `copy-claims-check` | `design` · `campaign` |
| Word/PDF cover · slide deck | [`document-cover.md`](../design-by-type/references/document-cover.md) · [`slides.md`](../design-by-type/references/slides.md) | `design-by-type` · `style-consistency` | `design` |
| Icons · favicon · app icon | [`references/icon.md`](references/icon.md) | `icon-design` | `design` |
| Short video · Reels · TikTok · ads | [`references/video.md`](references/video.md) | `video-script-to-clip` · `video-editing` · `subtitles-th` · `narration-th` · `motion-basics` | `video` |
| Motion graphics · animated logo | `motion-basics` section "The 12 principles" | `motion-basics` | `video` |
| YouTube thumbnail | [`references/thumbnail.md`](references/thumbnail.md) | `youtube-thumbnail` | `image-series` |
| Product images (Shopee · Lazada · TikTok Shop) | [`references/product-images.md`](references/product-images.md) | `marketplace-product-images` · `image-editing-brief` | `image-series` |
| LINE stickers · rich menu | [`references/line.md`](references/line.md) | `line-sticker` · `line-richmenu` | `image-series` |
| A set of AI images | general method steps 5, 7, 8 | `brief-to-image` · `style-consistency` · `image-generation` | `image-series` |
| A brand kit | general method + logo principle | `brand-kit` | `brand-setup` |

Every medium also follows the general method (`design-method`): the 7-field `เนื้อหา:` brief first, live references, 3 directions that differ, one language per piece, real-use test, a fresh critic.

## Adding a medium

1. Write `references/<medium>.md` in the format of the existing files: `งานดีคืออะไร` (6–8 principles, each with why + how to check by eye) · `พลาดบ่อย` · `ใช้คู่กับ` · sources.
2. Each principle needs at least 3 reliable sources that agree; drop it otherwise.
3. Add 1 row to the table above.

## Check before done

- The principle file of the medium was opened before making, and the critic judged against it
- No step order or `ใคร:` was added to a principle file; no how-to was copied into a playbook
