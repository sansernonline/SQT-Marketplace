# skill: ui-craft

Use when a task produces a screen or mockup for web, phone or Windows

# ui-craft — spacing, type, order and state rules that make a screen or mockup consistent

> **Pre-start gate `ด่านก่อนลงมือ` (every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand fixes color and font; the search finds the structure of this piece). Close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** a good-looking screen comes from **consistency**, not pretty colors: one spacing scale, one font-size scale, one most-important thing per page.
> Consistency alone gives "not wrong", not "wow": a mockup someone will approve needs a visual direction (section 0.1) and must pass the beauty gate `ด่านสวย` (section 9).
> "Don't overuse color" means few colors, not pale ones: the brand color must carry weight across the whole page, in the data and the primary buttons.
> The app frame is neutral: title bar · header bar · toolbar · rail · nav · borders use gray-black lines and icons in the Windows theme style. The brand color lives in the data, primary buttons, small selection bars and the logo. Tint the frame only when the user says so.

## Use when
- Building any user interface (UI). Open the platform part below too: it holds the real colors, fonts, components and starter templates.
- A screen "looks off" and you cannot say why, or you review a UI someone else made.
- The platform has no part yet (TV app · kiosk · smart watch).

| Platform | Open |
|---|---|
| Web app, dashboard, admin, SaaS, landing or scroll-motion site | [`parts/web-app-design/guide.md`](parts/web-app-design/guide.md) |
| Phone app (PWA · React Native · Flutter) | [`parts/mobile-app-design/guide.md`](parts/mobile-app-design/guide.md) |
| Native-looking Windows 11 app (WinUI 3 · MAUI · Avalonia) | [`parts/windows-app-design/guide.md`](parts/windows-app-design/guide.md) |

Real colors, fonts, components (also chart colors) live in the platform parts above; this page sets only spacing, size, order and states. Not for: · printed documents → `document-design` · slides → `slide-deck`. User flow before drawing → agent `ux-designer` (template: [`references/ux-spec-outputs.md`](references/ux-spec-outputs.md)).

## Steps

### 0 · Before creating a new page, check whether the project already has a look
The project's own look beats the platform part's starter theme (the `assets/` templates are for projects with no screens yet). **Two exceptions, where you redo section 0.1 instead of copying:** (1) the user or prompt orders a new design, or says the current look is not nice (2) the current look is a mockup that has not passed the beauty gate (section 9; no beauty-gate score recorded in `docs/BUILD-PLAN.md` = not passed). Move the old files to `_to_delete/`, do not delete them. A look that is real delivered code still wins unless there is a new-design order.

Look in: `mockup/**/*.html` · `*.css` · `styles.css` · `theme.*` · `tokens.*` · `tailwind.config.*` · `lib/core/theme.dart` · `*.xaml` · `docs/deck/` · `docs/*.html` · the project README (a line saying which file the look comes from).

**Found** → run `python -I scripts/design_tokens.py <folder found> --out docs/DESIGN.md` (draft of the values the code uses, with the places off the scale; it does not overwrite an existing file), then:
1. Copy the whole structure of the nearest sibling page (same group): `<head>` fonts, top bar, side menu, margins.
2. `<link>` the existing css file; do not copy tokens into a new file. A new file holds only what is unique to the page and uses the existing `var(--…)`. Mockup: a new page = a new `<section>` in the existing `mockup/<code>-mockup.html`, not a new file. Link the css while working; at delivery embed it in `<style>` per the single-file rule of the platform part.
3. Use existing classes for existing components (button · card · table · pill).
4. Screenshot the old and new page at the same width side by side: background, top bar, heading font and buttons must be indistinguishable.
5. If a value in this skill conflicts with the project's, use the project's and note it under `ตัดสินใจเอง`. Do not restyle old pages unless told to.

**Not found** → use the platform part's template, then write 1 line in the project README: `หน้าตา: mockup/<code>-mockup.html`.

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
Every padding · margin · gap is a value in this scale, even when the platform part conflicts, **except values measured from the real system and named in the exception list of `references/scales.md`** (for example Windows: content edge 36 · gap between sections 40). Things that belong together sit closer than things that do not. Card padding ≥ the gap inside. Details → [`references/scales.md`](references/scales.md).

