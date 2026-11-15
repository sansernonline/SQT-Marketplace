---
name: ui-craft
description: Use with a platform skill when a task produces a screen or mockup
---

# UI Craft

> **Pre-start gate `ด่านก่อนลงมือ` (every time):** read the owner's theme → search live for reference designs → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-start gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes color and font; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule of this skill:** a good-looking screen does not come from pretty colors. It comes from **consistency**.
> Spacing comes from one scale, font sizes come from one scale, and each page has only one most-important thing.
>
> **But consistency alone gives "not wrong", not "wow"** — a mockup that someone will approve needs a visual direction (section 0.1) and must pass the beauty gate `ด่านสวย` (section 9) too.
> **"Don't overuse color" means few colors, not pale colors** — the brand color must carry weight and be visible across the whole page **in the data and the primary buttons** (the "color power" axis of the beauty gate)
> **The app frame is neutral** — title bar · header bar · toolbar · rail · nav · borders use gray-black lines and icons in the Windows theme style, not tinted with the brand color · the brand color lives in the data, primary buttons, small selection bars and the logo · tint the frame only when the user says so

---

## When to use this skill

- Every time you build a user interface (UI) — use it **together with** a platform skill, not instead of it
- A screen "looks off" but you cannot say what is wrong
- Reviewing a UI that someone else made
- Platforms that have no dedicated skill yet (for example TV apps, kiosk, smart watch)

## When **not** to use it

| Task | Use this instead |
|---|---|
| Need real colors, fonts, components | `web-app-design` · `windows-app-design` · `mobile-app-design` |
| Charts and data graphs | `web-app-design` section chart colors |
| Printed documents | `branded-document-design` |
| Slides | `presentation-design` |

**This skill sets no colors and no fonts** — take them from the platform skill.
It controls only *spacing, size, order and states*.

---

## 0 · Before creating a new page — does the project already have a look

> **The project's own look always beats the skill's starter theme**
> The templates and css in the platform skill's `assets/` are for projects that have **no screens at all yet**
>
> **Two exceptions — do not copy the existing look; redo section 0.1:** (1) the user or the prompt orders a new design, or says the current look is not nice (2) the current look is a mockup that has not passed the beauty gate (section 9 · **no beauty-gate score recorded in `docs/BUILD-PLAN.md` = not passed**) — copying something that failed gives another set that fails · move the old files to `_to_delete/`, do not delete them · a look that is **real delivered code** still always wins, unless there is a new-design order

Before copying anything from the skill, look in the project first:

| Look at | Look for |
|---|---|
| `mockup/**/*.html` · `*.css` | pages already made · the css files those pages `<link>` |
| Code folders: `styles.css` · `theme.*` · `tokens.*` · `tailwind.config.*` · `lib/core/theme.dart` · `*.xaml` | the tokens and components the app really uses |
| `docs/deck/` · `docs/*.html` | decks or document pages that already have a theme |
| The project README | a line saying which file the look is taken from |

**Found** → first run `python -I scripts/design_tokens.py <folder found> --out docs/DESIGN.md` to get a draft of the values the code really uses (token · color · font · size · spacing · radius · shadow) with the places that fall off the scale · the script does not overwrite an existing file · then do the following, and do not copy the skill's template:

1. Pick the **nearest sibling page** (same group, for example a new page in the admin section → copy an admin page) and copy the whole page structure: `<head>` fonts, top bar, side menu, margins
2. **`<link>` the existing css file; do not copy tokens into a new file** — the new file may hold only the parts unique to this page, and must use the `var(--…)` of the existing file · if you copy tokens, the day the old file changes color the new page will not follow
   **mockup:** a new page = a new `<section>` in the existing `mockup/<code>-mockup.html` file, not a new file · while working, `<link>` the css · at delivery, embed the css content in `<style>` per the single-file rule of the platform skill
3. For components that already exist (button, card, table, pill), use the existing class; do not write a new one that looks similar
4. Open the old page and the new page, take screenshots at the same width, and put them side by side — background color, top bar, heading font, buttons must be so alike that you cannot tell who made which
5. A value in this skill (spacing scale, font size) conflicts with the project's existing one → **use the existing one** and note it at the end of the answer under `ตัดสินใจเอง` (decided on my own) · do not change the whole old set of pages to match this skill unless told to

**Not found** → use the platform skill's template, then write 1 line in the project README saying which file the look is taken from (for example `หน้าตา: mockup/<code>-mockup.html`)

