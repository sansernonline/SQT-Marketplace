# Token reference — Apps Track-style web app design system

> Warning: **the color values in this file are a finished example, not a standard.**
> Always pick colors from the work itself first (see the item "colors come from the work" in `SKILL.md`).
> What to take from this file is **the list of tokens and their roles**, not the values.
> Colors, fonts, type sizes, radii, shadows and layout widths are fallbacks. The project's values live in `theme.css` (`SKILL.md` item 2) · spacing and breakpoints follow this file.

All definitions are in `assets/appstrack.css`, in the `:root` block.
**Nothing below the `=== base ===` line may contain a raw color**, because the checker uses that line as the boundary.

## Contents

1. [Brand — solid color](#brand--solid-color)
2. [Surfaces · lines · shadows](#surfaces--lines--shadows)
3. [Typography](#typography)
4. [Data colors (charts) — always solid](#data-colors-charts--always-solid)
5. [Pill (status) — three values as a set](#pill-status--three-values-as-a-set)
6. [Layout](#layout)
7. [Switching theme / brand](#switching-theme--brand)
8. [Ready-made component classes](#ready-made-component-classes)

---

## Brand — solid color

| Token | Value | Used for |
|---|---|---|
| `--brand` | `#226cc6` (a darker shade of the house default `#2A78D6`) | primary button · selected chip · progress bar · link · selected tab · menu selection bar · border on focus · logo |
| `--brand-2` | `#6a5cd6` | 2nd data color paired with `--brand` (charts) |
| `--brand-50` | `#eef4fd` | avatar · mention background · focus ring |
| `--brand-100` | `#dde9fb` | spinner track |

> **No gradient** — buttons, chips, progress and charts use solid `--brand` (`design-gate/no-ai-look`: purple-blue gradient → 1 solid brand color)
> **`--brand` must pass 4.5:1** for white text on a brand background (`#226cc6` = 5.21) · brand on `--bg` (4.87) · brand on `--brand-50` (4.71) — checked 22 Oct 2026

## Surfaces · lines · shadows

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#f6f7fb` | page background |
| `--surface` | `#ffffff` | cards · inputs · normal buttons |
| `--line` | `#eef0f5` | lines inside cards · table lines |
| `--line-strong` | `#e4e7ee` | input border · button border |
| `--skeleton` | `#e4e7ee` | loading placeholder (`.skeleton`) |
| `--shadow` | thin 2-layer shadow | dropdown · tooltip (small floating things) |
| `--shadow-lg` | deep 2-layer shadow | modal · toast · floating menu |
| `--radius` / `--radius-sm` / `--radius-pill` | `14px` / `9px` / `99px` | card / button·input / pill·chip |
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | things that appear (dropdown · toast · modal) — shoots fast then settles (expo-out) |
| `--ease-io` | `cubic-bezier(.65, 0, .35, 1)` | things that move (sliding a panel · switching tabs) · durations follow `ui-craft` item 7 |

> **Cards have no shadow** — a still card does not float; it is separated from the page by the `--line` border + `--surface` fill on `--bg` (`ui-craft` item 4) · the topbar is a solid `--surface` fill, no frosted glass

**2-part shadow from one color:** `--shadow` and `--shadow-lg` above are already 2-layer shadows in the color `rgba(20, 30, 55)` · for a project whose background is not blue-gray (cream, green, dark theme) or that needs 3 levels, add this set to the project's `:root` (not yet in `appstrack.css`).

| Token | Value | Used for |
|---|---|---|
| `--shadow-color` | `223 47% 15%` (the HSL channels of `rgba(20, 30, 55)`) | the color of every shadow layer · change the hue to match the background; do not use translucent black |
| `--elev-1` | `0 1px 2px hsl(var(--shadow-color) / .12), 0 2px 6px hsl(var(--shadow-color) / .06)` | small raised pieces: a table header that sticks to the top while scrolling · a switch knob |
| `--elev-2` | `0 1px 3px hsl(var(--shadow-color) / .14), 0 8px 20px hsl(var(--shadow-color) / .08)` | dropdown · tooltip (replaces `--shadow`) |
| `--elev-3` | `0 2px 4px hsl(var(--shadow-color) / .12), 0 18px 40px hsl(var(--shadow-color) / .12)` | modal · toast (replaces `--shadow-lg`) |

The first layer is narrow and darker (under the piece, where light cannot reach); the second is wide and faint (ambient light) · at higher levels the wide layer is offset further down in the same direction · a still card still has no shadow · for layered shadows, translucent edges and other depth language → `ui-craft` → `references/depth-and-flourish.md`

**Nested corners:** inner radius = outer radius − the distance from the outer edge to the inner item (padding), so the 2 curves are parallel, e.g. a `--radius` 14 card with an image 6 from the edge → the image radius is 8 · if the result is 0 or negative (padding ≥ outer radius) → use `--radius-sm`, because the 2 corners are so far apart the eye no longer compares them · source: vercel-labs/web-interface-guidelines, section nested radii (MIT · checked 2026-10-23)

## Typography

| Token | Value | Used for |
|---|---|---|
| `--text` | `#333b4a` | headings · main metric numbers (Key Performance Indicator · KPI) |
| `--text-body` | `#414957` | body text (the default for body) |
| `--text-muted` | `#5f6673` | labels · descriptions · table headers · empty state · inactive menu |
| `--text-faint` | `#69707d` | timestamps · menu group headings · supporting text |

Contrast (Web Content Accessibility Guidelines (WCAG) 2.2 level AA needs ≥ 4.5:1 · checked 22 Oct 2026): `--text-muted` on white 5.78 · on `--bg` 5.40 · `--text-faint` on white 4.98 · on `--bg` 4.65 ← the lowest in the system; never make it fainter

A 5-size scale, matching `ui-craft` item 2 (lg 22 · md 15 · base 13 · sm 12 · xs 11 · smallest 11):

| Level | Size | |
|---|---|---|
| h1 · KPI number | 22px / 500 · KPI 600 | page title · KPI uses `letter-spacing:-.4px` + `tabular-nums` |
| h2 | 15px / 500 | card heading · app name in the sidebar |
| body · h3 | 13px / 1.6 · h3 bold 500 | body text · input · tab · menu · sub-heading |
| button · description under h1 | 12px | |
| label · pill · table header · faint | 11px | table headers are uppercase with letter-spacing .4px (English only) |

The default font is `Inter` + `Noto Sans Thai` — Inter is chosen because it reads easily at 11–13px in dense data screens (`graphic-design:design-by-type` item 6 says to give a reason when using a widely used font) · a project with a brand font uses the project's · **Inter has no Thai letters**; if you forget to add Noto Sans Thai
the browser uses a system font as fallback, whose height does not match, and Thai looks smaller and shorter than English.

Every number laid out in a column must use `.num` (`tabular-nums`), otherwise the digits will not line up.

## Data colors (charts) — always solid

`--c-blue #4a8ee0` · `--c-teal #2bbd8a` · `--c-amber #f0ad2e` · `--c-green #1f9d3f` ·
`--c-violet #6a5cc9` · `--c-red #e87f7c` · `--c-grey #c8ced9`
Plan/actual pair: `--c-plan #e0eaf8` vs `--c-actual #5a97e0` · overdue is defined as `--c-late #e58079`

## Pill (status) — three values as a set

| Tone | Background | Text | Line | Used for |
|---|---|---|---|---|
| green | `#e9f7ef` | `#17794a` | `#d6efe1` | done · normal |
| blue | `#eaf2fd` | `#2160ab` | `#d8e7fb` | review · in progress |
| amber | `#fdf5e4` | `#96660d` | `#f7e9c9` | waiting · warning |
| orange | `#fdefe6` | `#a2541b` | `#f8ddcb` | nearly overdue |
| red | `#fdedec` | `#a63a34` | `#f8d9d7` | stuck · error |
| violet | `#f1eefc` | `#52439f` | `#e3ddf8` | special type |
| grey | `#f2f4f8` | `#626a7a` | `#e7eaf1` | closed · not started |

## Layout

| Token | Value |
|---|---|
| `--sidebar-w` | `232px` (≤1024px shrinks to 64px · ≤720px becomes a 240px drawer) |
| `--topbar-h` | `56px` |
| `--content-max` | `1160px` |

Breakpoints: **1024px** the sidebar shrinks to icons · **720px** the sidebar becomes a drawer (`body.nav-open`)
If a table is wider than the screen, scroll horizontally **only inside `.tb-wrap`**; never let the whole page scroll.

## Switching theme / brand

**Switch the accent across the whole app** — `body[data-theme]`: empty (ocean `#226cc6`) · `emerald #097a54` · `sunset #b8501a` · `plum #7a4ee8` · `graphite #0a7a90`
Each theme changes only 4 tokens (`--brand --brand-2 --brand-50 --brand-100`) · every `--brand` passes 4.5:1 with white text · `--bg` · the theme's own `--brand-50`

**Light/dark sidebar** — `body[data-side='dark']` changes 9 sidebar tokens · the dark background is `--sidebar-dark-bg #1f2329`, a neutral gray, not tinted with the brand color
Active menu: light mode = a gray fill `--sidebar-active-bg` + a 3px brand-colored bar (`--sidebar-active-bar`) · dark mode = a translucent overlay `--on-brand-veil` + a white bar
The app frame is neutral — the brand color inside the frame appears only in the selection bar and the logo.

**For a new customer brand**, copy a `body[data-theme='…']` block and put in the customer's 4 values (if the customer's color is too bright → use a darker shade that passes 4.5:1 as `--brand`, and keep the original color for the logo and charts)
You do not touch a single line of any component.

## Ready-made component classes

| Group | Classes |
|---|---|
| Structure | `.app-shell` `.app-sidebar` `.nav-link(.on)` `.app-topbar` `.app-main > .inner` `.page-head` |
| Card | `.card` `.card-head` `.card-body` |
| KPI | `.stat-grid` `.card.stat` (`.label` `.value` `.foot`) |
| Status | `.pill.pill-green/blue/amber/orange/red/violet/grey` |
| Button | `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` |
| Form | `.field > label` `.input` `.select` `.textarea` `.err` |
| Table | `.tb-wrap > .tb` (`.right`) |
| Filter | `.chips > .chip(.on)` · `.tabs > .tab(.on)` |
| Other | `.prog > i` `.ava(.ava-lg)` `.md-html` `.empty` `.skeleton(.lg)` (loading content) `.spinner` (a short wait inside a button) `.toasts > .toast(.ok/.err)` `.backdrop + .modal` |
| Utility | `.row` `.row-between` `.col` `.grow` `.ellipsis` `.wrap` `.mt-*` `.mb-*` `.gap-*` `.num` `.muted` `.faint` |
