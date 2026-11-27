---
name: ui-craft
description: Use with a platform skill when a task produces a screen or mockup
---

# ui-craft — spacing, type, order and state rules that make a screen or mockup consistent

> **Pre-start gate `ด่านก่อนลงมือ` (every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand fixes color and font; the search finds the structure of this piece). Close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** a good-looking screen comes from **consistency**, not pretty colors: one spacing scale, one font-size scale, one most-important thing per page.
> Consistency alone gives "not wrong", not "wow": a mockup someone will approve needs a visual direction (section 0.1) and must pass the beauty gate `ด่านสวย` (section 9).
> "Don't overuse color" means few colors, not pale ones: the brand color must carry weight across the whole page, in the data and the primary buttons.
> The app frame is neutral: title bar · header bar · toolbar · rail · nav · borders use gray-black lines and icons in the Windows theme style. The brand color lives in the data, primary buttons, small selection bars and the logo. Tint the frame only when the user says so.

## Use when
- Building any user interface (UI), together with a platform skill, not instead of it.
- A screen "looks off" and you cannot say why, or you review a UI someone else made.
- The platform has no dedicated skill yet (TV app · kiosk · smart watch).

Not for: real colors, fonts, components (also chart colors) → `web-app-design` · `windows-app-design` · `mobile-app-design` (this skill sets no colors or fonts, only spacing, size, order and states) · printed documents → `document-design` · slides → `slide-deck`. User flow before drawing → agent `ux-designer` (template: [`references/ux-spec-outputs.md`](references/ux-spec-outputs.md)).

## Steps

### 0 · Before creating a new page, check whether the project already has a look
The project's own look beats the platform skill's starter theme (the `assets/` templates are for projects with no screens yet). **Two exceptions, where you redo section 0.1 instead of copying:** (1) the user or prompt orders a new design, or says the current look is not nice (2) the current look is a mockup that has not passed the beauty gate (section 9; no beauty-gate score recorded in `docs/BUILD-PLAN.md` = not passed). Move the old files to `_to_delete/`, do not delete them. A look that is real delivered code still wins unless there is a new-design order.

Look in: `mockup/**/*.html` · `*.css` · `styles.css` · `theme.*` · `tokens.*` · `tailwind.config.*` · `lib/core/theme.dart` · `*.xaml` · `docs/deck/` · `docs/*.html` · the project README (a line saying which file the look comes from).

**Found** → run `python -I scripts/design_tokens.py <folder found> --out docs/DESIGN.md` (draft of the values the code uses, with the places off the scale; it does not overwrite an existing file), then:
1. Copy the whole structure of the nearest sibling page (same group): `<head>` fonts, top bar, side menu, margins.
2. `<link>` the existing css file; do not copy tokens into a new file. A new file holds only what is unique to the page and uses the existing `var(--…)`. Mockup: a new page = a new `<section>` in the existing `mockup/<code>-mockup.html`, not a new file. Link the css while working; at delivery embed it in `<style>` per the single-file rule of the platform skill.
3. Use existing classes for existing components (button · card · table · pill).
4. Screenshot the old and new page at the same width side by side: background, top bar, heading font and buttons must be indistinguishable.
5. If a value in this skill conflicts with the project's, use the project's and note it under `ตัดสินใจเอง`. Do not restyle old pages unless told to.

**Not found** → use the platform skill's template, then write 1 line in the project README: `หน้าตา: mockup/<code>-mockup.html`.

New project → pick 1 of 6 app characters before the first page: [`references/app-character.md`](references/app-character.md). Customer sends a Figma file → read it through the Figma MCP server, convert variables to tokens, then make the HTML mockup per this section; when to skip Figma → [`references/figma-to-code.md`](references/figma-to-code.md).

### 0.1 · Visual direction, before the first screen of a new project or new design
Full text: [`references/visual-direction.md`](references/visual-direction.md). In short:
1. **1 hero screen**: 1 sentence on the wow moment, and the page shows it (not a settings page or form).
2. **Reference app**: take screenshots of 2–3 official pages into `_to_delete/ref-shots/`, note 5 things that make it look good. Always search live, even with a reference app.
3. **3 directions in parallel** (one new subagent each; cannot call sub-agents → make them yourself one at a time, never a single direction), genuinely different, each with 1 point of boldness. Start from [`design-system`](../design-system/SKILL.md) with `--palette`.
4. **Comparison page** `docs/design/<code>-design-directions.html`.
5. **Choose 1**: ask the user once at the start whether they want to choose; otherwise a new beauty-gate reviewer scores per section 9 and the highest wins, recorded under `## ตัดสินใจเอง`.
6. **Identity**: logo in the title bar, brand color written to `docs/README.md` field `doc-theme`.