**New project: pick 1 of 6 app characters before drawing the first page** → [`references/app-character.md`](references/app-character.md) (the project's existing look always wins)

**The customer sends a Figma file** → read it through the Figma MCP server, convert variables to tokens, then make the HTML mockup per this section · when to skip Figma → [`references/figma-to-code.md`](references/figma-to-code.md)

---

## 0.1 · Visual direction — before drawing the first screen of a new project or a new design

> The platform skill's defaults are the **floor**, not the **ceiling** · using the starter theme as is = a look like the maker's sample app, which nobody remembers

1. **1 hero screen** — write 1 sentence on which moment, when the product works, makes the viewer say wow, then make that page show that moment (camera app → the camera image with the analysis overlay · terminal → a session with real colored logs · dashboard → numbers with a story) · **the hero screen is not a settings page or a form** · marketing page or landing: the hero screen is the opening section; it must have at least 1 real thing from the product (a screenshot in use · real numbers · a real customer voice) and at 1440 width must leave no unintended empty space over 1/3 of the screen (eye gate `ด่านตา` of `no-ai-look`, items 3.2 and 10)
2. **Reference app** — read it from `docs/README.md` or the request (local path · app name · description) · take screenshots or capture images from 2–3 official pages into `_to_delete/ref-shots/` (use for comparison during review only; never put them in the deliverable), then note 5 things that make it look good (theme · color · density · window frame or header bar · sample content) · do not copy the logo or images
   **Always search live, even if the customer has a reference app** (pre-start gate) · has a reference app → use that app's colors, and use the search for structure and elements · **customer has no reference app** → **search for prototypes first:** take the project's keywords and search live per `design-references` (plugin `superuser`), type `web` · `app` · `dashboard` as the work needs, then extract colors from the chosen work · the stored palette library is for when live search is not possible · pick 2–3 works and note the same 5 things for each
3. **3 directions, made in parallel** (`parallel-attempts-pick-best` · one new subagent per direction) — the starting point of each direction (a 2-mode palette that passes contrast · a Thai-Latin font pair · look) uses the colors extracted from the prototypes in step 2; pass them into [`design-direction-lookup`](../design-direction-lookup/SKILL.md) via `--palette` before choosing by yourself · each direction makes only the hero screen + 1 main working page, in both themes (return only the file paths and a summary of at most 15 lines per direction) · the directions must be genuinely different: (a) close to the reference app (no reference app → close to the chosen character) (b) platform-native but lifted (c) bolder · every direction states the app character (`references/app-character.md`) · brand color · font and type character chosen from the project basics (soft round · fast angular · plain modern · formal · classic luxury · handwriting, per [`references/font-voice.md`](references/font-voice.md), then pass `--voice` into `design_draft.py`) · corner radius · density
   Every direction states its starting look ([`references/web-looks.md`](references/web-looks.md) · no 2 directions may use the same look) and the **1 point of boldness** it commits to (for example a full-width real image in the hero screen · a heading font with character), and the rest stays quiet · the idea of committing boldness to a single point comes from anthropics/skills `frontend-design` (Apache-2.0 · checked 2026-10-23), rewritten in our own words
   **The owner has a preferred style** (`~/.claude/superuser-style.md`, section "สไตล์ออกแบบที่ชอบ" (preferred design style)) → direction (a) starts from that style instead of the industry look: corners, shadows, softness of color, icons, and the type of hero image per the prototypes the owner chose (the nearest look in `web-looks.md`, for example soft SaaS) · the industry sets only the content and the prohibitions · reason: the trial page on 2026-11-06 came out as an industry-standard quiet utility, and the user answered on 2026-11-09 that the layout was better but lacked rounded corners, shadows, soft colors, graphics and icons
   **Cannot call sub-agents** (no subagent tool · subagent fails · budget not enough) → minimum path, never skip to a single direction: make the 3 directions yourself, only for the opening section or the hero screen, at 1440 and 375 width in one file · take screenshots and critique one direction at a time with the eye gate `ด่านตา` of `no-ai-look` item 3.2 and the beauty gate section 9 · record that direction's score before opening the next one · choose the highest score and note it under `## ตัดสินใจเอง` (decided on my own) that there was no separate reviewer
4. **Comparison page** `docs/design/<code>-design-directions.html` — the 3 directions side by side + the reference app image · under each direction, the main tokens and 1 line of pros/cons
5. **Choose 1 direction** — at the start of the work, ask the user once "do you want to choose the direction yourself?" · yes → stop and let them choose at this step · no → a new beauty-gate reviewer (order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose` told to critique only) scores per section 9, then choose the highest score and record it under `## ตัดสินใจเอง`
6. **Complete identity** — the logo (`graphic-design` · works at 16px) sits in the title bar/app icon · write the chosen direction's brand color back into `docs/README.md`, field `doc-theme`, so documents use the same color

**Sample content must look real** — realistic data · photos and main illustrations (hero · product or service cards · people) use real images per `image-generation` (plugin `graphic-design` · agent `image-artist` · order: generate with the session's tool → draw a full-scene SVG illustration → free stock photo · no setup needed) · ask about the image direction once at the start · no basic shapes (triangle, circle, square) placed in place of the real thing · no empty gray boxes in place of content, no "ตัวอย่าง" (example) or "Lorem" · team notes (requirement codes · "รอยืนยัน" (awaiting confirmation)) live only in the mockup's control box; never mix them into program text

---

## 1 · Spacing scale — one set for the whole app

```
4  8  12  16  24  32  48  64
```

Every padding · margin · gap must be a value in this scale. If the platform skill conflicts, use this scale — **except values measured from the real system and named in the exception list of `references/scales.md`** (for example Windows: content edge 36 · gap between sections 40) · things that belong together sit closer than things that do not · card padding ≥ the gap inside
Examples and the full reason → [`references/scales.md`](references/scales.md)

## 2 · Type scale

No more than 5 sizes per screen (lg 22 · md 15 · base 13 · sm 12 · xs 11 for web) · smallest 11 · 2 weights per screen · lines of 45–75 characters · Thai line-height +0.1
Line-height table and the full reason → [`references/scales.md`](references/scales.md)
This scale is for apps · a marketing page or landing page without motion uses the type scale and rhythm of the marketing page → [`references/scales.md`](references/scales.md#3--หน้าการตลาดและ-landing-ที่ไม่มี-motion) (with motion section by section → `dynamic-website`)

---

## 3 · Visual order — one screen, one important thing

Ask yourself before placing elements: **what did the user open this page to do**
That item gets prominence level 1, and the rest step down

| Level | How to make it stand out | How many per page |
|---|---|---|
| 1 | Solid brand color + largest size | **1** |
| 2 | Bold text or light background | 2–3 |
| 3 | Normal text color | Unlimited |
| 4 | Faded text color | Unlimited |

**2-second eye test:** squint at the screen. What jumps out first?
If 4 things jump out together, there is no order yet.

**There may be only one primary button per screen**; the rest are secondary buttons (outline) or empty buttons (text only)
A dangerous (delete) button is a red secondary button, not a solid red button — otherwise it steals prominence from the main task

**Buttons repeated on every row of a list** (open · edit · delete) must not be solid brand-color buttons — 8 rows means 8 primary buttons · the 3 alternatives are in [`references/states-and-checks.md`](references/states-and-checks.md)

---

## 4 · What separates sections — lines, shadows, or backgrounds

There are 3 choices, but **use only one method per depth level**, because mixing them makes it messy at once

| Method | Use when | Watch out |
|---|---|---|
| Spacing only | Separating groups in the same area | **Always try this first** |
| 1px light line | Tables · lists · section dividers | The line must be lighter than you think |
| Background of a different shade | Card on the page background | A 2–4% difference is enough |
| Shadow | Things that **really float** · cards on a persuasion page of the soft SaaS look (soft 2-layer shadow) | modal · dropdown · toast · app pages used all day get no card shadow |

> A shadow is not decoration. It means "this sits above the others, and you can click elsewhere to close it"
> A card sitting still on an app page is not floating — it needs no shadow · a landing page follows the depth language of the chosen look

**3 depth levels are enough:** page background → card → floating thing
Beyond that the eye cannot tell them apart

**Corner radius:** use 2–3 values, and **the inside item must always have a smaller radius than the outside one**
A card with radius 14 and an image inside with radius 14 shows triangular gaps at the corners — the inside should be 8–10

**Realistic shadows · paper surface, clay, torn edges · choose one depth language per project** → [`references/depth-and-flourish.md`](references/depth-and-flourish.md)

---

## 5 · Color contrast — numbers that must pass

| Item | Minimum ratio |
|---|---|
| Normal text | 4.5 : 1 |
| Large text: ≥ 24px regular or ≥ 18.7px bold | 3 : 1 |
| Input borders · icons that carry meaning | 3 : 1 |
| Decorative divider lines | No threshold |

Thresholds follow Web Content Accessibility Guidelines (WCAG) 2.2 level AA (w3.org/TR/WCAG22 · checked 22 Oct 2569 BE) · check with the browser DevTools · Flutter and native: calculate from the tokens in both light and dark mode (formula and how to write the test in [`references/states-and-checks.md`](references/states-and-checks.md))

**Commonly missed:**

- Wrong: faint gray text on a white background because it "looks clean" — unreadable on a laptop screen in the sun
- Wrong: **color as the only status signal** — color-blind people cannot see it; always pair it with an icon or text
- Wrong: placeholder in place of a label — once the user types, they forget what the field is

---

## 6 · The five states every screen must have

Designing only the "full of data and beautiful" state = 20% of the work done

| State | What it must have | Common miss |
|---|---|---|
| **Empty** | Say why it is empty + a button for what to do next | Shows only "No data" |
| **Loading** | A gray outline (skeleton) in the shape of the real thing | A spinner in the middle of the screen = the screen flickers |
| **Error** | What happened + what to do next + a retry button | Throwing the system error at the user to read |
| **Partial** | The parts that loaded show right away; the broken part says so only at that spot | The whole page breaks because one widget crashes |
| **Success** | Let the user know, then disappear by itself | A modal popping up to press "OK" |

**First-time empty state ≠ empty because the search found nothing** — different message, different button

**Apps that read hardware use the same 5 states, only the root cause differs** — an example with a light meter is in [`references/states-and-checks.md`](references/states-and-checks.md)

**An error message says what happened, why, and what to do next**, not a bare `Error 500` or "an error occurred" — right (a Thai on-screen message, keep as is): "บันทึกไม่สำเร็จ เพราะเลขที่เอกสารนี้มีอยู่แล้ว ลองเลขอื่น" (more examples in the references)

**On-screen wording (microcopy)** — the full rules are in `human-writing` `references/thai-grammar.md` section 4, level "screen"

| Topic | Rule |
|---|---|
| Pronoun | `คุณ` (you) or no pronoun · do not use ท่าน |
| Polite words | Do not stack ครับ/ค่ะ ท่าน กรุณา in one message · usually have none at all |
| Buttons | Start with a verb (บันทึก · ส่ง · ลบรายการนี้), not a bare ตกลง/ยืนยัน |
| Error | What happened + what to do next, in one message |

---

## 7 · Motion budget

| Type | Time | Easing curve |
|---|---|---|
| hover · color change | 100–150ms | `ease-out` |
| open/close dropdown · toast | 150–250ms | `ease-out` |
| modal · page change | 250–350ms | `ease-in-out` |

**Over 400ms = the user feels the app is slow**, not that the app is luxurious

- Things **entering** must not be faster than things **leaving** — leaving should be faster or equal
- Do not animate something the user is about to press (a button moving away from the finger)
- **A moment to smile: 1 per flow** — only when a task succeeds (quote sent · payment passed · full set done), not at loading or hover · no more than 400ms · does not cover the next button, and no need to wait for it to finish before pressing · off under `prefers-reduced-motion` · use surface flourishes (multi-layer shadow · grain · duotone) per [`references/depth-and-flourish.md`](references/depth-and-flourish.md); do not add them just to look expensive
- Respect `prefers-reduced-motion` — some people really get dizzy (Flutter: if `MediaQuery.disableAnimationsOf(context)` is `true`, skip the animation)
- **Do not redraw when the displayed value has not changed** — notify the UI only when the value on screen really changes (a jittery sensor value: change over ~1 %) and update slowly drifting secondary values about once per second, because endless redrawing drains the battery, makes the screen reader repeat itself, and keeps test tools from reading the screen

---

## 8 · Density — choose once and stay with it

| Type | Row height | Suits |
|---|---|---|
| Dense | 32–36px | Data tables · all-day users · need to see a lot at once |
| Normal | 40–44px | General apps |
| Airy | 48–56px | Marketing pages · apps used occasionally for long stretches |

**A finger tap target must be ≥ 44×44 pt on iOS (Apple) · ≥ 48×48 dp on Android (Material)**, even if the icon is smaller than that
(enlarge with padding or a pseudo-element, not by enlarging the icon)

**Once you choose dense, no airy rows may be mixed in** — inconsistent density makes a
screen "look unsystematic" the most, and people overlook it the most

---

## 9 · Check the work

Always render and look (the platform skill says how), then go through the 3 checklists in [`references/states-and-checks.md`](references/states-and-checks.md): the correctness set (squint · spacing scale · ≤ 5 sizes · 1 solid button · 5 states · contrast · shrink the window) · the countable beauty set (icons · content ≥ 60 % of the screen · equal row heights · boxes ≤ 3 · hide the mockup's controls) · and the **beauty gate `ด่านสวย`** (score 7 axes against the reference app image, pass when every axis ≥ 4) — **passing the first 2 sets can still be ugly · a mockup sent for approval must pass the beauty gate too**

**Have someone who did not make it critique it:** send the image to a subagent that did not make this piece, **together with the reference app image at the same size**, and ask for the 7-axis beauty-gate score and 2–3 problems per page with CSS-level fixes; no praise · beauty-gate reviewer order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose` → cannot call anyone at all, use the minimum path in section 0.1 step 3 · the correctness reviewer (button clicks · Functional Requirement (FR) · contrast) and the beauty reviewer are different ones, because a correctness reviewer will pass work that is correct but bland
The beauty-gate reviewer answers 1 more question: **should this work be bolder or quieter**, with the single point to fix (the question comes from the bolder/quieter commands of pbakaus/impeccable · Apache-2.0 · checked 2026-10-23) · public web pages (marketing page · landing page) always go to the `design-critic` agent of plugin `graphic-design` too, even when the main reviewer is another · not installed → say so in the report
After fixing, take new screenshots · the number of rounds uses the beauty-gate cap in `references/states-and-checks.md` in that one place only (sample commands are in the platform skill, for example `windows-app-design` section 6 and `references/review.md`)
The person who made it always sees their own work as better than the truth.

**The page passed but one piece still does not fit** → try live values in the browser, or make 3 variants of that piece for the reviewer to choose from → [`references/live-and-variants.md`](references/live-and-variants.md)

**Multi-page work:** get the 3 main pages to pass first, then extend to the rest — doing every page in one round gives each page less attention

**The first page of a single-file mockup (`#s-start`) is a table of contents for the reviewer, not a page in the app** → build it with `scripts/mockup-start-page.py` per the rules in [`references/mockup-start-page.md`](references/mockup-start-page.md)

---

## 10 · Anti-patterns

17 prohibitions (including relabeling an old mockup as new · the starter theme as the final look · adding colors to fix "not pretty" · solid buttons on every row · dividers on everything · a shadow under every card · 600ms animation, etc.) are in [`references/states-and-checks.md`](references/states-and-checks.md)

---

## 11 · Link to other skills

| Need | Use together with |
|---|---|
| Colors, fonts, real web components | `web-app-design` |
| Windows apps | `windows-app-design` |
| Mobile apps | `mobile-app-design` |
| User flow before drawing | agent `ux-designer` · user-flow and interaction-spec template → [`references/ux-spec-outputs.md`](references/ux-spec-outputs.md) |
| Diagrams to go with a spec | `software-diagrams` |
| Presentation slides | `presentation-design` |
| Cut out what is not needed | `simplicity-first` |
| Logo · poster · post · print work | `graphic-design` |

---

## Do not look AI-made

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script (with plugin `superuser` installed, the `ui-scan` hook runs it automatically every time a UI file is edited · for a page that is already on the web use `--url`) · every piece also passes the eye gate item 3.2 (web pages answer items 10–14 too), because 0 script findings does not mean pass · the prohibitions in this file are specific to this work; the full list for every medium is there

**Signs that give away AI drawing — if you find 2 or more on one page, fix them before sending**

| Sign | Fix to |
|---|---|
| Purple-blue gradient on the primary button · gradient text · blurred glass background on every card | 1 solid accent color · single-color text · separate sections per section 4 |
| Centered hero with a 2-line heading + 2 pill buttons side by side | Visual order per section 3 — the screen has only one important thing |
| 3-column equal-height cards, a light-colored circle icon on every card | Column count by the content · icons only where they carry meaning (`patterns.md` item 9 of the platform skill) |
| emoji in place of icons · sample text like "Welcome back, John" · round numbers like 1,234 | The platform's icon set · sample data from the real domain (Thai names · non-round numbers) |
| Radius 16px+ on everything · fuzzy shadows on every layer · equally wide spacing everywhere | Corners and shadows per the platform · density per section 8 |
| "AI-powered" badge · sparkle stars · a "Get started" button that does not say what to start | Badges and buttons written as verbs of the real task |

For a web page whose code is HTML/React, also go through the lint-style rules of the Vercel Web Interface Guidelines one more round (fetch live from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` — the repo is MIT (checked 2026-10-23) but use it as a link only; do not copy its text in, so you always get the latest version)

## Abbreviations

Always write an abbreviation in full the first time, then put the abbreviation in brackets — for example Model Context Protocol (MCP)
After that you may use the abbreviation. See the skill `spell-out-abbreviations` for details.
