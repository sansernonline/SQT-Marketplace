---
name: design-principles
description: Use before a logo, video, banner, icon or image job to judge good
---

# design-principles — what good looks like, per medium

> **One rule:** read the principle of the medium before you make anything, and judge the finished piece against it. A principle says what good looks like and why. It has no step order and no "who does it": steps live in the playbook, how-to lives in the skills.

The same 3 layers apply to every plugin; the shared table and the principles for every job are in `superuser:work-principles`.

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
| Banner · social post · ad | [`design-by-type/references/banner.md`](../design-by-type/references/banner.md) | `design-by-type` · `campaign-set` · `copy-claims-check` | `design` · `campaign` |
| Word/PDF cover · slide deck | [`document-cover.md`](../design-by-type/references/document-cover.md) · [`slides.md`](../design-by-type/references/slides.md) | `design-by-type` · `brand-kit` | `design` |
| Icons · favicon · app icon | [`references/icon.md`](references/icon.md) | `icon-design` | `design` |
| Short video · Reels · TikTok · ads | [`references/video.md`](references/video.md) | `video-script` · `video-editing` · `narration-th`| `video` |
| Long video (tutorial · review · interview · narrated presentation) | [`references/long-video.md`](references/long-video.md) | `video-script` · `video-editing` · `narration-th` | `video` |
| Audio (sonic logo · jingle · voice-over · podcast) | [`references/audio.md`](references/audio.md) | `narration-th` · `video-script` · `video-editing` · `brand-kit` | `video` · `brand-setup` |
| Motion graphics · animated logo | [`video-editing/references/motion-twelve-principles.md`](../video-editing/references/motion-twelve-principles.md) | `video-editing` | `video` |
| YouTube thumbnail | [`references/thumbnail.md`](references/thumbnail.md) | `design-by-type` | `image-series` |
| Product images (Shopee · Lazada · TikTok Shop) | [`references/product-images.md`](references/product-images.md) | `marketplace-product-images` · `image-generation` | `image-series` |
| LINE stickers · rich menu | [`references/line.md`](references/line.md) | `line-design`| `image-series` |
| A set of AI images | general method steps 5, 7, 8 | `image-generation` · `brand-kit`| `image-series` |
| A brand kit · tidying brand files | general method + logo principle | `brand-kit` (`references/file-organize.md` for files) | `brand-setup` · `asset-cleanup` |

Every medium also follows the general method (`design-method`): the 7-field `เนื้อหา:` brief first, live references, 3 directions that differ, one language per piece, real-use test, a fresh critic. Before any piece ships, the critic checks it with `design-review` against the medium's principle file.

## Adding a medium

1. Write `references/<medium>.md` in the format of the existing files: `งานดีคืออะไร` (6–8 principles, each with why + how to check by eye) · `พลาดบ่อย` · `ใช้คู่กับ` · sources.
2. Each principle needs at least 3 reliable sources that agree; drop it otherwise.
3. Add 1 row to the table above.

## Check before done

- The principle file of the medium was opened before making, and the critic judged against it
- No step order or `ใคร:` was added to a principle file; no how-to was copied into a playbook