### 2 · Type scale
At most 5 sizes per screen (web: lg 22 · md 15 · base 13 · sm 12 · xs 11) · smallest 11 · 2 weights · lines of 45–75 characters · Thai line-height +0.1. A marketing or landing page without motion uses the type scale and rhythm in [`references/scales.md`](references/scales.md#3--หน้าการตลาดและ-landing-ที่ไม่มี-motion) (with motion → `ui-craft`).

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
1. Render and look (the platform part says how), then go through the 3 checklists in [`references/states-and-checks.md`](references/states-and-checks.md): correctness (squint · spacing scale · ≤ 5 sizes · 1 solid button · 5 states · contrast · shrink the window) · countable beauty (icons · content ≥ 60 % of the screen · equal row heights · boxes ≤ 3 · hide the mockup's controls) · **beauty gate `ด่านสวย`** (score 7 axes against the reference app image; pass when every axis ≥ 4). Passing the first 2 can still be ugly; a mockup sent for approval must pass the beauty gate.
2. Send the image to a subagent that did not make it, **with the reference app image at the same size**, and ask for the 7-axis score, 2–3 problems per page with CSS-level fixes, no praise, and 1 more answer: **bolder or quieter**, with the single point to fix. Reviewer order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose`; none callable → minimum path in 0.1 step 3. The correctness reviewer (clicks · Functional Requirement (FR) · contrast) and the beauty reviewer are different ones. Public web pages (marketing · landing) always also go to `design-critic` of plugin `graphic-design`; not installed → say so in the report.
3. After fixing, take new screenshots. The number of rounds follows the beauty-gate cap in `references/states-and-checks.md`, in that one place only (sample commands: `scripts/screenshot.py` and section 6 of the platform part, for example [`parts/web-app-design/guide.md`](parts/web-app-design/guide.md)).
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


## reference: ai-signs.md

# Signs that give away AI drawing · fix to

If you find 2 or more on one page, fix them before sending. The full list for every medium is in `design-gate/no-ai-look`.

| Sign | Fix to |
|---|---|
| Purple-blue gradient on the primary button · gradient text · blurred glass background on every card | 1 solid accent color · single-color text · separate sections per section 4 |
| Centered hero with a 2-line heading + 2 pill buttons side by side | Visual order per section 3 — the screen has only one important thing |
| 3-column equal-height cards, a light-colored circle icon on every card | Column count by the content · icons only where they carry meaning (`patterns.md` item 9 of the platform skill) |
| emoji in place of icons · sample text like "Welcome back, John" · round numbers like 1,234 | The platform's icon set · sample data from the real domain (Thai names · non-round numbers) |
| Radius 16px+ on everything · fuzzy shadows on every layer · equally wide spacing everywhere | Corners and shadows per the platform · density per section 8 |
| "AI-powered" badge · sparkle stars · a "Get started" button that does not say what to start | Badges and buttons written as verbs of the real task |


## reference: app-character.md

# App character — choose color, corners, density and motion from how the app is used

An app used for serious work should be plain and calm. An entertainment app should be bright and playful. Choose **1 character** before drawing the first page, then use the same set of values for everything in the project: the mockup, the mockup's home page, the document cover and the logo.

Comparison image: [`../assets/app-character-sheet.webp`](../assets/app-character-sheet.webp) shows the same list card in the 6 characters. The HTML source is at [`../assets/app-character-sheet.html`](../assets/app-character-sheet.html) and can be used as a starting point.

## 1 · Choose from 4 questions (answer from the Business Requirements Document (BRD) or the user's request)

| Question | Leans plain and calm | Leans bright and playful |
|---|---|---|
| Who uses it | Working people, experts | General public, teenagers, children |
| How often and how long | Every day, several hours a day | Occasionally, a few minutes at a time |
| What is lost if they tap wrong | Money, data, health, work | Almost nothing |
| Where it is used | Desk, large screen | Phone, while traveling |

**If the answers conflict, the question "what is lost if they tap wrong" wins.** For example, a finance app for teenagers uses character 2 and may add a secondary color that is 1 level brighter, but the corner radius, density and tone must still be character 2.

## 2 · The 6 characters

| | 1 Work tool | 2 Finance, health, government | 3 Lifestyle, shopping, food | 4 Entertainment, social, casual games | 5 Children, learning | 6 Premium, creative |
|---|---|---|---|---|---|---|
| Examples | dev tool, admin, ERP, terminal | bank, insurance, hospital, e-service | restaurant, travel, shopping | music, video, chat, quiz | learning app, skill game | fashion, portfolio, luxury hotel |
| Neutral color share of area | 85–90% | 80% | 70% | 50–60% | 60% | 85–90% (white, black) |
| Brand color | 1 color, medium saturation | 1 deep color, low saturation (blue, dark green) | 1 warm color + 1–2 secondary | 2–4 highly saturated colors, gradients allowed | bright but soft colors + 1 dark color for buttons | none, or 1 metallic color (gold) |
| Default theme | dark for dev tool, light for admin | light | light, warm background | light, or gradient | light | dark, or plain white |
| Corner radius | 4–8px | 8–10px | 12–16px | 20–24px or capsule | 20–28px | 0–2px |
| Density (`ui-craft` section 8) | dense 32–36px | normal 44px | airy 48px | airy 50px | very airy 56–60px | airy, with a lot of empty space |
| Type | plain sans, body 13–14px, weights 400/600 | sans, body 15–16px | sans, body 15px, bold headings | rounded sans (Nunito etc.), heading 800 | large rounded headings, body 18px and up | serif headings, thin sans body |
| Icons | line, 16px, single color | line, in a light-colored box | full color or emoji | in a gradient circle, emoji allowed | large 40px and up, full color | the fewest, or none |
| Shadow | none, use lines | thin line | soft warm shadow | brand-colored shadow | thick border instead of shadow | none |
| Motion (`ui-craft` section 7) | 100–150ms, response only | 150ms, the least | 200ms | 250–400ms, bounce allowed | celebrate on success | slow 300ms fade |
| Illustration | none | very little | photos lead | drawings, mascot | mascot, stars, rewards | large photos |
| Message tone | direct, short, technical terms allowed | polite, clear, no alarming terms | friendly | playful, emoji allowed | easy words, praise often | few words, chosen words |

Choose the brand's tone axis and level of polish per `graphic-design:design-by-type` section 2, then compare with this table. If they do not fit (for example a "challenging" brand in a character-2 app), tell the user.

## 3 · What does not change in any character

- **Color contrast:** text must pass 4.5:1 and large text 3:1 (`ui-craft` section 5), especially text on gradient or pastel backgrounds
- **Scale:** use one spacing scale and one type scale for the whole app; the character changes only the chosen values
- **5 states:** every screen must have all 5 states; an error message in a playful app must still say what happened and what to do next
- **Status colors:** keep the usual meanings; red means error; never use a brand color that happens to be red for a normal button
- **Motion:** must be switchable off per `prefers-reduced-motion`
- **Playful does not mean cluttered:** a screen still has only one important thing (`ui-craft` section 3)

## 4 · Record it so every piece follows it

- Write the chosen character as the first-line comment of the token file, for example `/* app-character: 1 work-tool */`, and put it in the `ตัดสินใจเอง` (decided on my own) table in `docs/BUILD-PLAN.md` with the answers to the 4 questions
- **Word documents (`document-design`):** use the same brand color set, but the document body stays formal, because the readers are the approvers. Apps of character 4–5 may change only the cover, which can use brighter colors and rounder corners.
- **Logo (`graphic-design:design-by-type`):** the shape must lean the same way. Characters 1–2 use a square block with rounded edges. Characters 4–5 use very round shapes or a mascot.


## reference: depth-and-flourish.md

# Depth and surface flourish (depth and flourish)

Realistic shadows, paper surface, clay and torn edges, for screens and mockups · use together with `SKILL.md` section 4 (shadow only for things that really float · 3 depth levels · still cards get no shadow), not instead of it
The web app's shadow tokens (`--shadow-color` · `--elev-1` to `--elev-3` · the nested-corner formula) are in `ui-craft` → `references/tokens.md` · the looks that use each language are in [`web-looks.md`](web-looks.md)

## Contents

1. [The 6 principles](#the-6-principles)
2. [Depth languages, choose one](#depth-languages-choose-one)
3. [The 10 recipes](#the-10-recipes)
4. [Browser support](#browser-support)
5. [Sources](#sources)

## The 6 principles

| # | Principle | How | Source |
|---|---|---|---|
| 1 | Light comes from one direction | Every shadow on the page is offset the same way, normally light from above and shadow falling down · every layer uses the same ratio of horizontal to vertical offset | CM |
| 2 | A shadow has 2 parts | A wide, soft, faint layer for ambient light + a narrow, dark layer tight to the object for the corner light cannot reach · the higher the object floats, the further the wide layer is offset, the blurrier and fainter it gets | RU · CM · VC |
| 3 | Tint the shadow toward the background color | A shadow on a colored background uses a dark shade of the same hue as the background · translucent black makes a colored background look dull gray | CM · VC |
| 4 | Design in gray first | Set the order with spacing, size, weight and gray intensity completely, then add color · if all-gray still does not read as an order, adding color will not help | RU |
| 5 | Order with only one of them | 1 level uses size, or weight, or color, only one · all 3 at one spot is shouting, and no other level has any way left to stand out | RU |
| 6 | A raised surface has a light top edge | Light from above hits the top edge of a raised button or panel, so it has a 1px light line on top · a sunken surface (input field) is the reverse, with the shadow at the top inside the field | RU |

## Depth languages, choose one

The whole project uses 1 of these 4 languages and records it on the same line as the app character in the first-line comment of the token file (`/* app-character: 3 lifestyle · look: paper/print · depth: กระดาษ */` — `กระดาษ` means "paper") · mixing several languages on one page, such as a clay card beside a glass panel beside torn paper, is a sign of AI drawing (`design-gate/no-ai-look` catalog item 6, one visual language)

| Language | Look | Recipes | looks |
|---|---|---|---|
| Layered shadow (เงาซ้อน) | Floating things have a multi-layer single-direction shadow, top edge catching light | 1 · 2 · 3 · 5 · 8 · 10 | skeuomorphic · glass/tech · soft SaaS |
| Clay (ดินปั้น) | A puffy soft lump with volume | 4 · 8 | claymorphism |
| Paper (กระดาษ) | Stacked sheets, grain, torn edges, cutouts laid on the background | 6 · 7 · 8 · 9 | paper/print · Thai craft |
| Flat with lines (เรียบมีเส้น) | No blurred shadow; separate with a 1px line and a background of a different shade · the thick version uses a 2–3px border with a solid, unblurred shadow | 3 (translucent border only) · 9 | quiet utility · editorial · bento · luxury · neobrutalism · playful |

Recipe 10, the type part (the last 2 lines), works in every language

**Rules**

- Never animate a layered shadow (`transition` or `@keyframes` on a multi-layer `box-shadow`), because the browser must redraw the blur every frame · to change the shadow on hover, put the second shadow set in `::after` and change its `opacity` instead
- Recipe 7 is an SVG filter that is recomputed on every paint; use it on small still pieces, never on large areas or moving things · recipe 6 is a small background image repeated as a pattern, much lighter, and can be used on large backgrounds
- Everything that moves (squash on press · shadow change · line drawing in) is turned off in `@media (prefers-reduced-motion: reduce)` per `SKILL.md` section 7
- A dark theme hardly shows shadows; raise levels with progressively lighter surfaces instead · the paper and clay languages must be tried in both themes before choosing
- Cards in a list stay flat in every language, except soft SaaS on a persuasion page (landing · sales page), where content cards may use the lower 2 layers of recipe 1 and a standout piece uses all 4 layers (like the stripe.com page the user chose 2026-10-28) · clay and paper give depth only to the page's standout piece, and no more than 3 levels per `SKILL.md` section 4 · an app page used all day stays flat

## The 10 recipes

All the code is written by us and is short enough to paste into the project's css file · color values are examples; use the project's tokens instead · `--shadow-color` is defined in recipe 1 · every recipe uses light from above

### 1 · Layered multi-layer shadow

For floating things that must look soft and real (main menu, floating panel) · every layer is offset downward only, the offset doubles each layer, blur is 2 times the offset, and intensity falls layer by layer

```css
:root { --shadow-color: 223 47% 15%; }  /* hue เดียวกับพื้น · พื้นเปลี่ยน hue เปลี่ยนตาม */
.lifted {
  box-shadow: 0 1px 2px hsl(var(--shadow-color) / .09),
              0 2px 4px hsl(var(--shadow-color) / .07),
              0 4px 8px hsl(var(--shadow-color) / .06),
              0 8px 16px hsl(var(--shadow-color) / .05);
}
```

### 2 · 2-part shadow

The economy version of recipe 1 for dropdown · tooltip · toast · same values as `--elev-2` in `tokens.md`

```css
.menu {
  box-shadow: 0 1px 3px hsl(var(--shadow-color) / .14),   /* แคบ เข้ม: ใต้ชิ้น */
              0 8px 20px hsl(var(--shadow-color) / .08);  /* กว้าง จาง: แสงรอบตัว */
}
```

### 3 · Crisp border + concentric corners

A translucent border suits every background color (dark theme changes it to `hsl(0 0% 100% / .1)`) · the inside item's radius equals the outer corner minus the distance from the edge, so the 2 curves are parallel

```css
.popover {
  --r: 14px; --pad: 6px;
  border-radius: var(--r); padding: var(--pad);
  border: 1px solid hsl(var(--shadow-color) / .12);
  box-shadow: 0 4px 12px hsl(var(--shadow-color) / .10);  /* เบลอต่ำกว่า 24px ไม่ชนกฎ hairline-shadow */
}
.popover > * { border-radius: calc(var(--r) - var(--pad)); }      /* 14 − 6 = 8 */
```

### 4 · Clay volume

A puffy lump, dark belly, lit back, shadow falling on the ground in the same direction as the light · use on a few standout pieces per page

```css
.clay {
  border-radius: 24px;                                   /* ตั้งแต่ 28px สคริปต์ no-ai-look ฟ้อง huge-radius */
  background: hsl(24 85% 62%); color: hsl(24 60% 18%);   /* ตัวอักษรเข้ม 5.4:1 */
  box-shadow: inset 0 -6px 12px hsl(24 60% 35% / .35),   /* ท้องมืด */
              inset 0 6px 10px hsl(0 0% 100% / .45),     /* หลังรับแสง */
              0 12px 20px hsl(24 50% 30% / .20);         /* เงาตกบนพื้น */
}
```

### 5 · Top edge catching light + pressed-in type

Skeuomorphic raised buttons and labels that look pressed into the material (letterpress)

```css
.key {
  background: linear-gradient(hsl(220 14% 97%), hsl(220 12% 91%));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / .7),          /* ขอบบนรับแสง */
              0 1px 2px hsl(var(--shadow-color) / .18);
}
.stamped { color: hsl(220 10% 38%);                        /* 5.3:1 บนพื้นด้านบน */
           text-shadow: 0 1px 0 hsl(0 0% 100% / .8); }      /* ขอบล่างของร่องรับแสง */
```

### 6 · Paper grain

A small SVG file repeated as a background pattern · the filter box equals the image exactly (`x` `y` `width` `height`) so the seams of the pattern do not show · for single-file deliverables, embed it as a data URI

```html
<!-- grain.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#g)" opacity=".08"/>
</svg>
```
```css
.paper { background: var(--paper) url(grain.svg); }   /* --paper = สีกระดาษของแบรนด์ */
```

### 7 · Torn edge

A sheet of paper with an uneven edge · distort only the base sheet in `::before`; the text is not distorted with it

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="torn"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter>
</svg>
```
```css
.note { position: relative; isolation: isolate; }
.note::before { content: ""; position: absolute; inset: 0; z-index: -1;
                background: var(--paper); filter: url(#torn); }
```

### 8 · Shadow of a free-form shape

Cutouts with a transparent background (PNG · SVG), for example the paper-cut question mark from the template in `image-generation` of plugin `graphic-design` · `box-shadow` gives only a rectangular frame; `drop-shadow()` follows the real shape · an image that already has its own shadow needs none added

```css
.cutout {
  filter: drop-shadow(0 1px 1px hsl(var(--shadow-color) / .30))    /* ชิดขอบ */
          drop-shadow(0 6px 8px hsl(var(--shadow-color) / .16));   /* ตกบนพื้น */
}
```

### 9 · duotone

Unify photos from several sources into one set with the brand's 2 colors (the dark part is `--duo-dark`, the light part is `--duo-light`) · never use on images that must show true color, such as product photos

```css
.duotone { position: relative; isolation: isolate; background: var(--duo-light); }
.duotone img { display: block; width: 100%; filter: grayscale(1) contrast(1.1); mix-blend-mode: multiply; }
.duotone::after { content: ""; position: absolute; inset: 0; pointer-events: none;
                  background: var(--duo-dark); mix-blend-mode: lighten; }
```

### 10 · Soft raised object with gradient + tidy type

A knob or dial with a real function (a decorative floating circle is an AI sign in `design-gate/no-ai-look` item 6) · the last 2 lines work in every depth language

```css
.knob {
  border-radius: 50%;
  background: radial-gradient(circle at 50% 28%, hsl(220 10% 96%), hsl(220 8% 78%) 60%, hsl(220 8% 62%));
  box-shadow: 0 2px 3px hsl(var(--shadow-color) / .25), 0 8px 16px hsl(var(--shadow-color) / .12);
}
h1, h2, h3 { text-wrap: balance; }                       /* หัวข้อแตกบรรทัดยาวพอกัน */
.num, td.amount { font-variant-numeric: tabular-nums; }  /* ตัวเลขกว้างเท่ากัน คอลัมน์ตรง */
```

## Browser support

Checked on MDN on 2026-10-23; every item in this list is Baseline widely available: `text-wrap` works in all major browsers since Mar 2024 (`balance` balances only text of at most 6 lines in Chromium and at most 10 lines in Firefox, so use it on headings, not paragraphs) · `font-variant-numeric` and `mix-blend-mode` since Jan 2020 · `drop-shadow()` since Sep 2016 (does not accept spread and `inset`) · `<feTurbulence>` and `<feDisplacementMap>` since Jul 2015

## Sources

| Code | Source |
|---|---|
| CM | Josh W. Comeau "Designing Beautiful Shadows in CSS" https://www.joshwcomeau.com/css/designing-shadows/ (published 2021-09-13 · last updated 2026-04-27 · opened and checked 2026-10-23) · principles only, no code copied |
| RU | The book Refactoring UI by Adam Wathan and Steve Schoger (a commercial book · principles summarized in our own words, no text quoted · the book was not opened for checking this round) |
| VC | vercel-labs/web-interface-guidelines `README.md` sections layered shadows · crisp borders · nested radii · hue consistency (MIT · checked 2026-10-23) |
| Other | Clay: Smashing Magazine "Claymorphism: Will It Stick Around?" by Adrian Bece 2022-03-16 · grain: CSS-Tricks "Grainy Gradients" by Jimmy Chion 2021-09-13 (both opened and checked 2026-10-23) · all 10 recipes' code written by us |


## reference: figma-to-code.md

# Figma as the source (figma-to-code)

The customer sends a Figma file → read it through Figma's Model Context Protocol (MCP) server and convert it into our HTML mockup · use together with `SKILL.md` section 0 (the project's look wins) and the tokens in `ui-craft` → `references/tokens.md`
The tools, plans and quotas come from Figma's documentation, opened and checked 2026-10-23 (the "Sources" table) · Figma itself writes that quotas can change at any time; open the same pages again before proposing a plan to the customer