Sample content must look real: realistic data, real images per `image-generation`, no gray placeholder boxes, no "ตัวอย่าง" or "Lorem", team notes only in the mockup's control box.

### 1 · Spacing scale: `4 8 12 16 24 32 48 64`
Every padding · margin · gap is a value in this scale, even when the platform skill conflicts, **except values measured from the real system and named in the exception list of `references/scales.md`** (for example Windows: content edge 36 · gap between sections 40). Things that belong together sit closer than things that do not. Card padding ≥ the gap inside. Details → [`references/scales.md`](references/scales.md).

### 2 · Type scale
At most 5 sizes per screen (web: lg 22 · md 15 · base 13 · sm 12 · xs 11) · smallest 11 · 2 weights · lines of 45–75 characters · Thai line-height +0.1. A marketing or landing page without motion uses the type scale and rhythm in [`references/scales.md`](references/scales.md#3--หน้าการตลาดและ-landing-ที่ไม่มี-motion) (with motion → `web-app-design`).

### 3 · Visual order: one screen, one important thing
Ask what the user opened this page to do. That item gets level 1.

| Level | How | How many per page |
|---|---|---|
| 1 | Solid brand color + largest size | **1** |
| 2 | Bold text or light background | 2–3 |
| 3 | Normal text color | Unlimited |
| 4 | Faded text color | Unlimited |

2-second eye test: squint; if 4 things jump out together, there is no order yet. Only one primary button per screen; the rest are outline or text-only. A delete button is a red secondary button, never solid red. Buttons repeated on every row (open · edit · delete) are never solid brand color; 3 alternatives in [`references/states-and-checks.md`](references/states-and-checks.md).

### 4 · Separating sections: one method per depth level
| Method | Use when | Watch out |
|---|---|---|
| Spacing only | Separating groups in the same area | **Always try this first** |
| 1px light line | Tables · lists · dividers | Lighter than you think |
| Background of a different shade | Card on page background | A 2–4% difference is enough |
| Shadow | Things that **really float** · cards on a persuasion page of the soft SaaS look (soft 2-layer shadow) | modal · dropdown · toast only; app pages used all day get no card shadow |

A card sitting still on an app page needs no shadow; a landing page follows the depth language of the chosen look. 3 depth levels are enough: page background → card → floating thing. Use 2–3 corner radius values, and the inside item always has a smaller radius than the outside (card 14 → inner image 8–10). One depth language per project (realistic shadows · paper · clay · torn edges) → [`references/depth-and-flourish.md`](references/depth-and-flourish.md).

### 5 · Color contrast (WCAG 2.2 AA)
Normal text 4.5 : 1 · large text (≥ 24px regular or ≥ 18.7px bold) 3 : 1 · input borders and meaningful icons 3 : 1 · decorative dividers no threshold. Check with browser DevTools; Flutter and native: calculate from the tokens in light and dark mode (formula and test in [`references/states-and-checks.md`](references/states-and-checks.md)). Never: faint gray text "because it looks clean" · color as the only status signal (add an icon or text) · placeholder in place of a label.

### 6 · The five states every screen must have
| State | Must have | Common miss |
|---|---|---|
| **Empty** | Why it is empty + a button for what next | Only "No data" |
| **Loading** | Gray skeleton in the shape of the real thing | Centered spinner |
| **Error** | What happened + what to do + retry button | System error shown raw |
| **Partial** | Loaded parts show at once; the broken part says so only there | Whole page breaks for one widget |
| **Success** | Tell the user, then disappear by itself | A modal needing "OK" |

First-time empty ≠ empty because the search found nothing: different message, different button. Apps reading hardware use the same 5 states (light-meter example in `references/states-and-checks.md`). An error message says what happened, why, and what to do, never a bare `Error 500`. Right: "บันทึกไม่สำเร็จ เพราะเลขที่เอกสารนี้มีอยู่แล้ว ลองเลขอื่น".

On-screen wording (full rules: `human-writing` `references/thai-grammar.md` section 4, level "screen"): pronoun `คุณ` or none, never ท่าน · do not stack ครับ/ค่ะ ท่าน กรุณา in one message (usually none) · buttons start with a verb (บันทึก · ส่ง · ลบรายการนี้), not a bare ตกลง/ยืนยัน.

### 7 · Motion budget
| Type | Time | Easing |
|---|---|---|
| hover · color change | 100–150ms | `ease-out` |
| dropdown · toast | 150–250ms | `ease-out` |
| modal · page change | 250–350ms | `ease-in-out` |

- Over 400ms feels slow. Entering is never faster than leaving. Do not animate something the user is about to press.
- **A moment to smile: 1 per flow**, only when a task succeeds (quote sent · payment passed · full set done), not at loading or hover; ≤ 400ms, never covers the next button or blocks pressing it. Surface flourishes per [`references/depth-and-flourish.md`](references/depth-and-flourish.md).
- Respect `prefers-reduced-motion` (Flutter: if `MediaQuery.disableAnimationsOf(context)` is `true`, skip the animation).
- Do not redraw when the displayed value has not changed: notify the UI only when the value on screen really changes (jittery sensor: change over ~1 %) and update slowly drifting secondary values about once per second (redraws drain the battery, make screen readers repeat, and block test tools).

### 8 · Density: choose once and stay with it
Dense 32–36px (data tables · all-day users) · Normal 40–44px (general apps) · Airy 48–56px (marketing · occasional use). Tap target ≥ 44×44 pt iOS · ≥ 48×48 dp Android, enlarged with padding or a pseudo-element, not a bigger icon. No airy rows mixed into dense.

### 9 · Check the work
1. Render and look (the platform skill says how), then go through the 3 checklists in [`references/states-and-checks.md`](references/states-and-checks.md): correctness (squint · spacing scale · ≤ 5 sizes · 1 solid button · 5 states · contrast · shrink the window) · countable beauty (icons · content ≥ 60 % of the screen · equal row heights · boxes ≤ 3 · hide the mockup's controls) · **beauty gate `ด่านสวย`** (score 7 axes against the reference app image; pass when every axis ≥ 4). Passing the first 2 can still be ugly; a mockup sent for approval must pass the beauty gate.
2. Send the image to a subagent that did not make it, **with the reference app image at the same size**, and ask for the 7-axis score, 2–3 problems per page with CSS-level fixes, no praise, and 1 more answer: **bolder or quieter**, with the single point to fix. Reviewer order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose`; none callable → minimum path in 0.1 step 3. The correctness reviewer (clicks · Functional Requirement (FR) · contrast) and the beauty reviewer are different ones. Public web pages (marketing · landing) always also go to `design-critic` of plugin `graphic-design`; not installed → say so in the report.
3. After fixing, take new screenshots. The number of rounds follows the beauty-gate cap in `references/states-and-checks.md`, in that one place only (sample commands: platform skill, for example `windows-app-design` section 6 and `references/review.md`).
4. The page passed but one piece does not fit → try live values in the browser or make 3 variants for the reviewer: [`references/live-and-variants.md`](references/live-and-variants.md).
5. Multi-page work: get the 3 main pages to pass first, then the rest.
6. The first page of a single-file mockup (`#s-start`) is a table of contents for the reviewer, not an app page: build it with `scripts/mockup-start-page.py` per [`references/mockup-start-page.md`](references/mockup-start-page.md).

### 10 · Anti-patterns
17 prohibitions (relabeling an old mockup as new · starter theme as final look · adding colors to fix "not pretty" · solid buttons on every row · dividers on everything · a shadow under every card · 600ms animation, etc.) are in [`references/states-and-checks.md`](references/states-and-checks.md).

### Do not look AI-made
Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script (with plugin `superuser`, the `ui-scan` hook runs it on every UI file edit; for a live page use `--url`). Every piece also passes eye gate item 3.2 (web pages items 10–14 too), because 0 script findings does not mean pass. If 2 or more AI signs show on one page (gradient buttons · centered hero + 2 pills · 3 equal cards with circle icons · emoji icons · "Welcome back, John" · radius 16px+ everywhere · "AI-powered" badges), fix them first: table in [`references/ai-signs.md`](references/ai-signs.md).

For a web page whose code is HTML/React, also go through the Vercel Web Interface Guidelines, fetched live from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (link only; do not copy its text in).

## Check before done
- Spacing from the scale, at most 5 font sizes, 1 primary button, the 5 states present, contrast passes.
- Rendered and looked at; beauty gate scored by a reviewer who did not make it (mockups).
- `design-gate/no-ai-look` item 3 and eye gate 3.2 done; the work closes with the line `ด่านก่อนลงมือ:`.

## References
- [`references/visual-direction.md`](references/visual-direction.md) — open at section 0.1, before the first screen of a new project or design
- [`references/ai-signs.md`](references/ai-signs.md) — open when checking for AI-made signs
- [`references/scales.md`](references/scales.md) · [`references/states-and-checks.md`](references/states-and-checks.md) · [`references/depth-and-flourish.md`](references/depth-and-flourish.md) — open at the section that points to each
- [`references/app-character.md`](references/app-character.md) · [`references/font-voice.md`](references/font-voice.md) · [`references/web-looks.md`](references/web-looks.md) — open when choosing a direction
- [`references/figma-to-code.md`](references/figma-to-code.md) · [`references/live-and-variants.md`](references/live-and-variants.md) · [`references/mockup-start-page.md`](references/mockup-start-page.md) · [`references/ux-spec-outputs.md`](references/ux-spec-outputs.md) — open when the section points to them
- [`references/sources.md`](references/sources.md) — licences and check dates
