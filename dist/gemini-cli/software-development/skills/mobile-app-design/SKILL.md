---
name: mobile-app-design
description: Use when designing a phone app screen or mockup
---

# Mobile App Design

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending. Follow the "gate before starting" section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search is for the structure of this piece). Close the work with a line `ด่านก่อนลงมือ:`.

> **One rule:** a phone screen has half the room you think it has.
> Everything that is not content must go quiet until it is almost invisible.

## When to use this skill

- Making phone app screens: content lists, conversation/chat, result summary, settings, onboarding
- PWA · web wrapped as an app (Capacitor / Cordova / WebView) · React Native · Flutter
- Apps with a lot of content to read: language learning, article reading, online courses
- Must support mixed Thai–English

## When **not** to use it

- Desktop web apps (dashboard/admin): use `web-app-design`
- Windows desktop apps: use `windows-app-design`
- .docx/.pptx documents: use `branded-document-design`

---

## 1 · Work order: mockup first, always (except Flutter / native, see section 4.1)

> **The project already has screens → copy the existing pages per `ui-craft` section 0, and do not use speakgo** (unless told to redesign, or the existing pages have not yet passed the beauty gate). The order below is for projects with no look yet, or being redesigned. speakgo gives only component classes and fallback values. The look of the work comes from the `theme.css` produced by the search.

```
0. Visual direction per ui-craft section 0.1 (search references per design-references type app, then extract colours · hero screen · reference apps · 3 directions · choose 1 · logo) → copy assets/theme-template.css to mockup/theme.css and fill the 4 groups of values in section 2 from the chosen direction, with the source of every value
1. Copy assets/mockup-template.html + assets/speakgo.css next to theme.css (fallback look: assets/mockup-template-preview.webp · not the goal)
   Choose the navigation style (bottom tabs · drawer · single page) from the references found and the number of main tasks in the app. Do not follow the template.
2. Edit the content into real pages (do not touch the app code yet)
3. python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
   python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android
   python scripts/screenshot.py mockup/<code>-mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max
4. Open the images and really look at every size. Fix until satisfied, then let others review
5. Convert to real code only after approval. Use the same tokens; do not redesign
```

**The mockup is delivered as a single file** (`mockup/<code>-mockup.html`, every screen a section). Before sending, embed the content of `speakgo.css` followed by `theme.css` in `<style>` instead of `<link>`.

For Flutter / Android native, skip straight to **section 4.1**. Making an HTML mockup too is optional, but the images used for checking must come from the real app.

Opened on a desktop screen wider than 560px, the mockup shows as a **device frame floating on a dark background**.
You can send the link to the client without explaining that this is a phone screen.

---

## 2 · Design tokens

> **The look comes from this job's search. Do not stop to ask.**
> Order for finding values: the project's `doc-theme`, or brand colours and fonts (if they exist, use them at once) → app references found live per `design-references` (type app) and the palette extracted per `design-direction-lookup` section 2 → only if nothing can be searched (no internet · user says keep the existing look) use the fallback values in `assets/speakgo.css`, write `(รอยืนยัน)` (awaiting confirmation) and carry on.
> The table of work type and colour tone in `diagram-figures` section 5 is a starting point for search terms, not the answer.

**Which values are fixed and which come from the search**

| Group | token | Comes from | Fallback (speakgo) |
|---|---|---|---|
| colour | `--signal` `--signal-soft` · `--tile1` `--tile2` · background and text when the chosen direction needs it | client brand → palette extracted from industry app references | Speak Go sea green |
| fonts | `--ui` `--dis` `--text` `--mono` (keep the 4 roles; the font in each slot can change) | brand font → the Thai-Latin font pair the references use · tool apps may use system fonts (section 3) | IBM Plex Sans Thai · Space Grotesk · Source Serif 4 · system mono |
| shape | `--r-tile` `--r-card` `--r-field` `--r-pill` · `--shadow-card` `--shadow-float` | chosen direction | as in the speakgo file |
| layout | `--app-max` `--gutter` | target device size and how dense the work is | 430 · as in the file |
| **fixed for every job** | tokens only · contrast ≥ 4.5:1 · status colours by meaning · token names by role · mobile rules in section 4 (`100dvh` · safe area · touch targets 44/48) | system rules, independent of the job | none |

The values of the job live in a single `theme.css` (template `assets/theme-template.css`). Every line has a comment with its source. Do not edit `speakgo.css`.

All tokens are in `assets/speakgo.css`, and the full table is in **`references/tokens.md`**.

The role summary of the main tokens (background · 3 text levels · `--signal` · gradient tile · content status colours) is at the end of [`references/tokens.md`](references/tokens.md).

**Status colours do not change with the brand.** Red marks a place that needs fixing, whatever colour the brand is.
If the brand colour clashes with a status colour, avoid using the brand in that context. Do not change the status colour.

**Name tokens by role, not by colour.** Use `--repair`, not `--red`.
The day you decide that fix marks should be orange, you change one value and the name is still right.

`assets/speakgo.css` ships with one **fully built** colour set. It is a fallback for when searching is impossible, not the default for every job.

---

