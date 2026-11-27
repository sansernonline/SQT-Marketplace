---
name: line-design
description: Use when a LINE OA needs a rich menu or stickers that pass file limits
---

# LINE Design

Two jobs, one skill. Pick the body by the job, open it, and follow it in full. Both bodies start with a pre-work gate: read the theme, search live references, 3 different directions, check `design-gate/no-ai-look`, close with the line `ด่านก่อนลงมือ:`.

## Parts

| When | Open |
|---|---|
| LINE Official Account (OA) rich menu: image, JSON, upload, seasonal swap | [references/rich-menu.md](references/rich-menu.md) |
| LINE stickers (static, animated) or emoji for Creators Market or a shop | [references/sticker.md](references/sticker.md) |

Not for: OA setup, chatbot, broadcast → `line-oa` (plugin `e-commerce`, if installed) · print stickers → `print-ready-files` · post images → `campaign-set`.

## Hard rules: rich menu

- Image JPEG or PNG, full 2500×1686 or compact 2500×843, file ≤ 1 MB; ≤ 20 tap areas; `chatBarText` ≤ 14 characters
- 6 clear buttons beat 12 tiny ones; Thai text ≥ ~60 px tall; "ติดต่อเจ้าหน้าที่" always present
- Run `python scripts/richmenu_check.py menu.json menu.png` (`--self-test`) and the API `validate` call before creating
- Ask the user's approval before set-default and before any delete; test on one user first, then iOS and Android
- The channel token comes from an environment variable only; never in a file, a log or the reply

## Hard rules: sticker and emoji

- Static ≤ 370×320 px (counts 8, 16, 24, 32, 40) · animated APNG ≤ 320×270, ≤ 4 s, 5–20 frames, 1–4 loops · emoji 180×180 · each file ≤ 1 MB · transparent PNG, even width and height
- Run `python scripts/sticker_check.py <folder> --kind static|animated|emoji` before every upload; the limits were checked 2026-11-10, re-check by 2027-05-10
- 1 feeling and 1 short Thai phrase per sticker; test on white and dark backgrounds; same character across the set (`brand-kit`)
- Never promise approval or a revenue share: the review is LINE's, mark the share `(รอยืนยัน)` and point to creator.line.me
- Uploading to a Creators Market account or accepting terms needs the owner's own yes

## Related

`brand-kit` · `image-generation` · `campaign-set` · `design-review` · `design-gate/no-ai-look`
