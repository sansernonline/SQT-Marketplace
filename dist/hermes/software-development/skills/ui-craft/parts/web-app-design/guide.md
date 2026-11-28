
# Web App Design

> **Gate before starting (every time) (`ด่านก่อนลงมือ`):** read the owner's theme → search live prototypes → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the "Gate before starting" section of `design-gate/design-references` (plugin `superuser`), even when a brand exists (the brand controls colors and fonts, while the search is for finding this piece's structure) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule:** every color in component code must come from a token.
> If a `#hex` shows up outside the token file, the design system has started to break, and it breaks silently.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Design this app screen", "dashboard", "admin panel", "SaaS screen mockup" | This file: sections 1–8 below |
| "Marketing page with scroll motion", "chapter-by-chapter story site", "3D background that moves per chapter" | [`references/dynamic-website.md`](references/dynamic-website.md). Its rule: with reduced motion on, all content stays visible, and no text fades out. |

## When to use this skill

- Building web app screens: dashboard, admin panel, internal tool, SaaS
- Wanting every page, made by different people, to look like one set
- Needing to support several brands or themes without touching component code
- Works with Angular / React / Vue / Svelte / plain HTML. It is pure CSS and tied to no framework.

## When **not** to use it

- A Windows desktop app: use `ui-craft` part `windows-app-design`
- A .docx/.pptx document: use `document-design`
- A marketing website or landing page, because this system is built for **apps** that pack in data.
  A 13px base text is too small for a sales page. For scroll-motion sales pages, use the dynamic-website row in "Pick the part".

---

## 1 · Working order: mockup first, always

> **The project already has screens → copy the existing pages by `ui-craft` item 0 and do not use appstrack** (unless the owner asked for a redesign, or the existing pages have not passed the beauty gate (`ด่านสวย`)) · the order below is for projects with no look yet, or being redesigned · appstrack gives only the component classes and fallback values. The look of the work comes from the `theme.css` produced by the search.

```
0. Visual direction by ui-craft item 0.1 (search prototypes by design-references, type web or dashboard, then extract colors · hero screen · reference apps · 3 directions · pick 1 · logo) → copy assets/theme-template.css to mockup/theme.css and fill the 4 groups of values in section 2 from the chosen direction, with the source of every value
   Pages with pictures (hero · product · service · team) → `graphic-design:image-artist` finds the pictures by image-generation into public/images/ before step 2 · never draw basic shapes yourself in place of real ones
1. Copy assets/mockup-template.html + assets/appstrack.css next to theme.css (fallback look: assets/mockup-template-preview.webp · not the goal)
   Choose the page structure (sidebar · top bar · 2-side split · single page with no menu) from the prototypes you found and the number of menu items in the app, not from the template's structure
2. Edit the content into the real page to build (do not touch app code yet)
3. python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 1440
   python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 900
   python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 420
4. Open the images and look at every width, fix until satisfied, and only then let others review
5. Convert to components only after approval: copy the existing classes, write no new CSS
6. Wire scripts/check-design-tokens.mjs into CI from day one
```

**The mockup is delivered as one file** (`mockup/<code>-mockup.html`, every screen a section) → before sending, embed the contents of `appstrack.css` followed by `theme.css` in `<style>` instead of `<link>` · check tokens with the mockup file as its own token file: `node scripts/check-design-tokens.mjs mockup/<code>-mockup.html mockup --ext html`

---

## 2 · Design tokens

> **The look comes from this job's search. Do not stop to ask.**
> Order for finding values: the client's brand colors and fonts (if they exist, use them at once) → prototypes searched live by `design-gate/design-references` and palettes extracted by `design-system` → `references/design-direction-lookup.md` item 2 → only if nothing can be searched at all (no internet · the user ordered the old look kept), use the fallback values in `assets/appstrack.css`, write `(รอยืนยัน)` (awaiting confirmation), and keep going.
> The table of work type versus color tone in `colour-by-domain` (`diagrams` → `references/colour-by-domain.md`) is a starting point for search terms, not an answer.
> **Brand colors must pass 4.5:1 for both white text on the brand background and the brand color on the page background.** If a client's color is too light, make a darker shade for `--brand` and keep the original color for the logo and charts.