## Contents

1. [Use Figma or skip it](#1--use-figma-or-skip-it)
2. [Figma MCP server comes in 2 kinds](#2--figma-mcp-server-comes-in-2-kinds)
3. [Pull order, one screen at a time](#3--pull-order-one-screen-at-a-time)
4. [variables → our tokens](#4--variables--our-tokens)
5. [component → mockup HTML](#5--component--mockup-html)
6. [Visual check after conversion](#6--visual-check-after-conversion)
7. [Prohibitions](#7--prohibitions) · [Sources](#sources)

## 1 · Use Figma or skip it

| The file you got | Do |
|---|---|
| Uses components · variables · auto layout · clearly named layers | Pull through MCP per sections 3–5 |
| Flat drawing (names like `Frame1268` `Group5` · no variables · fixed positioning) | Skip MCP · export images to `_to_delete/figma-shots/` and use them as the reference app per section 0.1, then draw the mockup yourself |
| Got only a view link, our account has no permission on the file | MCP reads only files our account has permission on · ask the customer to invite us to the file, or ask for an export |
| The project has a mockup or already-delivered code | The existing look wins (section 0) · use Figma only to see which pages were added |
| Need only colors and fonts | Ask the designer for a style guide or the color values; no need to set up MCP |
| The only account available has just a View or Collab seat | Quota is 20 calls per month (section 2) · the order in section 3 uses about 4–6 calls per screen, so only a few pages can be viewed · ask for a Dev seat or ask for exported images instead |

## 2 · Figma MCP server comes in 2 kinds

The official name now is "Figma MCP server" · it is the channel that lets an agent call Figma's tools

| | remote (recommended by Figma) | desktop |
|---|---|---|
| Address | `https://mcp.figma.com/mcp`, no need to open the app | `http://127.0.0.1:3845/mcp` through the Figma desktop app: open a file → Dev Mode with nothing selected → Enable desktop MCP server |
| Plans and seats | All plans: Starter · Professional · Education · Organization · Government · Enterprise | Dev or Full seat on the Professional · Education · Organization · Government · Enterprise plans |
| Write back to canvas | Yes · outside drafts it needs a Full seat · free during beta, later billed by usage | No |
| Connect to Claude Code | `claude plugin install figma@claude-plugins-official` (also gets Figma's skill) or `claude mcp add --transport http figma https://mcp.figma.com/mcp`, then `/mcp` → Authenticate → Allow access in the browser | `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp`, then reopen Claude Code |
| Note | Connects only clients in the Figma MCP catalog | Figma for Government can use only this kind |

The quota of the read tools applies to both kinds (write tools such as `add_code_connect_map` `create_new_file` `generate_figma_design` and `whoami` do not count)

| Seat | Starter | Professional · Education | Organization | Enterprise |
|---|---|---|---|---|
| View · Collab | 20 calls/month | 20 calls/month | 20 calls/month | 20 calls/month |
| Dev · Full | none | 200 calls/day · 10 calls/minute | 200 calls/day · 15 calls/minute | 600 calls/day · 20 calls/minute |

## 3 · Pull order, one screen at a time

1. `get_metadata` pulls the short outline of a frame first · a large frame makes it slow, errors, or returns an incomplete result, so pick one part at a time (card · header bar · side bar)
2. `get_screenshot` takes an image of that part and keeps it in `_to_delete/figma-shots/` for the visual comparison in section 6
3. `get_variable_defs` pulls the variables and styles that part uses · say plainly "give me the names and values of the variables", because the agent picks a tool from the instruction, and a broad instruction may return code instead
4. `get_design_context` pulls the code of that part · ask for "plain HTML + CSS", because the default is React + Tailwind
5. The customer has a library → `search_design_system` looks for existing components · variables · styles before creating new ones

Need the variables of the whole file: the Variables REST API works only for a Full seat on the Enterprise plan · other plans pull part by part with `get_variable_defs` and merge them yourself

## 4 · variables → our tokens

Write the values into `:root` of the css file the mockup `<link>`s, in that one place (section 0) · put the Figma variable name as a comment beside the value so it can be traced back · components use only `var(--…)`

| In Figma | Our token | Watch out |
|---|---|---|
| Primary button color · link · selected tab | `--brand` | must pass 4.5:1 (section 5) · if it fails, adjust the shade and note it under **ตัดสินใจเอง** (decided on my own) |
| Page background · card background | `--bg` · `--surface` | card differs from the background by 2–4% (section 4) |
| Lines | `--line` · `--line-strong` | lines are lighter than you think |
| Corner radius | `--radius` · `--radius-sm` · `--radius-pill` | 2–3 values · inside items have a smaller radius than outside |
| Spacing | the scale 4 8 12 16 24 32 48 64 (section 1) | round a value outside the scale to the nearest value, and note it |
| Font size | 5 sizes (section 2) | file has more than 5 sizes → merge |
| Font | `--font` | a font with no Thai letters must be followed by `Noto Sans Thai` |
| Shadow | `--shadow` · `--shadow-lg` | use on things that really float · still cards get no shadow, except a look whose depth language says so (soft SaaS on a landing page) |
| Chart colors · status pill | the data color set and pills in `tokens.md` | a color that signals status must be paired with an icon or text |

## 5 · component → mockup HTML

- **Mockup first, always** (section 0): a new page = a new `<section>` in the existing `mockup/<code>-mockup.html` file, not a React project
- The code from `get_design_context` is raw material; keep the structure (order · groups · text), drop the Tailwind classes, and use the classes the mockup already has (button · card · table · pill)
- A repeated component becomes a class once; do not copy the code per instance
- Real images from Figma are pulled with `download_assets` (remote only) · icons use the platform's set
- Sample text: if Figma's is realistic, use it · if it is Lorem or "Text", replace it with real data per section 0.1
- The 5 states (section 6): a state Figma does not have, draw yourself, then note "not in Figma" in the mockup's control box
- The customer already ties components to real code with Code Connect → `get_code_connect_map` says which component pairs with which code; use it when writing real code, not when making a mockup

## 6 · Visual check after conversion

| Check | How |
|---|---|
| Overall matches Figma | Screenshot the mockup at the same width as the frame and place it beside the image from `get_screenshot` |
| Thai fonts | The browser may use a fallback font in place of the Figma font → look for floating vowels and tone marks and wrong line breaks |
| Long text | Put in the longest real Thai text and see that it does not overflow buttons and table headings |
| Shrink the window | Figma's auto layout is not our responsive design → shrink to 3 sizes |
| contrast · 1 solid button · spacing in scale | The section 9 checklist |
| Beauty gate (`ด่านสวย`) | Section 9 · use the Figma image as the reference app image at the same size |

## 7 · Prohibitions

- Sending the React + Tailwind code from MCP straight as the mockup
- Raw color or spacing values from Figma in components
- Pulling a whole large frame in one go
- Doing the whole system with a View or Collab seat, then running out of quota midway
- Putting a Figma password or token into the repo (the connection uses a browser login)

## Sources

| Topic | URL (opened and checked 2026-10-23) |
|---|---|
| Name · remote vs desktop · plans that can use it | https://developers.figma.com/docs/figma-mcp-server/ · https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server |
| Connect to Claude Code, remote | https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/ |
| desktop server | https://developers.figma.com/docs/figma-mcp-server/local-server-installation/ |
| Quota | https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ |
| Tool list · React + Tailwind default | https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/ |
| Large frames · agent picks the wrong tool · organizing the file for good results | https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/ · .../variables-vs-code/ · .../structure-figma-file/ |
| Variables REST API (Enterprise) | https://developers.figma.com/docs/rest-api/variables/ |


## reference: font-voice.md

# Font voice

Used in `SKILL.md` section 0.1 step 3 · the type must convey the same mood as the color and layout (rounded type leans friendly, angular type leans fast and strong). If the font voice does not match the project's basics, the page looks inconsistent even when the color and layout are right · every font pair in the table is in `design-system/data/font-pairs.csv`, column `voice`, with a checked license

## Choose from the project basics, not from the maker's taste

Ask one question at a time. The first question with a clear answer gives the voice to use.

1. **Does the brand already have a font?** Yes → use the brand's font and stop at this question
2. **What should the product make people feel in the first second?** (friendly · fast and strong · trustworthy · luxurious · playful), then look at the table below
3. **Who reads, and for how long?** Elderly readers, long documents and government forms: readability beats mood → `formal` for the body text, while the headings may still use the voice from question 2
4. **Does the chosen look force anything?** Use the "type" column in [`web-looks.md`](web-looks.md); for example neobrutalism leans `angular` · luxury leans `classic` · claymorphism and playful lean `rounded`

Once you have the voice, pass `--voice <value>` into `design_draft.py`; direction (a) gets that voice's font pair · direction (c) (bolder) may try an adjacent voice (`modern` → `angular` or `rounded`) but must not jump to the opposite voice, for example a bank using `hand`

## The 6 voices

The shapes in the "look" column come from `notes_th` of `thai-fonts.csv` · the cautions come from `font-pairs.csv` and `design-gate/no-ai-look`

| voice | Look | Use when the project basics are | Pairs in data (all pairs) | Watch out |
|---|---|---|---|---|
| `rounded` (soft round) | Rounded heads, thick round, or friendly geometric shapes (Mitr thick round · K2D rounded · Kodchasan wide round heads · LINE Seed round · Niramit soft curves · Prompt geometric) | food, cafe, clinic, education, shop chat, community | `mitr-sarabun` · `line-seed` · `line-seed-sarabun` · `kodchasan-k2d` · `k2d-plex-health` · `niramit-warm` · `prompt-noto-looped` | finance and legal work have no pair of this voice in the data (use `modern` or `classic`) · `line-seed` must be self-hosted and must not imply it belongs to LINE |
| `angular` (fast angular) | Squared heads (Bai Jamjuree) or cut-corner squares (Chakra Petch) · Kanit has no cut-end heads and goes as thick as 900; it sits in this group because it is used for promotion and sports headings | games, esports, sports, automotive, industry, sale promotions, work meant to excite | `chakra-plex` · `bai-jamjuree-plex` · `kanit-sarabun` | use at headings; body text in every pair is a plain face (Plex · Sarabun) · Kanit is heavily reused in Thai work; choose it when the brand really needs a heavy heading |
| `modern` (plain modern) | No heads (loopless) · IBM Plex Sans Thai is designed to pair with Latin Plex · Anuphan geometric · Noto Sans Thai must declare a Noto Sans pair | business software, developer tools, fintech, startups, back office, banks, multilingual systems, Android apps | `plex-sans` · `dense-admin` · `noto-sans` · `dev-terminal` · `anuphan-plex` · `anuphan-sarabun` · `anuphan-krub` · `google-sans-android` | once you choose this, the direction's boldness must come from elsewhere (heading size · hero image) · `google-sans-android` makes it look like Google; use it when the app really lives on Android |
| `formal` (readable, formal) | Has heads (looped) for long body text, elderly readers and official documents · Atkinson Hyperlegible clearly separates I l 1 O 0 | government, hospital, insurance, elderly users, long forms, low-vision users | `sarabun-gov` · `noto-looped` · `plex-looped-read` · `atkinson-access` | use mainly for body text; headings may use the voice from question 2 |
| `classic` (classic luxury) | Has heads, traditional Thai type forms, serif or stroke contrast (Trirong high contrast · Taviraj serif · Chonburi didone · Fahkwang medium contrast · Thasadith plain strokes · Pridi slab serif · Maitree serif for long reading) | hotel, spa, beauty, gold shop, fashion, media, books, law, ceremonies, weddings | `trirong-taviraj` · `trirong-sarabun` · `chonburi-luxe` · `fahkwang-athiti` · `thasadith-athiti` · `charmonman-ceremony` · `taviraj-legal` · `noto-serif-editorial` · `maitree-longform` · `pridi-news` | giant italic serif is an AI shortcut (`design-gate/no-ai-look` `italic-serif-display`) · never use Chonburi below 24px |
| `hand` (handwriting) | Handwriting (Mali children's hand · Itim round heads · Sriracha marker pen · Playpen) or slanted shop-sign heads (Pattaya) · mostly a single weight | children's work, learning, crafts, street food, cafe, bakery | `mali-kids` · `playpen-kids` · `itim-craft` · `sriracha-prompt` · `pattaya-mitr` | 1 handwriting spot per page, the rest in a readable face · never use Sriracha and Pattaya for body text |

## Check before sending

- Turn off the color and look at a black-and-white screenshot: does the heading still convey the same mood as the hero-screen sentence (section 0.1 step 1)? · If not, the font voice does not match
- The box corner radius leans the same way as the type: `rounded` pairs with round corners · `angular` pairs with small or cut corners · rounded type in very square boxes, or angular type in very round cards, needs a reason from the brand
- Zoom in on large Thai type to check the upper vowels and tone marks per `design-gate/no-ai-look` item 8 · bold headings with tight line-height often make tone marks hit the line above


## reference: live-and-variants.md

# Try live values in the browser, and make several variants of one piece — an extension of `ui-craft` section 9

> Use when a page passed the checklist but one piece still does not fit (hero · product card · top bar · main table) · the whole page does not fit → go back to section 0.1 and make 3 new directions
> The idea comes from the `live` and `generate` commands of pbakaus/impeccable (Apache-2.0 · checked 2026-10-25), rewritten in our own words; no text or code was copied

## 1 · Try live values — edit in the browser first, edit the file later

Trying values in the open page is faster than editing the file and reloading each round, and it leaves no failed trial values in the code.

1. Open the page with the session's browser tool (Playwright MCP · Claude in Chrome) at the width used for review · take a screenshot **before**
2. Try values by running JavaScript in the page (`browser_evaluate` of Playwright) — change the token at the root, do not put a style on each box:
   ```js
   document.documentElement.style.setProperty('--radius', '10px');
   document.documentElement.style.setProperty('--accent', '#0b6e4f');
   ```
3. Try no more than 3 values per issue; take a screenshot of every value at the same width and compare with the before image
4. **Write the winning value into the source file** (the token in the existing css per section 0 · not a new file), then reload the page and take another screenshot — the after-reload image must match the chosen image
5. Every value must still be in the scale of sections 1–2 · a winning value outside the scale = the scale is wrong; tell the user, do not slip it in

Never deliver work whose values live only in the browser — they vanish when the tab closes.

## 2 · Several variants of one piece

Use for a piece with several routes where choosing wrong is costly (hero · main card · empty page) · for small pieces (button color · corner radius) section 1 is enough

1. Name exactly 1 piece (for example `product card in the list page`) and what must not change (tokens · sample data · box size)
2. Make **3 genuinely different variants** — different in structure (image on top/beside · price prominent/name prominent), not just in color · for a large piece, send one new subagent per variant per `handoff/parallel-attempts-pick-best`
3. Put all 3 variants in the existing mockup file and switch with an attribute; do not make 3 files:
   ```html
   <div class="variants" data-show="a">
     <article data-variant="a"> … </article>
     <article data-variant="b"> … </article>
     <article data-variant="c"> … </article>
   </div>
   ```
   ```css
   .variants > [data-variant] { display: none; }
   .variants[data-show="a"] > [data-variant="a"],
   .variants[data-show="b"] > [data-variant="b"],
   .variants[data-show="c"] > [data-variant="c"] { display: block; }
   ```
   The switcher changes only the `data-show` of the outer box
   The switch buttons live only in the mockup's control box (section 9 · never stuck into the image sent for review)
4. Take screenshots of every variant at the same width, send them to a new beauty-gate (`ด่านสวย`) reviewer (reviewer order per section 9) to score the 7 axes and answer which variant is "bold enough without being loud"
5. Keep the winning variant, delete the other 2 and the switcher from the file · note under `ตัดสินใจเอง` (decided on my own): which was chosen · which was not · the scores

## 3 · Traps

| Trap | Why it breaks | Replace with |
|---|---|---|
| Trying values box by box with inline style | A winning value means chasing many edits, and it falls off the scale | Change the token at the root |
| 3 variants that differ only in color | The reviewer chooses by taste and gives no answer on structure | Differ in structure or visual order |
| Leaving the losing variants in the file "just in case" | The deliverable holds things nobody uses, and the next person gets confused | Delete · keep the images in `_to_delete/` |
| Letting the maker be the one to choose | They always see their own work as better than the truth (section 9) | A new reviewer |


## reference: mockup-start-page.md

# First page of a single-file mockup (`#s-start`)

This page is the table-of-contents page of the mockup that the reviewer opens as the first page. **It is not a page in the app.** Large cards filling the screen are allowed here.
The start page inside a real app follows the platform skill, for example `ui-craft` → `patterns.md` item 8, which forbids large cards.

Sample image: [`../assets/mockup-start-page-preview.webp`](../assets/mockup-start-page-preview.webp) (project Telex, 32 screens) · this image was taken before the decorations were removed (glow · gradient · label above the heading); look at the structure, not the look.

## What it must have

| Part | Rule |
|---|---|
| Width | Content fills the window, up to 1680px, and is centered. Do not limit the width and align it left, because a wide screen would leave empty space on the right for no reason. |
| Top section | Logo, name, and 1 paragraph on how to use it (the 5 states, theme switching, what FR means). At most 4 shortcut buttons, only one solid button, and 4 number cells (number of screens · FR that have a screen · status per page · number of categories). |
| Search box | Finds by name, screen number and FR number. Press `/` to start typing, Enter opens the first screen found, Esc clears the query. The box stays pinned at the top when the page scrolls. |
| Cards | 1 card per screen, divided into categories by topic, using the same categories as the test-case tabs. A card has a thumbnail of the real screen, the screen number, the name, a 1-line description, and the FR number. |
| Thumbnails | Taken from the mockup itself, in both dark and light themes, and show the image matching the open theme. Hide the mockup's control bar before taking them. Embed the images in the file as webp so the mockup stays a single file (32 screens × 2 themes ≈ 170 KB). |
| Reference tables | The screen → FR table and the "FR with no screen" table are still required. Put them under the cards or fold them away. |
| Look | A single plain background, no glow, no gradient, no small label above headings, no blinking cursor, no glowing shadow or zoom image on hover (`design-gate/no-ai-look`) · hovering a card changes only the border color · colors come from the project's tokens; with no tokens, use the house default `#2A78D6` · this rule applies to the mockup start page; a landing page that chose the soft SaaS look follows that look. |

## Build with the script

```
python scripts/mockup-start-page.py mockup/PRJ-mockup.html --config mockup/start-page.json
```

- **Put the markers in first:** put `<!-- start-page:begin -->` and `<!-- start-page:end -->` inside `<section id="s-start">` at the spot where the content goes. The script replaces everything between the markers each time it runs, so it can be re-run.
- **After editing any screen, run it again**, because thumbnails are still images.
- **Config file:** see the example at [`../assets/mockup-start-page.example.json`](../assets/mockup-start-page.example.json)
  - `topics` is optional; all screens go into one category
  - A screen that is in no category is collected into the category "Other screens"
- **What the mockup must have:** every screen is `<section class="screen" id="s-NN-name" data-title="Product — Screen name" data-fr="FR-001,FR-002">`, and colors use the project's tokens (`--bg-surface`, `--accent`, etc.); if absent, it uses the tokens of `fluent.css`, and if those are absent too, it uses the defaults
- **Cannot make thumbnails yourself:** add `--no-thumbs` and you get cards without images (no need to install playwright)

## Check before sending

- [ ] Look with your own eyes at widths 800, 1600 and 2400px in both dark and light themes; there must be no empty space on one side only
- [ ] Try 3 kinds of search: name, screen number, FR number, and the results must be right
- [ ] Click a card and it goes to the right screen, with no error in the console
- [ ] Run the script again and the number of cards stays the same (each marker appears once)


## reference: scales.md

# Spacing and type scales

Details of `ui-craft` sections 1–2 and the scale for marketing pages (section 3) · the summary rules are in `SKILL.md`

## 1 · Spacing scale — one set for the whole app

```
4  8  12  16  24  32  48  64
```

Every padding, margin, gap must be one of these values. No `13px` `18px` `22px`.
If `16` feels too tight and `24` too loose — choose `16` and fix something else instead
(usually the problem is the font size or the line length, not the spacing).

**If a value in the platform skill conflicts with this scale, use this scale** — except the values in the list below only
This scale controls only padding · margin · gap; corner radius and component sizes (button 38 · corner 13) are set by the platform skill

**Exception list — values measured from the real system; use the platform value and do not round to the scale** (add one only when it was measured from the real system, and write its name here)

| Platform | Value | Source |
|---|---|---|
| Windows | content edge left/right 36 · gap between sections 40 | `ui-craft` → `references/tokens.md` (measured from Windows 11) |

Other values of the platform skill that are not in this table use this scale

**The spacing rule people overlook most:**

> Things that belong together must sit closer than things that do not

```
ผิด: label และ input ห่าง 16px   ระหว่างฟิลด์ห่าง 16px เท่ากัน
ถูก: label และ input ห่าง 8px   ระหว่างฟิลด์ห่าง 24px
```

(Wrong: label and input 16px apart, fields 16px apart, the same. Right: label and input 8px apart, fields 24px apart.)

The eye reads groups from spacing, not from lines — if the spacing is right, most divider lines are unnecessary

**Spacing in a card:** card padding ≥ the gap between the items inside, always
A card with padding `16` and items `24` apart inside looks like things spilling out of the frame

---

## 2 · Type scale

The upper steps (lg · md · base) are clearly apart and the lower steps are only 1px apart — the values in the table are workable examples, not from a fixed ratio, and **use no more than 5 sizes per screen**

| Step | Example (web) | Used for |
|---|---|---|
| lg | 22 | Screen heading · 1 per page |
| md | 15 | Card heading · table heading |
| base | 13 | All content |
| sm | 12 | label · description under a field |
| xs | 11 | timestamp · badge |

**Line height (line-height):**

| Size | line-height | Reason |
|---|---|---|
| Large heading | 1.2–1.3 | Already large, needs no air |
| Content | 1.5–1.6 | The eye must find the start of the next line |
| Thai | +0.1 from the values above | Upper and lower vowels collide |

**Line length:** 45–75 characters; longer and the eye loses its line
On a wide screen, limit the width of the text column; do not let it fill the screen

**Smallest size 11** for text that must be read (every platform, no exception) — a platform skill's scale may offer more than 5 sizes, but **1 screen still uses no more than 5** (a large number showing the main value counts as 1 size)

**Font weight:** 2 weights per screen are enough (regular + bold) — a font may have all of 400–700, but one page should not use more than 2
If you want emphasis, change the **color** or the **size** first; do not rush to add a 3rd weight

---

## 3 · หน้าการตลาดและ landing ที่ไม่มี motion

Use for pages people read down one section at a time (sales page · product home page · launch page) · apps and dashboards use sections 1–2 · pages that move section by section with scrolling → `ui-craft`

The values in the table are starting values, set from the real page trial of 2026-11-06 and not yet measured from a prototype site · once a prototype is chosen (`design-gate/design-references`), you may measure the sizes from the prototype instead and note the source beside the token

| Step | 1440 screen | 375 screen | Used for |
|---|---|---|---|
| display | 48–64 | 32–40 | Opening-section heading · 1 per page |
| h2 | 28–36 | 24–28 | Heading of each section |
| lead | 18–20 | 17–18 | First paragraph under the heading |
| body | 16–18 | 16 | Content |
| small | 14 | 14 | Image caption · source of a number |

- Still no more than 5 sizes per page · smallest 14, not 11, because people read this page once and do not use it every day until it feels familiar · line-height per the table in section 2
- **Check:** is display at least 1.5 times larger than h2? If not, the opening heading will not stand out from the other section headings.

**Page rhythm**

- Gap between sections takes 2 more values beyond the section 1 scale: 96 and 128 (the 375 screen uses 64) · spacing inside a section still uses the section 1 scale
- Text columns are still 45–75 characters wide, but the opening section and real images may use the full frame width · **Check:** at the 1440 screen, is every section as wide as the text column, leaving the right side empty? If so, enlarge the real image or split into 2 columns.
- **Check:** shrink the whole page; are there 2 adjacent sections using the same layout? If so, change one of them.
- **Check:** besides the opening section, are there 1–2 sections that stand out from the others (full-width image · solid color background · large number)? If there are none, every section is equally loud and it reads as a list; if there are more than 2, they fight for prominence.
- Density uses the airy type per section 8 of `SKILL.md`


## reference: sources.md

# Sources · ui-craft

- Committing boldness to a single point (section 0.1 step 3): anthropics/skills `frontend-design` (Apache-2.0 · checked 2026-10-23), rewritten in our own words.
- The "bolder or quieter" reviewer question (section 9): bolder/quieter commands of pbakaus/impeccable (Apache-2.0 · checked 2026-10-23).
- Contrast thresholds (section 5): Web Content Accessibility Guidelines (WCAG) 2.2 level AA, w3.org/TR/WCAG22 (checked 22 Oct 2569 BE).
- Web page lint rules: Vercel Web Interface Guidelines, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (MIT, checked 2026-10-23). Used as a link only; do not copy its text in.


## reference: states-and-checks.md

# State examples, motion, checklists and prohibitions — an extension of `ui-craft`

The main rules are in `SKILL.md`. This file holds the examples and the full checklists. Open it when doing sections 0.1 · 6 · 7 · 9 · 10

## Contents

1. [5 states of a hardware-reading app](#5-states-of-a-hardware-reading-app-section-6)
2. [Usable error messages](#usable-error-messages-section-6)
3. [CSS for prefers-reduced-motion](#css-for-prefers-reduced-motion-section-7)
4. [Review checklist — sets 1 and 2](#review-checklist-section-9)
5. [Beauty gate — set 3](#beauty-gate--set-3-section-01--section-9)
6. [Anti-patterns](#anti-patterns-section-10)
7. [Buttons repeated on every row](#buttons-repeated-on-every-row--which-kind-section-3)
8. [How to measure contrast](#how-to-measure-contrast-section-5)

---

## 5 states of a hardware-reading app (section 6)

| State | Example (light meter) |
|---|---|
| Empty | Camera permission not yet granted: show an explanation card with a single button |
| Loading | The sensor is warming up and has no first value: show a skeleton of the number, not `0` |
| Error | The device has no sensor or permission is blocked: give the cause and the way forward (use the camera instead · open the settings page) |
| Partial | The value is beyond the measurable range (saturated): show "more than X", not a wrong number |
| Success | A measurement point was saved: show a short SnackBar that does not cover the button |

## Usable error messages (section 6)

```
ผิด: Error 500: Internal Server Error
ผิด: เกิดข้อผิดพลาด กรุณาลองใหม่
ถูก: บันทึกไม่สำเร็จ เพราะเลขที่เอกสารนี้มีอยู่แล้ว ลองเลขอื่น
   แล้วกดบันทึกอีกครั้ง [ลองใหม่]
```

An error message = what happened + what to do next, in one message · for the pronoun use `คุณ` (you) or leave it out · never stack ครับ/ค่ะ ท่าน กรุณา · on-screen wording → `human-writing` `references/thai-grammar.md` section 4, level "screen"

## CSS for prefers-reduced-motion (section 7)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

## Review checklist (section 9)

- [ ] Squint: does only one thing jump out first?
- [ ] Measure 5 random spacings — is every one in the scale `4 8 12 16 24 32 48 64`?
- [ ] Count the font sizes on the page — more than 5?
- [ ] Count the solid brand-color buttons — more than 1?
- [ ] Do things that belong together sit closer than things that do not?
- [ ] Are all 5 states present (not just the has-data state)?
- [ ] Does the error message say **what to do next**?
- [ ] Does contrast pass 4.5:1?
- [ ] Does every status shown by color have an icon or text beside it?
- [ ] Do inside items have a smaller corner radius than outside ones?
- [ ] Do only things that really float have shadows? (except cards on a persuasion page of the soft SaaS look per `depth-and-flourish.md` · an app page used all day still follows this rule)
- [ ] Shrink the window to half (web) · system font 200 % + rotate to landscape (mobile) — what breaks?
- [ ] Put in real hard data: the longest Thai name with no spaces (Thai has no spaces to break lines at) · numbers of 7 digits or more · optional fields left empty · Thai mixed with English — nothing overflows buttons, table headings and cards
- [ ] Slow network (throttle 3G in developer tools) — you see a loading skeleton, not a white screen or a button that can be pressed twice
- [ ] Touch targets ≥ 44×44px and ≥ 8px apart

**The above measures correctness; passing all of it can still be ugly.** Continue with the countable items:

- [ ] Buttons and menus have icons (text only across the whole page = wireframe)
- [ ] Content uses ≥ 60 % of the screen height, or the empty space is intended (empty page · sign-in page)
- [ ] Rows of the same kind have equal height everywhere on the page (list in card A and card B)
- [ ] No more than 3 bordered boxes per page, and no box inside a box
- [ ] The mockup's controls (requirement codes · state switcher) are not stuck in the image sent for review

**Passing the 2 sets above can still be bland** — set 3 is the beauty gate (`ด่านสวย`), used for a mockup that will be sent to someone for approval

## Beauty gate — set 3 (section 0.1 · section 9)

Take screenshots of the hero screen + 2 frequently used pages, in both themes, and place them beside the reference app image at the same size (images from `_to_delete/ref-shots/` · no reference app → `assets/app-character-sheet.webp`, the row of the chosen character) · **2 reviewers who did not make it score separately, then use the lower score** · judge from the image, do not read the code · write a 1-line reason for every axis

| Axis | Scores 4 when (checkable by eye) | Scores 5 when |
|---|---|---|
| First impression | Show the hero-screen image for 5 seconds to a new subagent that does not know the brief, and it can say what the app does, matching the hero-screen sentence (section 0.1) | Scores 4 and that subagent says by itself it would like to try it, or points to 1 attractive spot |
| Hero screen | Has a page that shows the moment the product works (not a form · table · settings page) with content that looks real | Scores 4 and has motion or a state that tells a story in a single image |
| Identity | Has a logo (title bar or header bar) + the brand color appears at ≥ 2 spots that are not buttons and not the app frame (data · main number · hero screen · selection bar) + is not the platform skill's starter theme | Scores 4 and with the logo covered, you still recognize it as this app (color · shape · hero screen) |
| Polish | Set 2 above fails 1 item | Set 2 fails 0 items |
| Compared with the reference app | Place the images as a pair without saying whose is whose, and the reviewer says "close to each other" | The reviewer picks our image as better |
| Color power | Squint at the image and see the brand color at ≥ 3 spots in the content area, spread across the top, middle and bottom of the image (the app frame is neutral and does not count) · labels that must be found quickly (status · owner · step number) are visible at once in the platform's style (see the note under the table) · secondary colors are saturated; pastel may be used only as a surface paired with text or a dark-colored border | Scores 4 and has ≥ 1 large solid block of color in the content area (per the platform note) or has 1 color contrasting with the brand color used to highlight a single important spot |
| Depth and imagery | Every page: corners and shadows match the depth language of the chosen look ([`depth-and-flourish.md`](depth-and-flourish.md)) · icons from a single set per `icon-design` section 2 (if graphic-design is installed; if not, use one set of Lucide · Tabler or Fluent) at spots that help the eye sweep · has ≥ 1 hero image or graphic that is not text in a frame (app pages and dashboards may count a data chart) · persuasion pages (landing · sales page) add: grays and light surfaces tinted with the brand color, not pure gray paired with a very dark color · app pages keep the app frame gray per the note below | Scores 4 and placed beside the prototype the owner chose (`~/.claude/superuser-style.md` if present · if not, an image from this round's `design-gate/design-references`), the reviewer says they are the same family |

**Platform notes (axes identity · color power · depth and imagery):**

- **Every platform:** the app frame (title bar · header bar · toolbar · rail · nav · borders) is gray-black lines and icons, not tinted with the brand color unless the user says so · the brand color lives in the data and primary buttons
- **web · mobile:** status labels are solid-background, not thin white outlines · a large solid block of color = the main-number card · hero · chart
- **Windows · depth and imagery axis:** depth uses Mica and Fluent elevation, no extra card shadows, and icons use Fluent — doing this does not count as a failed item
- **Windows:** color comes through the 3×16px selection bar · hero screen · main metric numbers (Key Performance Indicator · KPI) and charts · 1 primary button · status labels are a 6–8px dot + text, not a solid background, and the notice bar is a neutral background (`ui-craft` → `references/patterns.md` items 7–8) — doing this does not count as a failed item

Below 4 on any axis = level 3 or lower · for the hero-screen axis, no hero page at all = 1

- **Pass when every axis ≥ 4** · record the score every round in `docs/BUILD-PLAN.md` (no recorded score = not passed)
- Below 4 → 2–3 problems per page with CSS-level fixes · after fixing, a new reviewer checks again · **cap of 3 rounds** (this number lives only here) · after 3 rounds still not passing → go back and choose the visual direction again (section 0.1), do not keep fixing spot by spot
- Adding the **number** of colors is not the fix for the "identity" axis — identity comes from the logo, the hero screen, the shape, and the brand color used in the right places (data · primary button) · do not tint the app frame to get a score
- Low "color power" axis → add **weight** to the colors already present in the content area; do not add new colors, do not tint the frame: main numbers and charts use saturated colors · pastel colors change to a saturated shade of the same color · web/mobile: outline labels change to solid backgrounds · the main-number summary box gets a dark background (do not use a thick color bar beside a rounded card, which is an AI sign in `design-gate/no-ai-look`, unless that card signals status) · Windows: follow the platform note above

## Anti-patterns (section 10)

- **Merging an old mockup into a new file and calling it redone** — you get the same bland look again; see the exceptions in section 0
- **Using the platform skill's starter theme as is for the final look** — you get the maker's sample app, not a product
- **The main screen is a settings page** — you cannot sell a product with a settings page
- **Empty gray boxes in place of content** — a mock image can always be drawn with SVG/CSS

- **Fixing "looks not pretty" by adding more colors** — if it looks cluttered, the problem is almost always unsystematic spacing · but if it looks washed out, fix it per the "color power" axis by adding weight to the existing colors
- **Washed out and called plain** — a cream background, white cards, gray text, and color only in the header bar is a picture that is not wrong, but nobody remembers it
- **Treating a passed checklist as pretty** — a checklist catches only what is wrong; you must look with your eyes and have someone else critique it
- **Solid brand-color buttons on every row of a list** — see section 3
- **Divider lines on everything** — try deleting the lines and adding spacing instead; it improves almost every time
- **A shadow under every card** — a shadow means floating; a card sitting still is not floating
- **Bold for emphasis until the whole page is bold** — when everything is emphasized = nothing is emphasized
- **A new font size every time it feels not right** — ends at 9 sizes on one page
- **Building a state when a bug appears** — design all 5 states from the start
- **placeholder in place of label**
- **Color alone signaling status**
- **600ms animation because it feels smooth** — users read it as "slow"
- **Centering long text** — the eye cannot find the start of the line; always left-align content
- **Delivering without ever shrinking the window** (mobile: never enlarging the system font)

## Buttons repeated on every row — which kind (section 3)

| Kind | Use when |
|---|---|
| An empty icon button, appearing on hover or row selection (desktop) | The main action can be done with double-click or Enter |
| The primary button sits in the detail panel of the selected row | The screen is wide enough for a side panel (list-detail) |
| Swipe a row · long-press · ⋯ menu (mobile) | There is no hover |

Never use a solid brand-color button on every row — 8 rows means 8 primary buttons

## How to measure contrast (section 5)

Check in the browser: DevTools → select the element → the color field in Styles gives the value directly
If it is not a browser (Flutter · native), calculate from the color values in the tokens by the Web Content Accessibility Guidelines (WCAG) formula `(L1 + 0.05) / (L2 + 0.05)`, where L is the relative luminance (relative brightness) of the lighter color (L1) and the darker (L2)
Write it as a short test that loops over every text-and-background pair, in both light and dark mode, or use any contrast-checking tool (Flutter has `textContrastGuideline` in widget tests)


## reference: ux-spec-outputs.md

# User experience (UX) spec outputs — user flow and interaction spec

Text parts of a UX spec that sit beside the clickable HTML mockup (`mockup/<CODE>-mockup.html`) — moved from agent `ux-designer` (2026-10-14). Wireframe pictures inside a .md spec: ASCII and inline SVG templates are in skill `diagrams` (`references/ascii-patterns.md`, `references/svg-snippets.md`).

## User Flow
```markdown
## User Flow: <task name>

**Goal:** <what user wants to accomplish>
**Entry point:** <where they start>

1. User lands on Page A
2. Clicks "Get Started"
3. Sees Form B with fields: ...
4. Submits → System validates
   - Right: Success → Page C with confirmation
   - Wrong: Error → Inline error, focus on first invalid field
5. User reaches goal at Page C
```

## Interaction Spec
```markdown
## Component: <name>

**States:**
- Default
- Hover
- Focus
- Active/Pressed
- Disabled
- Loading
- Error

**Behavior:**
- On click: ...
- On hover: ...
- On error: ...

**Accessibility:**
- ARIA label: ...
- Keyboard: Tab to focus, Enter to activate
- Screen reader: announces "..."
```


## reference: visual-direction.md

# Visual direction · full steps of SKILL.md section 0.1

Open this before drawing the first screen of a new project or a new design. The platform skill's defaults are the floor, not the ceiling: using the starter theme as is gives a look like the maker's sample app, which nobody remembers.

1. **1 hero screen.** Write 1 sentence on which moment, when the product works, makes the viewer say wow, then make that page show that moment (camera app → the camera image with the analysis overlay · terminal → a session with real colored logs · dashboard → numbers with a story). The hero screen is not a settings page or a form. Marketing page or landing: the hero screen is the opening section. It must have at least 1 real thing from the product (a screenshot in use · real numbers · a real customer voice) and at 1440 width must leave no unintended empty space over 1/3 of the screen (eye gate `ด่านตา` of `design-gate/no-ai-look`, items 3.2 and 10).
2. **Reference app.** Read it from `docs/README.md` or the request (local path · app name · description). Take screenshots from 2–3 official pages into `_to_delete/ref-shots/` (for comparison during review only; never put them in the deliverable), then note 5 things that make it look good (theme · color · density · window frame or header bar · sample content). Do not copy the logo or images.
   Always search live, even if the customer has a reference app (pre-start gate). Has a reference app → use that app's colors, and use the search for structure and elements. No reference app → search for prototypes first: take the project's keywords and search live per `design-gate/design-references` (plugin `superuser`), type `web` · `app` · `dashboard` as the work needs, then extract colors from the chosen work. The stored palette library is for when live search is not possible. Pick 2–3 works and note the same 5 things for each.
3. **3 directions, made in parallel** (`handoff/parallel-attempts-pick-best` · one new subagent per direction). The starting point of each direction (a 2-mode palette that passes contrast · a Thai-Latin font pair · look) uses the colors extracted from the prototypes in step 2; pass them into [`design-system`](../../design-system/SKILL.md) via `--palette` before choosing by yourself. Each direction makes only the hero screen + 1 main working page, in both themes (return only the file paths and a summary of at most 15 lines per direction). The directions must be genuinely different: (a) close to the reference app (no reference app → close to the chosen character) (b) platform-native but lifted (c) bolder. Every direction states the app character ([`app-character.md`](app-character.md)) · brand color · font and type character chosen from the project basics (soft round · fast angular · plain modern · formal · classic luxury · handwriting, per [`font-voice.md`](font-voice.md), then pass `--voice` into `design_draft.py`) · corner radius · density.
   Every direction states its starting look ([`web-looks.md`](web-looks.md) · no 2 directions may use the same look) and the **1 point of boldness** it commits to (for example a full-width real image in the hero screen · a heading font with character), and the rest stays quiet.
   **The owner has a preferred style** (`~/.claude/superuser-style.md`, section "สไตล์ออกแบบที่ชอบ") → direction (a) starts from that style instead of the industry look: corners, shadows, softness of color, icons, and the type of hero image per the prototypes the owner chose (the nearest look in `web-looks.md`, for example soft SaaS). The industry sets only the content and the prohibitions. Reason: the trial page on 2026-11-06 came out as an industry-standard quiet utility, and the user answered on 2026-11-09 that the layout was better but lacked rounded corners, shadows, soft colors, graphics and icons.
   **Cannot call sub-agents** (no subagent tool · subagent fails · budget not enough) → minimum path, never skip to a single direction: make the 3 directions yourself, only for the opening section or the hero screen, at 1440 and 375 width in one file. Take screenshots and critique one direction at a time with the eye gate `ด่านตา` of `design-gate/no-ai-look` item 3.2 and the beauty gate section 9. Record that direction's score before opening the next one. Choose the highest score and note under `## ตัดสินใจเอง` that there was no separate reviewer.
4. **Comparison page** `docs/design/<code>-design-directions.html`: the 3 directions side by side + the reference app image. Under each direction, the main tokens and 1 line of pros/cons.
5. **Choose 1 direction.** At the start of the work, ask the user once "do you want to choose the direction yourself?". Yes → stop and let them choose at this step. No → a new beauty-gate reviewer (order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose` told to critique only) scores per section 9, then choose the highest score and record it under `## ตัดสินใจเอง`.
6. **Complete identity.** The logo (`graphic-design:design-by-type` · works at 16px) sits in the title bar/app icon. Write the chosen direction's brand color back into `docs/README.md`, field `doc-theme`, so documents use the same color.

**Sample content must look real.** Realistic data. Photos and main illustrations (hero · product or service cards · people) use real images per `image-generation` (plugin `graphic-design` · agent `image-artist` · order: generate with the session's tool → draw a full-scene SVG illustration → free stock photo · no setup needed). Ask about the image direction once at the start. No basic shapes (triangle, circle, square) placed in place of the real thing. No empty gray boxes in place of content, no "ตัวอย่าง" or "Lorem". Team notes (requirement codes · "รอยืนยัน") live only in the mockup's control box; never mix them into program text.


## reference: web-looks.md

# 12 web looks

Used in `SKILL.md` section 0.1 step 3 · each direction starts from a different look and states that direction's 1 point of boldness · a look is a starting point, not a ready-made theme; the brand color, font and content still come from the project · the project's existing look always wins (`SKILL.md` section 0)
Choose the app character first ([`app-character.md`](app-character.md)), then choose a look whose "character" column matches · the depth language of each look is in [`depth-and-flourish.md`](depth-and-flourish.md)

Look names use the shared terms of bergside/awesome-design-skills (MIT · 67 looks · checked 2026-10-23) so we can talk to each other; that set's rules are not used · Thai craft is our own · every example was reachable on 2026-10-23 and is for seeing direction; never copy logos, images or text.

## Mood, boldness, examples, warnings

| # | look | Mood | Fitting boldness | Real examples | Warning |
|---|---|---|---|---|---|
| 1 | quiet utility | A tool that steps back so the user's work stands out; no fatigue when used all day | 1 large hero piece of data (chart, map, camera image) | GOV.UK (gov.uk) · Things 3 (culturedcode.com/things) | Quiet does not mean pale. The brand color must be clearly visible at the primary button and the data, or you get correct but bland work that fails the beauty gate (`ด่านสวย`). |
| 2 | editorial | Reads like a magazine story, led by type and images | 1 large single-line heading that clearly differs from the body | The New Yorker (newyorker.com) · Kinfolk (kinfolk.com) | Giant italic serif is an AI shortcut (`design-gate/no-ai-look` rule `italic-serif-display`); the magazine feel comes from the grid and the order, not the font. |
| 3 | paper/print | A well-printed document, good for long reading, with footnotes and paper margins | A footnote or an illustration beside the column | Stripe Press (press.stripe.com) · Tufte CSS (edwardtufte.github.io/tufte-css) | A cream background must come from the brand or a real material. Cream because it looks tasteful is an AI default (`design-gate/no-ai-look` rule `cream-palette` and the cream + brick-orange row). |
| 4 | claymorphism | A puffy soft toy, touchable, not scary | 1 clay object on the hero screen | Microsoft Fluent Emoji 3D set (github.com/microsoft/fluentui-emoji · MIT) · Aimchess (aimchess.com · soft 3D illustration per Smashing Magazine 2022-03-16) | Use on a few standout pieces; every box as clay is the 3D clay that `design-gate/no-ai-look` item 6 counts as an AI sign · text on pastel must pass 4.5:1 |
| 5 | skeuomorphic | Real things on screen, buttons that press down, dials, materials with surface | 1 main control as a real object (knob, switch) | Airbnb 2025 3D icons (airbnb.com · Bloomberg 2025-06-13) · !Boring Software (notboring.software) | neumorphism (buttons raised from a same-color background) is forbidden: the button edge differs from the background by less than 3:1 per `SKILL.md` section 5, and people with poor sight cannot find the button. |
| 6 | neobrutalism | Raw, direct, bold, like a cut-and-paste poster | 1 highly saturated background color across the screen | Gumroad (gumroad.com) · Feastables (feastables.com) (both use thick black borders and offset solid shadows; homepage code checked 2026-10-23) | Needs a reason from the brand (bold, playful); with a finance or government app it looks untrustworthy. |
| 7 | glass/tech | Futuristic, with light, translucent layers | 1 glass panel floating over real imagery or data | Apple Liquid Glass in iOS (apple.com/os/ios) · Raycast (raycast.com) | Glass across the whole page, purple-blue gradients, glow behind content, and neon are AI signs of `design-gate/no-ai-look` (`glassmorphism` `ai-palette` `radial-halo` `neon-glow`); use glass only on panels that float over real content · text on glass must pass 4.5:1 against every image that scrolls past. |
| 8 | playful | Fun, friendly, praises when done | 1 character or illustration with a role in the work | Duolingo (duolingo.com) · Headspace (headspace.com) | Playful in illustration and rhythm, not emoji in place of icons (`design-gate/no-ai-look` rule `emoji-heading`) · error messages must still say what to do next. |
| 9 | bento | Summarizes several highlights on one screen, divided like a lunch box | 1 large cell as the hero image or data | Apple product pages (apple.com/iphone) · Procreate (procreate.com) (both are in the 2026 bento examples list of mockuuups.studio) | Cell size must follow importance. All cells equal is the same card grid that `design-gate/no-ai-look` item 2 counts (bento itself is not an AI sign per catalog item 8). |
| 10 | luxury | Quiet, expensive, lots of empty space, everything slows down | 1 full-screen real photo with a lot of space | Aesop (aesop.com) · Rolex (rolex.com) | Thin, pale type on images often fails 4.5:1 · the image must be real and high quality; an AI image or stock photo breaks it at once. |
| 11 | Thai craft (ours) | Handmade, warm, with provenance (mulberry paper, woven cloth, pen line drawing) | 1 hand-drawn line piece with a handwriting font at a single heading | No prototype site for this look yet; see the raw material at DoiTung (doitung.com · crafts page) and the Thai lettering work of Cadson Demak (cadsondemak.com) | Thai patterns on every border of every page, gold color, and a handwriting font on every line look like a souvenir, not a brand · 1 pattern per page, and body text uses a readable Thai face with heads. |
| 12 | soft SaaS | Friendly, modern, inviting, business software that was made with care | 1 hero image or graphic with depth (product screenshot in a floating frame · a diagram flowing around a 3D object · a color wave) | Stripe (stripe.com) · Tailscale (tailscale.com) · Bindplane (bindplane.com) (user chose from a real-image page 2026-10-28) | Soft does not mean fuzzy: thick black shadows under every card, corners of 28px and up (`design-gate/no-ai-look` `huge-radius`) and a purple-blue gradient across the whole background (`ai-palette`) are AI signs · gradient only on the single standout piece, and text on a gradient must pass 4.5:1 at both ends (the light end often fails; shift that end darker) · a single set of line icons per `icon-design` section 2 (if graphic-design is installed; if not, use one set of Lucide · Tabler or Fluent) placed before card headings where the icon helps separate topics, not in a colored circle on every card. |

## Starting tokens

Values are a starting point; if they conflict with `app-character.md` or the project's existing look, the project's wins · the "depth" column is the depth language in [`depth-and-flourish.md`](depth-and-flourish.md); choose one language per project

| # | look | Character | Color | Type | Corners | Depth | Motion |
|---|---|---|---|---|---|---|---|
| 1 | quiet utility | 1 · 2 | mid gray 85–90 % + 1 solid brand color | a single sans, 2 weights | 4–8px | flat with lines | 100–150ms, only for press response |
| 2 | editorial | 3 · 6 | white or off-white, black text + 1 accent color picked from an image | large serif heading clearly different from the body · Thai with heads (Trirong · Taviraj) | 0–2px | flat with lines (thin dividers) | 200–300ms fade when an image enters the screen |
| 3 | paper/print | 2 · 6 · long documents | real paper color + near-black ink + 1 printing ink color (vermilion, indigo) | serif body 17–20px, 60–70 characters per line · Thai with heads | 0 | paper | almost none |
| 4 | claymorphism | 4 · 5 | medium-saturation pastel, 3–4 colors + 1 dark color for buttons and text | rounded sans, bold 700–800 · Thai has no round-head faces | 20–24px (from 28 the `design-gate/no-ai-look` script flags `huge-radius`) | clay | 200–300ms squash on press |
| 5 | skeuomorphic | 3 · 4 · 6 | material colors (metal, wood, rubber) + 1 status-light color | sans or mono like a label on a machine | per the real object | layered shadow + top edge catching light | 150–250ms by physics, sinks when pressed |
| 6 | neobrutalism | 4 · 6 | 2–3 highly saturated full-area colors + black | bold sans or large grotesk · Thai has no heavy heads (Kanit) | 0–8px | flat with thick lines (2–3px border + 4px offset solid shadow, no blur) | 80–120ms button slides over the shadow on press |
| 7 | glass/tech | 1 · 6 | dark blue-gray background + 1 light color | geometric sans · mono numbers | 12–16px | layered shadow + 1px translucent border · glass only on floating panels | 200–300ms |
| 8 | playful | 4 · 5 | 2–4 saturated colors on a light background | bold rounded sans · Thai has no round-head faces | 16–24px or capsule | flat with thick lines (short solid shadow under buttons) | 250–400ms, bounce only at celebration |
| 9 | bento | 1 · 3 · 6 | neutral background + 1–2 standout cells in the brand color or full-cell image | 2 heading sizes (large cell · small cell) | 12–20px equal in every cell · items inside follow the nested-corner formula | flat with lines (background of a different shade) | cells enter one at a time on scroll, ≤ 300ms |
| 10 | luxury | 6 | white, black, or a single dark color + 1 metallic color at the logo | thin serif heading · short uppercase labels with slight letter-spacing · Thai with thin-stroke heads | 0–2px | flat, no shadow | 300–400ms fade (the 400 cap of `SKILL.md` section 7) |
| 11 | Thai craft | 3 · 6 | mulberry-paper color + 1 natural dye color (indigo, lac, turmeric) | Thai headings with handwriting heads (Itim) or print forms (Trirong) paired with Latin serif · body Taviraj | 0–4px or torn edge | paper (grain · torn edge · SVG hand-drawn line) | the line draws in once ≤ 400ms, the rest stays still |
| 12 | soft SaaS | 1 · 3 · 6 | white or white tinted 1–3 % with the brand color · white cards · main color of medium brightness (HSL L 45–60 %), not a very dark color on white · white text on the main color must pass 4.5:1; if it fails, lower L or use dark text · badge background uses the main color at 8–12 % · icons are lines in the main color beside headings, with no frame · every gray tinted with the brand color | bold sans heading 700, large · Thai has no heads | card 12–16px · items inside 8–10px · button 10px or capsule | layered shadow (formula 1 tinted to the background hue · cards use the lower 2 layers, the standout piece uses all 4) + top edge catching light on the primary button | 200–300ms ease-out · a clickable card lifts 2px on hover with transform |

Fonts in the table: Trirong · Taviraj · Itim are Thai faces with heads by Cadson Demak (OFL per google/fonts · checked 2026-10-23) · Kanit and the Thai-with-Latin pairing rules are in `ui-craft` part `web-app-design` section 6

## Matching looks so the 3 directions are genuinely different

- (a) close to the reference app → the look nearest the 5 things noted in step 2
- (b) platform-native but lifted → quiet utility on the platform's components, then lifted with 1 point of boldness · (a) is already quiet utility → (b) uses bento
- (c) bolder → a look that differs from (a) in at least 3 columns of the token table (color · type · depth)
- 2 directions must not use the same look · a look whose character does not match may be used only in direction (c), and the risk is written under that direction on the comparison page
