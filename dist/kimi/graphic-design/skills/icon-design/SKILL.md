---
name: icon-design
description: Use when an app or brand needs icons or a favicon
---

# icon-design — icons a real designer would make, not shapes drawn by code

> **Gate before starting (every time):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Gate before starting) of `design-references` (plugin `superuser`) even when a brand already exists (the brand sets color and font, while the search is for finding this piece's structure) · close the work with a line `ด่านก่อนลงมือ:` (Gate before starting:)

Lives in plugin `graphic-design` · write wording per `human-writing` · numbers for every platform are in [`references/specs.md`](references/specs.md) · free icon sets and licenses are in [`references/icon-sets.md`](references/icon-sets.md) · sets with depth, 3D, and illustrations that can be picked and adapted are in [`references/asset-sets.md`](references/asset-sets.md)

> **One rule:** every kind of icon starts from something a designer already made (a ready-made icon set for screens, an example the user likes for a brand), not an SVG the agent writes stroke by stroke from zero, because that gives only stiff basic shapes that look AI-made (3 plugin icon directions made this way were all rejected on 2026-10-26)

## Use when

- An app or web screen needs menu, button, or status icons, or has a mix of many icon styles
- You must make an app icon (iOS · Android · Windows) · favicon · plugin icon · pictorial logo mark
- The user says the icons are not nice, look generic, or look AI-made
- The user already has an SVG file and wants it checked → skip to section 4

Do not use when: making a whole brand set (color, font, logo rules) → `brand-kit` · illustrations or photos → `image-generation` · checking whether a whole screen looks AI-made → `no-ai-look`

## Use something else instead or together

| Situation | Use | Reason |
|---|---|---|
| Starting any icon sketch | `design-references` (plugin `superuser`) | **Search prototypes first:** search live with the project's words per `design-references` (plugin `superuser`), type `icon`, then pull colors from the chosen work · the stored color library is for when a live search is not possible |
| The icon is inside a brand system | `brand-kit` | Colors and logo-use rules come from there, this skill does only the icon itself |
| Icons in an app screen | `ui-craft` of software-development (if installed) | Button size, spacing, and screen tokens live there |
| A person must choose among several directions | `parallel-attempts-pick-best` step 0 | There must be an example the user likes before every competition |
| Checking the icon before sending | `design-critic` agent · `design-review` | Gives fresh eyes that did not do this work |

## 1 · Split the job first: screen icon or brand icon

| | Screen icon (UI icon) | Brand icon (app icon · favicon · plugin · mark) |
|---|---|---|
| Goal | Read fast, look the same across the set, do not steal attention | Memorable, its own, not a repeat of others |
| Start from | A free icon set whose license allows use (section 2) | An example the user likes (section 3) |
| Draw yourself? | Draw only the missing ones, by that set's rules | Draw or generate new, but do not write SVG stroke by stroke from zero |

## 2 · Screen icons: use one set across the whole app

1. Pick 1 set from [`icon-sets.md`](references/icon-sets.md) by platform (general web Lucide or Tabler · Android Material Symbols · Windows Fluent) · never mix 2 sets · if the user does not name a platform, use Lucide and say why you chose it, without stopping to ask (switching sets later is easy)
2. List the icons needed, then find the names in the set · name by the picture, not by the function (Fluent: "Shield, not security")
3. For an icon not in the set: take the closest one and edit it by that set's grid, stroke, corners, and gaps (numbers in `specs.md`) · first ask whether this icon is really needed, because a text label alone may be clearer
4. Put an always-visible text label beside the icon, except home · print · search (NN/g)
5. Record the set name, version, and license in README or NOTICE

## 3 · Brand icons: research the category, then ask for examples, then sketch

1. **Research the category yourself before asking the user, the way a designer does,** following [`category-research.md`](references/category-research.md), then sum up as 3–4 directions, 2 real examples per direction with links · proposing a direction from gut feeling without researching = guessing the user's taste for them
   - Where will the icon sit, and what do the neighbors in that store look like · for a store page that needs JavaScript to run, capture it with Playwright if available, and if not, say you have not seen the real picture
   - The destination's official rules, and how icon families with many members that read as a set tie together
   - Styles overused in that category · a direction that separates at 16 px by color or letters alone may be offered, but attach a warning
2. **Ask for 2–3 examples the user likes** (anyone's app icon or logo) and ask what they like about them · if the user already chose a direction from step 1, or names real work they like, such as "like the new Microsoft icons", that counts as having examples, so do not ask again · with no examples, choose from the 3–4 directions researched in step 1, sending the app name and a link to the app store or web page, and do not copy other brands' images into the work · ask everything at once with `AskUserQuestion` (an agent without this tool writes numbered items to answer by number)
   - In this first round, also send the metaphors you thought of, as words, 2–3 per icon, so the user sees the direction before answering
   - In the same message, state the file sizes and safe zone of the requested destination (for example iOS 1024 · Android 108dp with content inside 66dp per `specs.md`) so the user knows which files they will get
   - **The user orders "just make it" and does not want to answer:** still do not draw · ask one multiple-choice question on which direction from step 1 they like, then end that round · you may send only the choices as words and the metaphors you thought of (step 3), tagged `(รอยืนยัน)` (awaiting confirmation) that there is no example from the user yet, and no SVG
3. **Find 10 or more metaphors as words, do not draw yet.** Start from what the user does with the product · mix familiar things, do not use familiar things in a new meaning · avoid tourist clichés · cut down to 3 that communicate without explanation (test: can an outsider guess within 5 seconds?)
4. **Choose tools by what is on the machine** (check first, do not assume):

   | Have | What to do |
   |---|---|
   | A usable AI image generator | Generate from a brief that attaches the user's examples and the researched directions, per `image-generation`, then have a person or a vector program convert it to lines |
   | A vector program (Inkscape · Figma via MCP) | Sketch on a 24 or 64 grid, use keyline shapes, and combine shapes with real boolean operations |
   | Only SVG code, and the user's examples are flat and plain (letters · geometric shapes · single solid color) | Use proportions from an icon set whose license allows modification (not Remix or SF Symbols) as the starting point, then modify until it is its own · tell the user plainly that good brand work should be refined by a designer |
   | Only SVG code, but the user wants depth, multi-color, 3D, or illustration | Do not add shadows or gradients to flat lines as a substitute (tried 2026-10-27, it gave a plastic look the user disliked) · pick a set a designer made in that style from [`asset-sets.md`](references/asset-sets.md) and adapt it to the brand by the steps in that file (recolor with `scripts/recolor_icon.py`) · if no set fits, say from the start that an image generator or a designer is needed, and do not try drawing in many rounds · an icon is not always mandatory (for example a Claude Code plugin) |
5. Sketch 3 metaphors · each must pass: readable at 16 px · do not cut, notch, or bend the icon's frame shape (stores and systems cut the shape themselves, and a pre-cut one looks chipped, the user rejected this 2026-10-27), and let the set feel come from color, symbol, and stroke weight · this rule applies to the frame only, notches in the symbol itself are fine · if the current user confirms they will notch the frame after hearing the reason once, follow the user · no text in app icons (Apple) · do not add your own shadow, bevel, or glow to app icons · content inside the destination's safe zone
6. Let the user pick 1 from a comparison page, then make the files at every size per `specs.md`
   - A suggestion from the reviewer (`design-critic`) that changes the look and has no real work backing it: ask the user before applying, and do not accept it yourself and recommend onward

## Real example (red round · before this skill existed)

**Task 2026-10-26:** icons for 6 plugins, with 3 directions for the user to choose from · **What was done:** 3 agents each wrote SVG stroke by stroke for one direction (geometric · Thai everyday objects · initials) with no examples from the user · all passed `slop_scan` and `icon_check` · **Result:** the user rejected all 3 directions, "not nice at all" · **Lesson:** missing examples the user likes, and the tool used could draw only basic shapes · automatic checkers catch only technical faults

## 4 · Check before sending

```bash
python scripts/icon_check.py <ไฟล์.svg ...> --out _to_delete/icon-check --brand "#สีแบรนด์"
```

The script checks a square viewBox · no text or bitmap images in the file · equal stroke-width across the set · coordinates on the grid, then builds a comparison page at every size (16 · 24 · 32 · 48 · 128) on white, dark, and the brand color, with a blurred image (Lucide's blur test: an icon that is a denser dark blob than its neighbors has too much detail) · **passing the check does not mean it is nice** the icons the user rejected on 2026-10-26 also passed · always open the image yourself and send a fresh `design-critic` to look (answer in at most 10 lines)

- [ ] Screen icons come from one set, license recorded · brand icons have category research results with links, and the user's examples noted
- [ ] No direction that looks AI-made (purple gradient · sparkle · rotating hexagon · robot · `category-research.md` section 4) · every icon in the set is distinguishable at 16 px by shape
- [ ] Looked at the real image at 16 px on 3 backgrounds · in the blurred image no icon is clearly heavier than its neighbors
- [ ] Clarity before balance, balance before sameness across the set (Lucide)
- [ ] Destination files complete in sizes and safe zones per `specs.md` (iOS 1024 uncut corners · Android 108dp with content inside 66 · web ICO 32 + SVG + 180 + 192 + 512)
- [ ] Remix Icon or SF Symbols not used for a logo · no other brand's logo used
- [ ] The icon frame is full, with no cut or notch (unless the user confirmed after hearing the reason) · a picked-and-adapted set has its set name, version, and license in NOTICE

## Sources

- All numbers and rules: Material Design 1 · Lucide design principles · Atlassian · Fluent 2 · Apple HIG · Android Developers · Microsoft Learn · Evil Martians · Google Search Central · NN/g — links are in [`references/specs.md`](references/specs.md) · read 2026-10-26
- How designers work: Adobe Design "How to design effective icons" (find the metaphor · keep every round) · Sketch "How we redesigned the Sketch icon for Big Sur" (about 50 sketches, down to 2) — read 2026-10-26
- Icon set licenses: README and LICENSE files in the official repos · [`references/icon-sets.md`](references/icon-sets.md)
- No named designer's article on icons that look AI-made was found · the rules in section 3 come from the round that actually failed today (not checked against research)