## 3 · The 4 font roles: the heart of this system (for apps with content to read)

What is fixed is the **4 roles**. The fonts in the table are fallbacks. Choose the job's fonts from the search (section 2) and put them in `theme.css`.

> Tool apps with no long reading content (meters, calculators, timers) may use system fonts.
> At most add one family for large numbers. Do not bundle 4 families and make the app file bigger for nothing.

| Token | Fallback font | Role |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | buttons, menus, labels, page titles: everything that is "the app" |
| `--dis` | Space Grotesk | large numbers: scores, stats |
| `--text` | Source Serif 4 | content the user must **read**: bubbles, example sentences |
| `--mono` | system mono | uppercase labels + `letter-spacing:.14em`: META · LEVEL · TURN 5/12 |

**For apps with content to read, do not collapse to one family.** Separate fonts let users tell "what the app says"
from "the app's buttons" at once without relying on colour, which matters a lot on a small screen.

`body[data-lang="en"]` switches `--ui` to Space Grotesk when the UI is all English.

---

## 4 · Screen layout

The screen layout diagram (`#app` at most 430px wide · `100dvh` · appbar · scrollable `.screen` · tabbar with 3–5 tabs · full-screen `.overlay` instead of a modal for long tasks) is in [`references/screen-and-components.md`](references/screen-and-components.md).

Rules that people coming from the web often get wrong when doing mobile:

- **`100dvh`, not `100vh`.** `vh` does not shrink with the browser address bar, so the bottom of the content gets covered.
- **`env(safe-area-inset-*)`** on the appbar/tabbar/dock + `viewport-fit=cover` in the meta viewport.
  Otherwise content collides with the top notch and the bottom home indicator.
- **Scroll on `.screen`, not on `body`.** Set `body{overflow:hidden}` so the top and bottom bars stay still.
- **There is no hover on mobile.** The only state users can see is `:active`. Everything tappable must shrink
  (`transform:scale(.98)`) and set `-webkit-tap-highlight-color:transparent`.
- **Touch targets ≥ 44×44 pt on iOS (Apple guideline) · ≥ 48×48 dp on Android (Material).** A 38px icon button needs enough padding around it to reach that. For apps shipping on both systems, use 48.
- **3–5 bottom tabs.** More than that, the thumb cannot reach and the labels get cut.

### 4.1 · Flutter / Android native

The table of 10 topics is in [`references/screen-and-components.md`](references/screen-and-components.md): tokens in `ColorScheme` + `ThemeExtension` · raw colour check with grep · second dark-mode set · images from the real app with `adb` · edge-to-edge + `SafeArea` · back swipe, rotation, 200 % text · permission requests · missing hardware · SnackBar in nested Scaffolds · `SegmentedButton`

---

## 5 · Ready-made components

The table of classes in `speakgo.css` (list · controls · settings · conversation · mic bar · result summary) is in [`references/screen-and-components.md`](references/screen-and-components.md).

**Conversation bubble:** 18px corners on every side, except the corner pointing toward the speaker, which drops to **5px**.
This shows who is speaking without drawing a bubble tail.

**Correction box (`.repair`):** use `<del>` strikethrough + `<ins>` underline.
It communicates even to colour-blind users. Never use colour alone.

---

## 6 · Thai on a small screen

- **IBM Plex Sans Thai**: tone marks do not collide with vowels at small sizes, and it has the full 400–700 weights.
- Line height **1.5–1.75**. Thai needs more than English, and the smaller the screen the more room it needs.
- **Never use `text-transform:uppercase` on Thai text.** It has no effect on Thai characters, but
  the `letter-spacing` that usually comes with it distorts tone marks. Use mono labels for English only.
- Thai buttons are ~20% wider than English ones. Do not fix button widths. Make the primary button full width.
- Test with real Thai text, not Lorem ipsum.

---

## 7 · Review

Capture images at 3 sizes (390×844 · 360×800 · 430×932) and run the token checker of `web-app-design` with `--require` set to this system's set (the command and the 10-item checklist are in [`references/review.md`](references/review.md)). Then really look at the images. The only raw colour allowed is `<meta name="theme-color">`.

---

## 8 · Anti-patterns

The 9 prohibitions (`100vh` · forgetting safe-area · 6+ tabs · small modal for a long task · collapsing fonts · gradient behind long text · colour alone · no `:active` · never rendering to look) are in [`references/review.md`](references/review.md).

---

## 9 · Limits to know

The 3 limits are in [`references/review.md`](references/review.md): the React Native table has not been built and tested · a real app must bundle fonts · `speakgo.css` has light mode only.

---

## 10 · Links to other skills

- User flow or information architecture before colouring: agent `ux-designer`
- Desktop web app of the same system, and the hardcoded colour checker in CI (`scripts/check-design-tokens.mjs`): `web-app-design`
- Spec document of the screens: `polished-document-style` + `branded-document-design`
- App Store Optimization: `mobile-engineering`
- Spacing rules, eye order and the 5 screen states: `ui-craft`
- Architecture diagrams: `software-diagrams`

---

## Do not look AI-made

Before sending, walk through section 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 as well), because a script score of 0 is not yet a pass.
