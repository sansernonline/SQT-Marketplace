---
name: windows-app-design
description: Use when building a native-looking Windows 11 app
---

# Windows App Design

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the "Gate before starting" (`ด่านก่อนลงมือ`) section of `design-gate/design-references` (plugin `superuser`) even when a brand already exists (the brand controls color and fonts, while the search is for finding the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** the app you make must look like something that ships with Windows 11, not a web page stuffed into a window.
>
> **Native does not mean the default theme.** Standout apps on Windows 11 (Windows Terminal · Dev Home · the Files app) follow native rules (sizes · corners · buttons · title bar) but have an identity of their own: a chosen default theme (dark is fine) · the brand accent color on data and the primary button · a logo in the title bar · a hero screen.
> **The window frame is neutral.** The title bar · nav · rail · command bar · status bar · borders use Mica/Acrylic with no tint, and lines and icons are gray-black following the Windows theme. The accent may appear only in the 3×16px selection bar, the primary button, data (KPI numbers · charts), and links. Tint the frame only when the user asks. Choose the identity per `ui-craft` item 0.1 before starting. `fluent.css` is the base, not the final look.

## When to use this skill

- Building a desktop app on **WinUI 3 / Windows App SDK**, **Avalonia**, or **.NET MAUI**
- Wrapping a web app as a desktop app with **Electron / Tauri / WebView2**
- Designing windows, a left menu bar, a settings page, a dashboard, a dialog
- Light/dark theme must follow the system

## When **not** to use it

- For a web app, use `web-app-design` · for a mobile app, use `mobile-app-design`
- For .docx/.pptx documents, use `branded-document-design`
- For diagrams in documents, use `markdown-visuals`

---

## 1 · Order of work — always a mockup first

> **The project already has screens → copy the existing page per `ui-craft` item 0. Do not use a new template** (unless a new design was ordered, or the existing page has not passed the beauty gate). The order below is for a project with no look at all yet, or one being redesigned.

```
0. Visual direction per ui-craft item 0.1 (search references per design-references, type app, then extract colors · hero screen · reference apps · 3 directions · pick 1 · logo) → get brand tokens that override fluent.css
   (for example --win-accent as the brand color · default theme dark · frame background neutral per fluent.css, no tint) — write them as a token block appended to fluent.css; do not edit the original file
1. Pick the structure from the table in item 0 of references/patterns.md, then copy the template that fits the app + assets/fluent.css and put them side by side
   (mockup-template.html = settings/dashboard · tool-app-template.html = a data-dense tool app · see how both look at assets/templates-preview.webp)
2. Do the 3 main pages first (the pages the user opens most often) and make them genuinely good. Do not do the rest yet
3. python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --hide "<the mockup's control bar>"  → get dark + light images
4. Open the images and look at both modes. Check per item 6, including the "eye check" table at the end of patterns.md
5. Send the images to a subagent that did not make this piece for critique (see item 6.1), fix accordingly, and take new screenshots · the number of rounds follows the beauty gate cap in `ui-craft/references/states-and-checks.md`
6. Once the 3 main pages have passed and been approved, pull out the components and use them on the remaining pages
7. Convert to real code only after the whole set is approved — use the same tokens and do not redesign
```

**Deliver the mockup as a single file** (`mockup/<code>-mockup.html`, every screen as a section) → embed the contents of `fluent.css` in `<style>` instead of `<link>` before sending · while working, keeping them side by side is fine.

---

## 2 · Design tokens

All values are measured from the real Windows 11 dark theme and are complete in **`references/tokens.md`**
(a comparison table of CSS ↔ WinUI ↔ Avalonia), and are ready to use in:

| File | For |
|---|---|
| `assets/fluent.css` | web-wrapped desktop + mockup |
| `assets/FluentTokens.xaml` | WinUI 3 / Windows App SDK |
| `assets/FluentTokens.axaml` | Avalonia 11 |

**.NET MAUI has no ready-made file.** Copy the values from `references/tokens.md` into MAUI's own `ResourceDictionary` (`Resources/Styles/Colors.xaml`). Key names follow the Avalonia column.

Values to remember without opening the table:

| | Dark | Light |
|---|---|---|
| Window / card background | `#202020` / `#2B2B2B` | `#F3F3F3` / `#FFFFFF` |
| Primary / secondary text | `#FFFFFF` / `#CCCCCC` | `#1A1A1A` / `#5D5D5D` |
| accent | `#4CC2FF` | `#005FB8` |
| Link | `#99EBFF` | `#003E92` |
| Button background | `#333333` | `#FFFFFF` |

> **The neutral values (background, text, lines, shadows) are Fluent 2 measured from real Windows 11. Do not invent them and do not adjust them to look nicer.**
> **The only color that changes with the job is the accent.** Use the customer's brand color. If there is none, use the Windows default in the table above, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Suggest a tone from the subject matter in the report.
> (The table for choosing a color tone by subject matter is in `colour-by-domain` (`diagram-figures` → `references/colour-by-domain.md`).)
> The accent value in the table above is the Windows default, a safe choice when there is no brand.
> **It is not a value you must use**, and the accent must pass contrast ≥ 4.5:1 in both dark and light mode, so it often needs a different value per mode.

**A pure black background** like Windows Security (`#000000`) is still available with `<html data-backdrop="black">`, but it is not the default, because next to other Windows 11 apps it looks harsh and out of place.

**Changing the brand** = change 3 values (`accent`, `accent-text`, `on-accent`) per mode (dark · light) in the token file, in one place for the whole app.

> Warning: **never write raw color values in a component.** Always reference a token. Otherwise dark mode breaks in spots
> that nobody sees until the customer opens it.

---

## 3 · Window structure

A diagram of the window structure with sizes (title bar 48px · nav 320px · Title 28/36 · left and right margin 36px · gap between sections 40px · content no wider than 1064px; 36 and 40 are on the exception list of the spacing scale in `ui-craft` `references/scales.md`, and other spacing uses the 4/8/12/16/24/32/48/64 scale) is in [`references/frame-and-components.md`](references/frame-and-components.md)

Rules that web developers often get wrong:

- **The settings menu is always at the bottom of the nav.** Windows users look there before anywhere else.
- **The selected-page marker is a small 3×16px bar on the left edge**, not an accent fill across the whole row. The icon of the selected row stays in the normal text color and does not turn accent.
- **1 Title per page.** Never 2.
- **Smallest click target is 32×32px** (not 48px like mobile, since desktop has a mouse).
- **Buttons are 32px tall and at least 120px wide.** A shorter button looks like the web at once (except icon buttons 32×32 and subtle buttons in the command bar).
- **4px corners for controls / 8px for cards.** No other values.

The structure above is for settings pages and dashboards. For a **data-dense tool app** (terminal client, file manager, admin tool),
use a 48px icon rail + a list + a 360px detail panel instead. See all patterns in **`references/patterns.md`**
(in-row buttons · list-detail · command bar · group headers · tabs in the title bar · status bar · start page · where icons must appear).
Item 0.1 of that file has a table comparing with real Windows 11 apps · a table that converts needs into WinUI 3 controls · and a rubric for the default window size. Use them when choosing the structure and when handing over to whoever writes the XAML.

---

## 4 · Components already in fluent.css

The class table with notes is in [`references/frame-and-components.md`](references/frame-and-components.md): title bar · nav · card · settings row · InfoBar · pill · Key Performance Indicator (KPI) · toggle · table · link. **Always use InfoBar in place of `alert()`** · KPI 3–5 slots · links use the accent-text color, not accent.

Icons use **Segoe Fluent Icons** (shipped with Windows 11) at 16px in the nav, 20px for section headings,
24px for the page header. Never mix in other icon sets. The commonly used codes are at the end of `references/tokens.md` and `references/patterns.md`.
**Icons are not decoration.** A screen whose buttons and menus are text only looks like a wireframe at once. See the "where they must appear" table in item 9 of patterns.md.

---

## 5 · Thai on Windows apps

- **Segoe UI Variable has no Thai letters.** Windows falls back to **Leelawadee UI** on its own,
  but on web-wrapped / Avalonia you must write the fallback yourself (`fluent.css` already includes it).
- A line height of 20px at 14px is enough for Thai, but for a long paragraph increase it to 22px.
- **Never justify.** Thai has no spaces between words, so the text is stretched into gaps.
- A button with Thai text is about 20% wider than English, so do not fix the button width.
- Always test with real Thai text, not Lorem ipsum.

---

## 6 · Check the work — do not skip

```bash
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/                 # 1440px = Large
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 900     # Medium
python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 600     # Small
```

Then open the images and check as follows:

- [ ] **Dark and light mode are both right.** No text sinks into the background and no white box shows in the dark theme.
- [ ] When the window gets narrow, the nav shrinks to icons, the right column drops below, and nothing overflows the screen
- [ ] Content is no wider than 1064px on a large screen
- [ ] Thai text does not overflow buttons, and tone marks do not collide with vowels
- [ ] Every click target is at least 32×32px
- [ ] Text contrast ≥ 4.5:1 (secondary text on a card background is where it fails most often)
- [ ] Every button can be reached with Tab, and a **focus ring is visible** everywhere
- [ ] No raw colors are left, and every `var(--win-…)` has a real definition. Run the checker of `web-app-design` (pass `--require` as the Fluent token set because the default is the web's names, and `--marker "Type ramp"` because `fluent.css` has no `base` line):

  Both commands (separate token file · single-file mockup) are in [`references/review.md`](references/review.md). If the app adds its own tokens, append them to `--require`. Name the sections in the mockup page starting with `s-`.

**The checklist above measures only correctness. Passing every item, the screen may still not be good-looking.** Continue with the "eye check" table at the end of `references/patterns.md` (solid buttons · icons · white space · row height · number of boxes), then finish with the 7-axis **beauty gate** (`ด่านสวย`) of `ui-craft` (`references/states-and-checks.md` set 3). Every axis ≥ 4 before sending it to a person for approval.

### 6.1 · Have someone else critique

Whoever made the work sees it as better than it is. Send the images to a subagent that did not make this piece (in order: `graphic-design:design-critic` if installed → `graphic-designer` → `general-purpose` told to critique only · same order as `ui-craft`) and tell it the goal:

The prompt for the critic (goal · 2–3 problems per page · fixes at CSS level · no praise · ≤ 250 words) is in [`references/review.md`](references/review.md).

Fix the points you agree with (a critique that is wrong because the image was misread needs no fix, but note it), then take new screenshots. The number of rounds follows the beauty gate cap in `ui-craft/references/states-and-checks.md` (past the cap = go back and choose the visual direction again, not keep tweaking).

---

## 7 · Anti-patterns

16 prohibitions (accent fill across the whole menu row · tinting the window frame · 12–16px corners · shadows under cards · `alert()` · dark mode only · solid buttons on every row · buttons without icons, and so on) are in [`references/review.md`](references/review.md)

---

## 8 · Limits you must know

5 limits are in [`references/review.md`](references/review.md). Most important: `.xaml`/`.axaml` have not been compile-tested, and WinUI must merge `FluentTokens.xaml` **after** `XamlControlsResources`.

---

## 9 · Link to other skills

| Need | Use with |
|---|---|
| user flow / wireframe before color | agent `ux-designer` |
| charts in the dashboard | `web-app-design` → `references/tokens.md` section "Data colors (charts)" |
| spec document of the screen | `design-gate/polished-document-style` + `branded-document-design` |
| choosing the app architecture | `architecture-patterns` |
| spacing rules, visual order, and the 5 states of a screen | `ui-craft` |
| architecture diagram | `software-diagrams` |

---

## Do not look AI-made

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 as well), because 0 items from the script is not yet a pass.