**Which values are fixed and which come from the search**

| Group | token | Comes from | Fallback (appstrack) |
|---|---|---|---|
| Color | `--brand` `--brand-2` `--brand-50` `--brand-100` · background and text when the chosen direction needs them | Client brand → palette extracted from prototypes | `#226CC6` (a darker shade of `#2A78D6`) |
| Type | `--font` · `--fs-xs` … `--fs-xl` | Brand font → the Thai-Latin font pair that prototypes in the field use · base size by how dense the work is (data-packed 13 · reading-heavy 14–15) | Inter + Noto Sans Thai · 11/12/13/15/22 |
| Shape | `--radius` `--radius-sm` `--radius-pill` · `--shadow` `--shadow-lg` | The chosen direction (flat square · soft round · floating cards) | 14 · 9 · 99 · cards with no shadow |
| Layout | `--sidebar-w` `--topbar-h` `--content-max` | Number of menu items, how long menu names are, whether the main work needs wide space | 232 · 56 · 1160 |
| **Fixed for every job** | tokens only · contrast ≥ 4.5:1 · status colors by meaning · neutral app frame · 1 primary button per page · Thai rules in section 5 | System rules, independent of the job | — |

The job's values live in the single file `theme.css` (template `assets/theme-template.css`) · every line has a comment giving its source · do not edit `appstrack.css`, so the component classes can update along with the skill.

The 96 tokens are in the `:root` block of `assets/appstrack.css`, and the full details are in **`references/tokens.md`**.

**Changing the brand color of the whole app = editing 4 values** (`--brand --brand-2 --brand-50 --brand-100`).
The other colors are computed from or refer to these 4. If you need to edit a 5th color, something is hardcoded somewhere.

`assets/appstrack.css` ships 5 sample color sets (ocean · emerald · sunset · plum · graphite).
Switch them with `body[data-theme]`, and switch sidebar light/dark with `body[data-side='dark']` (dark = a neutral dark gray, not tinted with the brand color).
**These sets exist to test that the system can really change color, not as options to pick from.** The job's colors always come from `theme.css`.

**Status colors (success · warning · error) do not change with the brand.** Green always means pass, and red always means fail.

**The app frame is neutral** (by the owner's preference, and the `ui-craft` beauty gate, platform note): sidebar · topbar · borders · menu icons are gray-black · brand color goes on data, primary buttons, links, the 3px menu selection bar and the logo · tint the frame only when the user asks.

---

## 3 · Screen layout

The fallback structure is sidebar + top bar · for apps with few menu items (≤ 5) or a single-page job, choose the structure from the prototypes you found, such as top bar only or a 2-side split.

- Fallback diagram (sidebar 232px · topbar 56px · content max 1160px · stat-grid · cards): `references/layout-diagram.md`
- **The settings menu sits at the bottom of the sidebar** (`.foot` has `margin-top:auto`)
- **1 h1 per page**, always with a description under the h1. A page that does not say what it does is a page that is not finished.
- **1 primary button per page** (`.btn-primary`, solid brand color, no gradient, no shadow). The rest are `.btn` or `.btn-ghost`.
- **3–5 KPI cards.** More than that and the numbers get too small to stand out.
- Every number laid out in a column needs the `.num` class, or the digits will not line up.

---

## 4 · Components already provided

Shell `.app-shell/.app-sidebar/.app-topbar/.app-main` · card `.card/.card-head/.card-body` ·
KPI `.stat-grid > .card.stat` · status `.pill-*` in 7 tones · 4 kinds of button ·
form `.field/.input/.select/.textarea` · table `.tb-wrap > .tb` ·
filters `.chips/.tabs` · `.prog` · `.ava` · `.md-html` · `.empty` · `.skeleton` · `.spinner` ·
`.toasts/.toast` · `.backdrop + .modal` · utilities `.row/.col/.grow/.ellipsis/.num`

The full list with descriptions is at the end of `references/tokens.md`.

**Icons:** inline SVG stroke, 15px in the sidebar / 14px in buttons / 11px in pills.
Always use `stroke="currentColor"`, so the icon changes color with the state by itself.

---

## 5 · Thai language

- `--font` must always include a font that has Thai glyphs (the fallback `Inter` has no Thai, so `Noto Sans Thai` is chained on) · a font chosen from the search must be opened with real Thai text before use
- Line height 1.6 (body text) / 1.85 (`.md-html`). Thai needs more than English.
- **No justify** · **no `text-transform: uppercase` on Thai text** (it has no effect, but the
  `letter-spacing` that comes with it throws the tone marks off) · for Thai table headers, remove uppercase
- Thai buttons are about 20% wider than English ones, so do not fix button widths
- Test with real Thai text, not Lorem ipsum

---

## 6 · Check the work

```bash
# 1. Is the design system still clean?
node scripts/check-design-tokens.mjs src/styles.css src/app

# 2. Does the look still hold at every width?
python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 1440
python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 900
python <ui-craft>/scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 420
```

Then open the images and check:

- [ ] No hardcoded colors (the checker must show ✓)
- [ ] At 1024px the sidebar shrinks to icons, and at 720px it becomes a drawer with an open button
- [ ] A table wider than the screen scrolls only inside its frame, **not the whole page** (drag sideways and the sidebar must not move)
- [ ] The job's theme (`theme.css`) + sidebar light/dark: no text blends into the background · every value in `theme.css` has a source comment
- [ ] Thai text does not overflow buttons · tone marks do not collide with vowels
- [ ] Contrast ≥ 4.5:1 for every text-on-background pair, including white on `--brand` (`--text-faint` on `--bg` is the closest call at 4.65. Never make it paler · measure any new brand color before use)
- [ ] Tab reaches every control, and a focus ring shows at every point
- [ ] An empty state (`.empty`) wherever a list may be empty, and loading wherever there is a wait: content uses a `.skeleton` outline in the shape of the real thing · `.spinner` only for short waits inside a button or beside text, never in the middle of the screen

---

## 7 · Anti-patterns

- **`#hex` in component files.** The number 1 cause of a broken theme. Let the checker catch it.
- **Gradients on buttons, chips or charts · a frosted-glass topbar.** These are AI signals in `design-gate/no-ai-look`, and chart colors must stay fixed. Use solid `--brand` and `--c-*`.
- **Tinting the sidebar, topbar or borders with the brand color.** The app frame is neutral (section 2).
- **Shadows under cards.** Static cards do not float. Separate them with lines and shifted background shades. `--shadow` is for dropdowns and tooltips only · `--shadow-lg` is for modals and toasts only.
- **Several primary buttons on one page.** Users do not know what to press.
- **`overflow-x` on `<body>`** to fix an overflowing table. Fix it at `.tb-wrap`.
- **`alert()` / `confirm()`.** Use `.toast` and `.modal`.
- **Inventing new font sizes** outside the job's `--fs-*` (`ui-craft` item 2 · minimum 11 · ≤ 5 sizes per screen)
- **Sending a fallback-look mockup without searching.** Every job then looks like Apps Track. Use the fallback only when searching is impossible, and write `(รอยืนยัน)`.
- **A `.modal` with no `position` set.** It sinks under `.backdrop` and nothing can be clicked
  (the CSS already has a comment explaining this. Do not delete it.)
- **Sending a mockup that was never rendered and looked at**

---

## 8 · Link to other skills

| Need | Use together with |
|---|---|
| User flow / IA before coloring | agent `ux-designer` |
| A Windows desktop app in the same tone | `ui-craft` part `windows-app-design` |
| Screen spec document | `design-gate/polished-document-style` + `document-design` |
| Diagrams to go with the spec | `diagrams` |
| Spacing rules, visual order and the 5 states of a screen | `ui-craft` |
| Architecture diagrams | `diagrams` |

---

## Do not look AI-made

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script · every job must also pass the eye gate 3.2 (web pages answer items 10–14 too), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for every medium lives there.
