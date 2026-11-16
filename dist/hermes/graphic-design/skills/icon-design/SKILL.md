---
name: icon-design
description: Use when an app or brand needs icons or a favicon
---

# icon-design — icons a real designer would make, not shapes drawn by code

> **Gate before starting (every time):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Gate before starting) of `design-references` (plugin `superuser`) even when a brand already exists (the brand sets color and font, while the search is for finding this piece's structure) · close the work with a line `ด่านก่อนลงมือ:` (Gate before starting:)

> **One rule:** every kind of icon starts from something a designer already made (a ready-made icon set for screens, an example the user likes for a brand), not an SVG the agent writes stroke by stroke from zero. That gives stiff basic shapes that look AI-made (3 plugin icon directions made this way were all rejected on 2026-10-26).

## Use when
- An app or web screen needs menu, button, or status icons, or mixes many icon styles
- Making an app icon (iOS · Android · Windows) · favicon · plugin icon · pictorial logo mark
- The user says the icons look generic or AI-made
- The user already has an SVG and wants it checked → skip to section 4

Not for: a whole brand set → `brand-kit` · illustrations or photos → `image-generation` · whether a whole screen looks AI-made → `no-ai-look`. Icons inside an app screen also use `ui-craft`; a brand system sets color and logo rules (`brand-kit`).

## 1 · Split the job first

| | Screen icon (UI icon) | Brand icon (app icon · favicon · plugin · mark) |
|---|---|---|
| Goal | Read fast, same look across the set | Memorable, its own |
| Start from | A free icon set whose license allows use (section 2) | An example the user likes (section 3) |
| Draw yourself? | Only the missing ones, by that set's rules | Draw or generate new, never SVG stroke by stroke from zero |

Search prototypes first: live search with the project's words per `design-references`, type `icon`, then pull colors from the chosen work (stored color library only if live search is impossible).

## 2 · Screen icons: one set across the whole app

1. Pick 1 set from [`icon-sets.md`](references/icon-sets.md) by platform (general web Lucide or Tabler · Android Material Symbols · Windows Fluent). Never mix 2 sets. If the user names no platform, use Lucide and say why, without stopping to ask.
2. List the icons needed, then find names in the set. Name by the picture, not the function (Fluent: "Shield, not security").
3. For an icon not in the set: take the closest and edit it by that set's grid, stroke, corners and gaps (numbers in [`specs.md`](references/specs.md)). First ask whether the icon is needed; a text label alone may be clearer.
4. Put an always-visible text label beside the icon, except home · print · search (NN/g).
5. Record set name, version and license in README or NOTICE.

## 3 · Brand icons: research the category, ask for examples, then sketch

1. **Research the category yourself before asking the user**, per [`category-research.md`](references/category-research.md), then sum up 3–4 directions with 2 real examples each, with links. Proposing a direction from gut feeling is guessing the user's taste.
   - Where the icon will sit and what its neighbours in that store look like. A store page that needs JavaScript: capture with Playwright if available, otherwise say you have not seen the real picture.
   - The destination's official rules, and how icon families tie together as a set.
   - Styles overused in the category. A direction that separates at 16 px by color or letters alone may be offered, with a warning.
2. **Ask for 2–3 examples the user likes** (anyone's app icon or logo) and what they like about them. If the user already chose a step-1 direction, or names real work ("like the new Microsoft icons"), that counts; do not ask again. With no examples, offer the 3–4 researched directions with the app name and a store or web link; never copy other brands' images into the work. Ask everything at once with `AskUserQuestion` (an agent without it writes numbered items to answer by number).
   - In this round also send 2–3 metaphors per icon as words, and the file sizes and safe zone of the destination (iOS 1024 · Android 108dp with content inside 66dp, per `specs.md`).
   - **User says "just make it":** still do not draw. Ask one multiple-choice question on which step-1 direction they like, then end the round. You may send only the choices and metaphors as words, tagged `(รอยืนยัน)` that there is no example yet, and no SVG.
3. **Find 10 or more metaphors as words; do not draw yet.** Start from what the user does with the product; mix familiar things, avoid tourist clichés; cut to 3 that work without explanation (an outsider guesses within 5 seconds).
4. **Choose tools by what is on the machine** (check, do not assume):
   - Usable AI image generator → generate from a brief that attaches the user's examples and researched directions per `image-generation`, then have a person or vector program convert to lines.
   - Vector program (Inkscape · Figma via MCP) → sketch on a 24 or 64 grid with keyline shapes and real boolean operations.
   - Only SVG code, user's examples flat and plain (letters · geometric shapes · single solid color) → start from proportions of a modifiable-license icon set (not Remix or SF Symbols), modify until it is its own, and tell the user good brand work should be refined by a designer.
   - Only SVG code, user wants depth, multi-color, 3D or illustration → do not fake it with shadows or gradients on flat lines (gave a plastic look the user disliked). Pick a designer-made set from [`asset-sets.md`](references/asset-sets.md) and adapt it by the steps there (recolor with `scripts/recolor_icon.py`). If no set fits, say from the start that an image generator or designer is needed; do not try many drawing rounds. An icon is not always mandatory (for example a Claude Code plugin).
5. Sketch 3 metaphors; each must pass: readable at 16 px · no cut, notch or bend in the icon's frame shape (stores cut the shape themselves; a pre-cut one looks chipped; notches in the symbol are fine; if the user confirms after hearing the reason once, follow the user) · no text in app icons (Apple) · no own shadow, bevel or glow on app icons · content inside the destination's safe zone.
6. Let the user pick 1 from a comparison page, then make the files at every size per `specs.md`. A reviewer (`design-critic`) suggestion that changes the look with no real work behind it: ask the user before applying.

## 4 · Check before sending

```bash
python scripts/icon_check.py <ไฟล์.svg ...> --out _to_delete/icon-check --brand "#สีแบรนด์"
```

It checks a square viewBox · no text or bitmap images in the file · equal stroke-width across the set · coordinates on the grid, then builds a comparison page at 16 · 24 · 32 · 48 · 128 on white, dark and the brand color, with a blurred image (an icon that is a denser dark blob than its neighbours has too much detail). **Passing does not mean nice**: open the image yourself and send a fresh `design-critic` (answer in at most 10 lines).

- [ ] Screen icons from one set, license recorded · brand icons have category research with links and the user's examples noted
- [ ] No AI-looking direction (purple gradient · sparkle · rotating hexagon · robot · `category-research.md` section 4) · every icon distinguishable at 16 px by shape
- [ ] Looked at the real image at 16 px on 3 backgrounds · in the blurred image no icon is clearly heavier than its neighbours
- [ ] Clarity before balance, balance before sameness across the set (Lucide)
- [ ] Destination files complete per `specs.md` (iOS 1024 uncut corners · Android 108dp with content inside 66 · web ICO 32 + SVG + 180 + 192 + 512)
- [ ] Remix Icon or SF Symbols not used for a logo · no other brand's logo used
- [ ] Icon frame is full, no cut or notch (unless the user confirmed) · a picked-and-adapted set has name, version and license in NOTICE

## References
- [`references/specs.md`](references/specs.md) — open for numbers on every platform (sizes, safe zones, grids, stroke).
- [`references/icon-sets.md`](references/icon-sets.md) — open when choosing a free icon set and checking its license.
- [`references/asset-sets.md`](references/asset-sets.md) — open when the user wants depth, 3D or illustrated icons.
- [`references/category-research.md`](references/category-research.md) — open for brand-icon category research (step 3.1).
- [`references/sources.md`](references/sources.md) — sources with check dates, and the failed 2026-10-26 round.
