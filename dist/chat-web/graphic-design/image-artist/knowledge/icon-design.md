# skill: icon-design

Use when an app or brand needs icons or a favicon

# icon-design — icons a real designer would make, not shapes drawn by code

> **Gate before starting (every time):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Gate before starting) of `design-gate/design-references` (plugin `superuser`) even when a brand already exists (the brand sets color and font, while the search is for finding this piece's structure) · close the work with a line `ด่านก่อนลงมือ:` (Gate before starting:)

> **One rule:** every kind of icon starts from something a designer already made (a ready-made icon set for screens, an example the user likes for a brand), not an SVG the agent writes stroke by stroke from zero. That gives stiff basic shapes that look AI-made (3 plugin icon directions made this way were all rejected on 2026-10-26).

## Use when
- An app or web screen needs menu, button, or status icons, or mixes many icon styles
- Making an app icon (iOS · Android · Windows) · favicon · plugin icon · pictorial logo mark
- The user says the icons look generic or AI-made
- The user already has an SVG and wants it checked → skip to section 4

Not for: a whole brand set → `brand-kit` · illustrations or photos → `image-generation` · whether a whole screen looks AI-made → `design-gate/no-ai-look`. Icons inside an app screen also use `ui-craft`; a brand system sets color and logo rules (`brand-kit`).

## 1 · Split the job first

| | Screen icon (UI icon) | Brand icon (app icon · favicon · plugin · mark) |
|---|---|---|
| Goal | Read fast, same look across the set | Memorable, its own |
| Start from | A free icon set whose license allows use (section 2) | An example the user likes (section 3) |
| Draw yourself? | Only the missing ones, by that set's rules | Draw or generate new, never SVG stroke by stroke from zero |

Search prototypes first: live search with the project's words per `design-gate/design-references`, type `icon`, then pull colors from the chosen work (stored color library only if live search is impossible).

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


## reference: asset-sets.md

# Designer-made asset sets: pick one and adapt it instead of drawing your own

Use when the user wants a style that code-drawn icons cannot reach (depth · multi-color · 3D · illustration) and there is no image generator or designer. Every row was read from the actual LICENSE file or license page on 2026-10-27 · licenses can change, so open the link and re-check before real use · counts come from `info.json` of the `@iconify-json/<set>` package.

## 1 · Pick by the style the user wants

| Style | Set | License | File · install | Notes |
|---|---|---|---|---|
| Color with depth (layered pieces, gradients) | Fluent UI System Icons, color variant | MIT | SVG, recolorable · `@fluentui/svg-icons` (files `*_color.svg`) or `@iconify-json/fluent-color` | 890 icons · many original colors are the Copilot purple-pink, so change the colors before use · some exist only at 16–24 size |
| Color with depth | IconPark, multi-color · two-tone themes | Apache 2.0 | SVG | 2,658 icons |
| Flat color | Icons8 Flat Color | MIT | SVG | 329 icons |
| 3D | Fluent Emoji 3D | MIT | PNG 256, cannot be recolored · the same icon also comes as Color and Flat SVG | Color variant has 3,126 icons |
| 3D | 3dicons.co | CC0 | (file format not checked yet) | |
| Two-weight line (duotone) | Phosphor | MIT | SVG · `@phosphor-icons/core` | 9,072 icons across 6 weights |
| Line | Lucide · Tabler · Iconoir · Material Symbols | ISC · MIT · MIT · Apache 2.0 | SVG | Screen icons, see [`icon-sets.md`](icon-sets.md) |
| Illustration | Open Peeps · Humaaans · Open Doodles | CC0 | SVG · PNG | |
| Illustration | unDraw | unDraw's own license | SVG, recolorable on the web | No credit needed, but you must not bundle it into a pack for redistribution, build a competing service, or use it to train AI models |
| Emoji | Noto Emoji | Images Apache 2.0 · font OFL 1.1 | SVG · PNG | 3,729 icons |

**Credit required:** Twemoji (images CC BY 4.0) · Streamline free set (CC BY 4.0)

**Not suitable for app icons or logos:** Remix Icon (license v1.0 of Jan 2026, clause 3.3 forbids use even after recoloring or rotating) · OpenMoji (CC BY-SA 4.0, derivative works must carry the same license) · SF Symbols

**Good to know:** MIT · Apache · CC0 · CC BY give no exclusive rights, so others can use the same image. If the user will register a trademark, do not use an image straight from a set (general opinion, not checked against a legal source).

## 2 · Steps to pick and adapt

1. Search the set that matches the style and pick the 2–3 icons closest to the metaphor for each icon · the `@iconify-json/<set>` package gives the whole set's SVGs in `icons.json` and the license name in `info.json`.
2. Download into `_to_delete/`, then place in the real frame and compare on both light and dark backgrounds at 16 · 48 · 128 px.
3. Make it the brand's own: recolor with `scripts/recolor_icon.py --hex "<brand color>"`, which keeps the designer's lightness and shading and rotates only the hue · for a set where each icon needs a different color, run it one icon at a time with that icon's `--hex` · if no icon in the set fits the metaphor, try the next set in the same row and do not draw extra pieces yourself · place the whole set in the same frame · do not cut, notch, or bend the frame's shape.
4. Run `icon_check.py` and open the image yourself · send it to a fresh `design-critic`.
5. Record the set name, version, license, and what you changed in NOTICE or README.

## Sources (read 2026-10-27)

- Fluent UI System Icons — https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE
- Fluent Emoji — https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE
- IconPark — https://github.com/bytedance/IconPark/blob/master/LICENSE
- Icons8 Flat Color — https://github.com/icons8/flat-color-icons/blob/master/LICENSE.md
- Phosphor — https://github.com/phosphor-icons/core/blob/main/LICENSE
- Tabler — https://github.com/tabler/tabler-icons/blob/main/LICENSE
- Iconoir — https://github.com/iconoir-icons/iconoir/blob/main/LICENSE
- Lucide — https://github.com/lucide-icons/lucide/blob/main/LICENSE
- Material Design Icons — https://github.com/google/material-design-icons/blob/master/LICENSE
- 3dicons — https://3dicons.co/
- Open Peeps — https://www.openpeeps.com/ · Humaaans — https://www.humaaans.com/ · Open Doodles — https://www.opendoodles.com/
- unDraw — https://undraw.co/license
- Noto Emoji — https://github.com/googlefonts/noto-emoji/blob/main/LICENSE
- Twemoji — https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS
- Streamline — https://github.com/webalys-hq/streamline-vectors/blob/main/README.md
- Remix Icon — https://github.com/Remix-Design/RemixIcon/blob/master/License
- OpenMoji — https://github.com/hfg-gmuend/openmoji/blob/master/LICENSE.txt · https://openmoji.org/faq/


## reference: category-research.md

# Research the category before designing a brand icon

Designers do not start from a blank page. They first look at what things in the same category look like, what rules they follow, and what has become overused · this file is the first round of research (read 2026-10-26), a starting point only · each job must research its own category further.

## 1 · What to research (every job, takes little time)

| Look up | Example queries or where to look | What you get |
|---|---|---|
| The store or listing page where the icon will sit | Raycast Store · VS Code Marketplace · JetBrains Marketplace · Chrome Web Store · App Store, same category | Size, frame, dark or light background, and how the neighbors beside it look |
| The destination's official rules | That store's guideline page (table in section 3) | The bans that get an icon rejected |
| Icon families with many members that still read as a set | Microsoft, Adobe, Atlassian, JetBrains, Google app suites | How to tie icons into a set (section 2) |
| Redesign articles where the designer is named | "behind the design" + brand name · "new icons" + year | The thinking and the lessons, not just the pictures |
| Styles overused in that category | "AI logo trend" · "<category> icon cliché" | What to avoid (section 4) |

Give the results to the user as links to open themselves. Do not copy other brands' images to keep or put in the work · reading text alone is not enough, so if a screenshot tool exists, open the real page and look before deciding on a style.

## 2 · Ways to tie several icons into a set

| Method | Example | Watch out |
|---|---|---|
| Same shape and surface, different color | Microsoft 365 2025 set (prototype was the Copilot icon · Jon Friedman 2025-10-01) | Color alone is not enough to tell icons apart for color-blind people |
| Same frame, with an initial inside | Adobe Creative Cloud · JetBrains IDEs | Users complain they cannot tell them apart when there are many (Adobe 2020 · JetBrains forum) |
| One color set for every icon | Google Workspace 2020 | Criticized as indistinguishable · redone in 2026 and dropped the forced 4 colors |
| A symbol that tells each product's story, on one shared frame | Atlassian 2017 · Atlassian icon system 2025 | Stroke weight and grid must be kept equal |

Shared lesson: every icon in a set must be distinguishable at 16 px by shape, not by color or letters alone.

## 3 · Rules of the destinations where plugin icons usually go

| Destination | File | Key rules |
|---|---|---|
| Claude Code (`icon` field in `plugin.json`) | Image path inside the plugin · the directory gate accepts PNG JPEG GIF WebP SVG | No size or shape set · Claude Code does not read it, only the directory page uses it |
| Raycast | PNG 512 | Must look good on both dark and light themes (a separate `icon@dark.png` is allowed) · the default starter icon is rejected |
| JetBrains | SVG 40 · artwork within 36 | No pure-text logos · must not resemble another brand · must be clear on both backgrounds |
| VS Code | PNG at least 128 (256 for Retina screens) | No SVG |
| Chrome | PNG 128, real artwork 96 with 16 margin on each side | No border · avoid large drop shadows · face front |

Rules that several sources agree on: readable on both backgrounds · no text · no border or large shadow · keep a transparent margin · equal visual weight across the set · not similar to another brand · one master file exports to every destination (PNG 512 · PNG 128 · SVG 40)

## 4 · Styles that look AI-made (avoid)

| Style | Source of the criticism |
|---|---|
| Purple-blue gradient · starburst · glow | Allen · UX Collective (2024-06) |
| Sparkle ✦ that became a "beta" tag | Josh Clark · Big Medium (2024-09) · Fast Company (2024) |
| Hexagon or swirl · big-eyed robot | Fast Company (2023) |
| Gradient circle with a hole in the middle | Radek Sienkiewicz (2025-04) |

The Claude logo deliberately avoids these styles (DesignRush) · "brain" has no named source yet (ยังไม่ได้ตรวจ — not checked).

## Sources (read 2026-10-26)

- Microsoft Design · Fluid forms, vibrant colors — https://microsoft.design/articles/fluid-forms-vibrant-colors/
- Adobe Design · Behind the design: Adobe's updated app icons — https://adobe.design/ideas/behind-the-design-adobe-s-updated-app-icons
- Creative Bloq · Adobe icon update 2020 — https://www.creativebloq.com/news/adobe-icon-update-2020
- Atlassian · Our bold new brand — https://www.atlassian.com/blog/announcements/our-bold-new-brand
- Atlassian Design · Building Atlassian's new icon system — https://atlassian.design/whats-new/building-atlassians-new-icon-system
- JetBrains · New icons in IntelliJ Platform 2018.2 — https://blog.jetbrains.com/blog/2018/06/26/new-icons-in-intellij-platform-2018-2/
- Google Workspace Updates · Fresh visual identity for app icons (2026-05) — https://workspaceupdates.googleblog.com/2026/05/introducing-fresh-visual-identity-for-Google-Workspace-app-icons.html
- 9to5Google · New Gmail icon (2020) — https://9to5google.com/2020/10/06/new-gmail-icon/
- UX Collective · The way we design AI looks like nostalgia already — https://uxdesign.cc/the-way-we-design-ai-looks-like-nostalgia-already-aa5dfc01d4c7
- Big Medium · Your sparkles are fizzling — https://bigmedium.com/ideas/your-sparkles-are-fizzling.html
- Fast Company · AI boom logo trend — https://www.fastcompany.com/90869029/ai-boom-logo-trend-swirling-hexagon
- Fast Company · How the sparkle emoji took over AI — https://www.fastcompany.com/91030156/how-the-sparkle-emoji-took-over-ai
- VelvetShark (Radek Sienkiewicz) — https://velvetshark.com/ai-company-logos-that-look-like-buttholes
- DesignRush · Claude logo design — https://www.designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference · Claude · Submit a plugin — https://claude.com/docs/plugins/submit
- Raycast · Prepare an extension for the Store — https://developers.raycast.com/basics/prepare-an-extension-for-store
- JetBrains · Plugin icon file — https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html
- JetBrains Marketplace · Best practices for listing (no name-only logos · must not resemble another brand) — https://plugins.jetbrains.com/docs/marketplace/best-practices-for-listing.html
- VS Code · Extension manifest — https://code.visualstudio.com/api/references/extension-manifest
- VS Code · Publishing extensions (icon in package.json must not be SVG) — https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Chrome Web Store · Images — https://developer.chrome.com/docs/webstore/images


## reference: icon-sets.md

# Free icon sets usable in real work

Read from the README and license files in the official repos on 2026-10-26 · licenses can change, so before delivering to a client, open the LICENSE file of the version actually used again.

| Set | License | Count | Grid · stroke | Use in an app | Use for a logo |
|---|---|---|---|---|---|
| [Lucide](https://github.com/lucide-icons/lucide) | ISC | 1,600+ | 24 · stroke 2 · most detailed design rules, usable for drawing missing icons | Yes, keep the copyright notice | Allowed by the license, but others can use the same icon, so it is not distinctive |
| [Tabler](https://github.com/tabler/tabler-icons) | MIT | 6,238 (stroke 5,184 · solid 1,054) | 24 · stroke 2 | Yes | Same as Lucide |
| [Phosphor](https://github.com/phosphor-icons/core) | MIT | about 1,248 | 6 weights, thin to duotone · designed at 16 (not confirmed with the main site) | Yes, good when you want a choice of weights | Same as Lucide |
| [Material Symbols](https://github.com/google/material-design-icons) | Apache 2.0 | 2,500–3,800+ (docs give conflicting numbers) | 24 · variable font adjusts fill · weight · grade · optical size | Yes, no credit required | Yes, except third-party logos included in the set |
| [Heroicons](https://github.com/tailwindlabs/heroicons) | MIT | 316 | 24 stroke · 24 · 20 · 16 solid | Yes, small set | Same as Lucide |
| [Iconoir](https://github.com/iconoir-icons/iconoir) | MIT | 1,383 | 24 | Yes | Same as Lucide |
| [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons) | MIT | Not stated in the repo | regular · filled | Yes, fits Windows apps | Same as Lucide |
| [Remix Icon](https://github.com/Remix-Design/RemixIcon) | Remix Icon License v1.0 (not MIT · changed Jan 2026) | 3,200+ | 24 | Yes, you may adjust color, size, stroke | **Forbidden** even with small edits · you must not distribute or sell it as a set |
| SF Symbols | Apple's agreement | — | — | Only in apps on Apple platforms | **Forbidden** in app icons or logos per the HIG |

## How to choose a set

1. **1 app, 1 set** · draw a missing icon by that set's rules (grid, stroke, corners), starting from the closest icon in the set, and do not mix 2 sets.
2. For a general web or app, start with Lucide or Tabler · use Phosphor when you want several weights · use Material Symbols for an Android app or a Material-style web · use Fluent for a Windows app.
3. For a logo or app icon that must be the brand's own, do not use an icon straight from a set, because others can use the same image · it can serve as a starting point for proportions, but must be modified until it is the brand's own.
4. Record the set name, version, and license in the project's README or NOTICE.


## reference: sources.md

# Sources · icon-design

- All numbers and rules: Material Design 1 · Lucide design principles · Atlassian · Fluent 2 · Apple HIG · Android Developers · Microsoft Learn · Evil Martians · Google Search Central · NN/g — links are in [`specs.md`](specs.md) · read 2026-10-26
- How designers work: Adobe Design "How to design effective icons" (find the metaphor · keep every round) · Sketch "How we redesigned the Sketch icon for Big Sur" (about 50 sketches, down to 2) — read 2026-10-26
- Icon set licenses: README and LICENSE files in the official repos · [`icon-sets.md`](icon-sets.md)
- No named designer's article on icons that look AI-made was found · the rules in section 3 of SKILL.md come from the round that actually failed on 2026-10-26 (not checked against research)

## Real example (red round · before the skill existed)

**Task 2026-10-26:** icons for 6 plugins, with 3 directions for the user to choose from · **What was done:** 3 agents each wrote SVG stroke by stroke for one direction (geometric · Thai everyday objects · initials) with no examples from the user · all passed `slop_scan` and `icon_check` · **Result:** the user rejected all 3 directions, "not nice at all" · **Lesson:** missing examples the user likes, and the tool used could draw only basic shapes · automatic checkers catch only technical faults


## reference: specs.md

# Icon numbers and sizes by platform

Every row's source was opened and read on 2026-10-26 · numbers change with platform versions, so open the link and re-check before real delivery.

## Screen icons (UI icon)

| Topic | Value | Source |
|---|---|---|
| Display size | 24 · dense 20 · Atlassian uses 16 | Material 1 · Atlassian |
| Drawing area (live area) | 20×20 inside 24 (2 margin on each side) · Lucide keeps at least 1 | Material 1 · Lucide |
| Keyline shapes on the 24 grid | circle 20 · square 18 · portrait 16×20 · landscape 20×16 · the circle is larger than the square because the eye sees a circle as smaller than it is | Material 1 |
| Stroke weight | 2 across the set · complex pieces may drop to 1.5 · Atlassian uses 1.5 on a 16 grid | Material 1 · Lucide · Atlassian |
| Corners | outer corners rounded with radius 2 (shapes smaller than 8 use 1) · inner corners sharp · where more than 2 strokes meet, keep the corner sharp | Lucide · Material 1 · Atlassian |
| Gaps | at least 2 between pieces · a gap inside a shape must fit a circle of width 2 | Lucide |
| Coordinates | pixel-aligned (on the 24 grid, land on .0 or .5 when a 2-thick stroke is centered on its line) but do not trade this against recognition or balance | Lucide · Material 1 |
| Priority order | clarity → visual balance → consistency with the set | Lucide |
| Touch area | icon 24 → touch target 48 · 20 → 40 | Material 1 |
| Text label | Put an always-visible text label beside the icon, even a standard icon · the only icons everyone worldwide understands the same way are home · print · search | NN/g (2014-07-27) |
| metaphor | Name it by the picture, not by the function ("Shield, not security") · the modifier sits at the bottom right · check cultural meaning | Fluent 2 |
| Apple | 9 weights and 3 scales matched to the neighboring text · a custom symbol starts from the template of a nearby symbol · do not use SF Symbols in app icons or logos | HIG SF Symbols |

## App icons, logos, favicons

| Destination | File and size | Bans | Source |
|---|---|---|---|
| iOS · iPadOS · macOS | 1024×1024 square, do not cut the corners yourself, the system applies the mask · solid fill to the edge · variants default · dark · clear · tinted | Do not add your own shadow, bevel, or glow · avoid text, thin strokes, sharp corners | HIG App icons (last updated 2026-06-08) |
| watchOS · visionOS | 1088 · 1024 · the system applies a circular mask | watchOS: avoid a pure black background | Same as above |
| Android adaptive | each layer 108×108dp · main content inside the central 66×66dp (minimum 48) · must have a monochrome layer for themed icons | Do not put a mask or shadow in the file, the OEM does the cutting | Android Developers |
| Windows | at least 16 · 24 · 32 · 48 · 256 · `targetsize-N` files, unplated, for both dark and light themes, otherwise the system adds a backplate | — | Microsoft Learn (updated 2026-08-05) |
| Web | `favicon.ico` 32 (add 16 if 32 scaled down looks blurry) · `icon.svg` supporting dark theme with a media query · `apple-touch-icon.png` 180 with padding and a background color · `icon-192.png` · `icon-512.png` · maskable 512 with the artwork inside the central 409 | Google Search does not accept SVG alone, it needs PNG or ICO · minimum 8×8, recommended over 48 | Evil Martians (Andrey Sitnik · 2026-01-21) · Google Search Central |
| Claude Code plugin | `icon` field in `plugin.json` points to an image file in the plugin, such as `./logo.png` · used only on the listing page at `claude.ai/directory/manage`, Claude Code does not read it | Docs set no size, shape, or theme (checked 2026-10-26) · the directory gate accepts PNG JPEG GIF WebP SVG · make an SVG master, then export PNG 512 up front, which also works for Raycast | code.claude.com plugins-reference · publish |

## Sources

- Material Design 1 · Icons — https://m1.material.io/style/icons.html (M3 could not be read because the page needs JavaScript to run, so the numbers come from M1)
- Lucide · Design principles — https://lucide.dev/contribute/icons/design-principles
- Atlassian · Iconography — https://atlassian.design/foundations/iconography/
- Microsoft Fluent 2 · Iconography — https://fluent2.microsoft.design/iconography
- Apple HIG · SF Symbols — https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- Apple HIG · App icons — https://developer.apple.com/design/human-interface-guidelines/app-icons
- Android · Adaptive icons — https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- Microsoft Learn · Construct your Windows app's icon — https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction
- Evil Martians · How to favicon — https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- Google Search Central · Favicon — https://developers.google.com/search/docs/appearance/favicon-in-search
- NN/g · Icon usability — https://www.nngroup.com/articles/icon-usability/
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference
