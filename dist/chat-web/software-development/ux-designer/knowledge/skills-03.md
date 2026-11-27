# skill: mobile-app-design

Use when designing a phone app screen or mockup

# Mobile App Design

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the "gate before starting" section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search is for the structure of this piece). Close the work with a line `ด่านก่อนลงมือ:`.

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
- .docx/.pptx documents: use `document-design`

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
> Order for finding values: the project's `doc-theme`, or brand colours and fonts (if they exist, use them at once) → app references found live per `design-gate/design-references` (type app) and the palette extracted per `design-system` → `references/design-direction-lookup.md` section 2 → only if nothing can be searched (no internet · user says keep the existing look) use the fallback values in `assets/speakgo.css`, write `(รอยืนยัน)` (awaiting confirmation) and carry on.
> The table of work type and colour tone in `diagrams` → `references/diagram-figures.md` section 5 is a starting point for search terms, not the answer.

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
- Spec document of the screens: `design-gate/polished-document-style` + `document-design`
- App Store Optimization: `mobile-engineering`
- Spacing rules, eye order and the 5 screen states: `ui-craft`
- Architecture diagrams: `diagrams`

---

## Do not look AI-made

Before sending, walk through section 3 of `design-gate/no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 as well), because a script score of 0 is not yet a pass.


## reference: review.md

# Review, anti-patterns and limits — extension of `mobile-app-design`

Open this when doing items 7 · 8 · 9 of `SKILL.md`.

## Review commands and checklist (item 7)

```bash
# 1. หน้าตาถูกทุกขนาดจอไหม
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android เล็ก
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max

# 2. ระบบดีไซน์ยังสะอาดอยู่ไหม (ใช้ตัวตรวจของ web-app-design ได้เลย
#    แต่ต้องส่ง --require เป็น token ชุดของระบบนี้ ไม่ใช่ชุดของเว็บ)
# คัดลอก check-design-tokens.mjs จาก plugin software-development (skills/web-app-design/scripts/) ไปไว้ที่ tools/ ในโปรเจกต์ก่อน แล้วรัน:
node tools/check-design-tokens.mjs src/theme.css src/app \
  --require "--bg,--surface,--ink,--soft,--faint,--line,--signal,--repair,--hint,--ui,--dis,--text,--mono,--r-tile,--r-card,--app-max,--gutter"
```

> The only exception where a raw color is allowed: `<meta name="theme-color">` in `index.html` —
> the browser reads meta before CSS loads, so `var()` cannot be used.

Open the screenshots and check by eye:

- [ ] Top/bottom bars are not covered by the notch or home indicator
- [ ] When scrolling, top/bottom bars stay fixed and do not scroll with the content
- [ ] At 360px (small Android) tab labels do not break mid-word and tiles do not overflow
- [ ] Every button is really tappable: ≥ 44×44 pt (iOS) · 48×48 dp (Android)
- [ ] Thai text does not overflow buttons, and tone marks do not collide with vowels
- [ ] Contrast ≥ 4.5:1 (`--faint` on white is the closest call — use it for supporting text only)
- [ ] An empty state (`.blank`) exists wherever a list can be empty
- [ ] Switch every theme the app has (e.g. light/dark · plain/gradient) and no text blends into the background
- [ ] Every input channel that depends on hardware has a fallback (e.g. a speaking app has a "พิมพ์แทนพูด" ("type instead of speaking") path; an app that uses a sensor lets the user use the camera or enter data by hand)
- [ ] A denied permission and missing hardware each have a screen that says so and offers a way forward

## Anti-patterns (item 8)

- **`100vh`** — use `100dvh`
- **Forgetting `env(safe-area-inset-*)`** or forgetting `viewport-fit=cover`
- **Cramming 6+ tabs into the bottom bar** — 3–5 is enough; put the rest on a "เพิ่มเติม" ("More") page
- **A small modal for a long task** — use the full-screen `.overlay`
- **Collapsing to one font family in an app that has content to read** — users can no longer tell content from chrome (the app's bars, buttons, menus)
- **A gradient behind long text** — gradients go on chrome and primary buttons only
- **Relying on color alone to carry meaning** — `del`/`ins` already have their own strike/underline styles
- **No `:active` feedback** — mobile has no hover; if nothing moves on press, users press again
- **Handing over a mockup that was never rendered at real size**

## Limits to know (item 9)

- All values were **verified on HTML/CSS** — the React Native table in `references/tokens.md`
  **has not been built and tested**. Flutter has been used with the item 4.1 approach on 1 real app (Lumio).
  The values transfer directly, but check the real screen on a device once more.
- Fonts load from Google Fonts in the mockup — a real app should bundle the font files.
  Otherwise on first launch with a slow network the user sees the system font first, then a visible jump.
- `assets/speakgo.css` has **light mode only** — dark mode needs a complete new set of every token
  (the `--bg`/`--surface` backgrounds swap order and `--ink` must not be pure white), then check AA contrast on every pair.


## reference: screen-and-components.md

# Flutter screen layout and components: extension of `mobile-app-design`

Open this when laying out screens (section 4), working on Flutter / Android native (section 4.1), or looking for a class in `speakgo.css` (section 5).

## Screen layout (section 4)

```
┌─────────────────────────┐  #app  max-width 430px · 100dvh
│ .appbar                 │  padding-top + safe-area-inset-top
│   h1 24/700             │
│   .sub  mono 10 UPPER   │
├─────────────────────────┤
│ .screen.on  (scrolls)   │  ← several .screen elements, switched by the .on class
│   .chips  (scrolls →)   │
│   .tiles  2 columns     │
│   .card / .sg           │
│   .cta                  │
├─────────────────────────┤
│ .tabbar  3–5 tabs       │  padding-bottom + safe-area-inset-bottom
└─────────────────────────┘

.overlay.on = full-screen overlay for long tasks (conversation, quiz)
              use it instead of a modal, because these tasks do not finish in 3 seconds
```

## Flutter / Android native (section 4.1)

| Topic | Do this |
|---|---|
| token | Keep the main colours in `ColorScheme` (`ColorScheme.fromSeed`, then `copyWith`). Keep semantic colours that Material does not provide in our own `ThemeExtension`. Spacing is a constant in a single theme file. Real example: `lib/core/theme.dart` of the Lumio app |
| raw colour check | The `web-app-design` checker does not catch Dart. Use `grep -rn -e "Color(0x" -e "Colors\.[a-z]" lib --include=*.dart`, and matches must appear only in the theme file |
| dark mode | Build a full second set of tokens (not an automatic colour inversion). Then check the contrast of every text/background pair so both sets pass AA (≥ 4.5:1). Start with `ThemeMode.system` |
| screenshots | Capture the real app with `adb exec-out screencap -p > _to_delete/screenshots/<name>.png` in both light and dark mode. A 360×800 dp screen is the smallest one to check |
| screen edges | Edge-to-edge (forced on Android 15 and up): wrap content in `SafeArea` and set the status bar and navigation bar icon colours to match the theme (`SystemUiOverlayStyle`) |
| system behaviour | The system back swipe must go to the previous page, not close the app mid-task (`PopScope`). Rotating the screen must not break anything, or you may lock portrait on purpose. With the system font size at 200 % (`textScaler`), text must not overflow and must not cut off important numbers |
| permissions | Explain on a page first (1 card, 1 button) → ask for the permission only when the user taps → separate "denied" (can ask again) from "blocked" (a button opens the app settings page) → check again when the user returns to the app |
| missing hardware | If the device has no sensor or the camera is unusable, show a screen that says so and offers another option. Never show a blank screen or 0 |
| SnackBar | With nested Scaffolds (tabs inside a main Scaffold), the SnackBar appears on the root Scaffold and covers the bottom button of the tab page. Fix it by giving each tab its own `ScaffoldMessenger`, or move the button to that page's `bottomNavigationBar` |
| segmented choice | With Material 3 `SegmentedButton` and 3 Thai labels on a 360 dp screen, use `showSelectedIcon: false` and short labels |

## Ready-made components (section 5)

| Group | Main classes |
|---|---|
| list | `.tile` (gradient tile) · `.card` · `.sg` (row + progress bar) · `.heart` · `.lvl` |
| controls | `.chips/.chip` · `.lvlchip` · `.cta` · `.outline` · `.seg` · `.iconbtn` |
| settings | `.group > .r2 / .rcol` (one card, rows split by lines, iOS style) |
| conversation | `.turn.ai/.me > .bub` · `.repair` (`del`/`ins`) · `.hintbox` · `.acts/.actbtn` · `.dots` |
| mic bar | `.dock` · `#mic(.live/.busy)` · `.typerow` · `#interim` |
| result summary | `.score` · `.mini` · `.bar` · `.verdict` · `.wk` · `.stat` |


## reference: tokens.md

# Token reference — Speak Go-style mobile app design system

> Warning: **the color values in this file are a finished example, not a standard.**
> Always pick colors from the work itself first (see `SKILL.md` item 2 · Design tokens).
> What to take from this file is **the list of tokens and their roles**, not the values.
> Colors, fonts, radii, shadows and widths are fallbacks. The project's values live in `theme.css` (`SKILL.md` item 2) · spacing, type sizes and breakpoints follow this file.

All definitions are in `assets/speakgo.css`, in the `:root` block.
**Nothing below the `=== base ===` line may contain a raw color** — the same checker as `web-app-design` works here.

## Contents

1. [Colors](#colors)
2. [Fonts — 4 families, 4 roles](#fonts--4-families-4-roles)
3. [Type scale](#type-scale)
4. [Shapes](#shapes)
5. [Layout and safe area](#layout-and-safe-area)
6. [Themes](#themes)
7. [Moving to another stack](#moving-to-another-stack)
8. [Ready-made classes](#ready-made-classes)

---

## Colors

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#F2F4F6` | Screen background — light gray, not white, so cards stand out |
| `--surface` | `#FFF` | Cards · bottom bar · input fields |
| `--ink` | `#131A21` | Main text · primary button background · user bubble |
| `--soft` | `#66727E` | Secondary text · descriptions |
| `--faint` | `#98A3AD` | Labels · meta · inactive icons |
| `--line` | `#E2E7EB` | Borders · progress bar track |
| `--signal` | `#2A78D6` (house default, used when there is no brand color) | Selected tab · progress · mic while recording · for a button background with white text use `--signal-strong` instead (white on `#2A78D6` gives only 4.42:1, below 4.5:1) |
| `--signal-strong` | `#226CC6` | Button background with white text (white on this color is 5.21:1) — if there is a brand color, use a brand color dark enough for white text to reach ≥ 4.5:1 |
| `--signal-soft` | `#E8F1FB` | Level badge background |
| `--repair` / `-bg` | `#C0392B` / `#FBEDEB` | Spots that need fixing |
| `--hint` / `-bg` | `#8A6D1F` / `#FBF4E3` | Hints |
| `--fav` | `#D9455F` | Heart / like |
| `--tile1` → `--tile2` | `#0B7076` → `#4338A8` | Gradient on category tiles |

> Token names follow the **role**, not the color — `--repair`, not `--red`.
> If you later decide "spots that need fixing" should be orange, you change it in one place and the name is still correct.

## Fonts — 4 families, 4 roles

This is what sets this system apart from ordinary apps. **Do not collapse it to one family.**

| Token | Font | Used for |
|---|---|---|
| `--ui` | IBM Plex Sans Thai | All controls — buttons, menus, labels, page titles |
| `--dis` | Space Grotesk | Large numbers — scores, stats (`.score b`, `.mini b`, `.stat b`) |
| `--text` | Source Serif 4 | Content the user must **read** — bubbles, example sentences |
| `--mono` | system mono | Uppercase labels + `letter-spacing:.14em` — META, LEVEL, TURN 5/12 |

`body[data-lang="en"]` switches `--ui` to Space Grotesk
(IBM Plex Sans Thai has Latin letters, but they look less crisp when no Thai is mixed in).

**Why serif for bubbles:** for content read at length and re-read, serif separates letters better,
and it tells "what the app says" apart from "the app buttons" at once, without using color.

## Type scale

| Size | Family | Used for |
|---|---|---|
| 60 / 44 | dis | Big score · verdict |
| 24 | ui 700 | Page title in appbar |
| 19–24 | dis 700 | Stat numbers |
| 17 | text | Conversation bubble |
| 15.5–16 | text | Example sentences · edit box |
| 16 | ui 600 | Item title in a card |
| 15 | ui | Input fields · primary button |
| 13–14 | ui | Body text · secondary button |
| 11–12 | ui | Descriptions · labels |
| 9–10 | mono uppercase | meta · LEVEL · speaker name |

## Shapes

| Token | Value | Used for |
|---|---|---|
| `--r-tile` | 16px | Tiles · stat cards · CTA buttons |
| `--r-card` | 18px | List cards · bubbles · large boxes |
| `--r-field` | 13px | Input fields · outline buttons |
| `--r-pill` | 22px | Chips · search field |
| — | 50% | Icon buttons · heart · mic |

**Conversation bubbles** use 18px on every corner **except** the corner pointing at the speaker, which is **5px**
(`border-bottom-left-radius` on the AI side · `border-bottom-right-radius` on the user side).
This shows who is speaking without drawing a bubble tail.

## Layout and safe area

| Item | Number |
|---|---|
| Max app width | 430px (iPhone Pro Max) |
| Left/right margin | 16px (`--gutter`) on every page |
| Mic button | 66px |
| Icon button | 38px |
| Tile | min height 118px · 2 columns, gap 8px |
| Tab bar | icon 22px + label 10px |

> 9–10 type is allowed only for English mono labels in the mockup, because in a real app the smallest is 11.

**Safe area — never forget it**, or content will hit the notch at the top or the home indicator at the bottom:

```css
.appbar  { padding-top:    calc(12px + env(safe-area-inset-top)); }
.tabbar  { padding-bottom: calc(8px  + env(safe-area-inset-bottom)); }
.dock    { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
```
The page also needs `<meta name="viewport" content="…,viewport-fit=cover">`, otherwise `env()` is 0.

Use **`100dvh`**, not `100vh` — `vh` does not shrink for the browser address bar on mobile,
so the bottom part of the content gets covered.

## Themes

| Theme | Enabled by | What differs |
|---|---|---|
| Plain (default) | — | chrome (the app bars and buttons) white/gray · blue accent (`--signal` = `#2A78D6`) |
| Gradient | `body[data-theme="grad"]` | appbar/ovbar/CTA/mic/user bubble are gradients · `--signal` changes to purple · score is gradient text |

**Rule of the gradient theme:** gradients go on **chrome and primary buttons** only. The content area stays plain.
If a gradient sits behind long text, it is hard to read and the contrast cannot be controlled.

## Moving to another stack

CSS is the source. The same values work everywhere — what needs care is the mechanism, not the numbers.

| Topic | React Native | Flutter |
|---|---|---|
| token | a `tokens.ts` file as an object, then import it (no CSS variables) | `ThemeExtension` or an `AppTokens` class of constants |
| safe area | `react-native-safe-area-context` → `useSafeAreaInsets()` | `SafeArea` / `MediaQuery.padding` |
| fonts | link the font files into the project; there is no automatic fallback | `pubspec.yaml` → `fontFamily` |
| gradient | `expo-linear-gradient` | `BoxDecoration(gradient: LinearGradient(...))` |
| shadow | `shadowColor/Offset/Opacity/Radius` (iOS) + `elevation` (Android) | `BoxShadow` |
| uneven corners | `borderBottomLeftRadius` etc. | `BorderRadius.only(...)` |
| shrink on press | `Pressable` + `Animated.spring` scale .98 | `InkWell` / `AnimatedScale` |
| tabular numbers | `fontVariant: ['tabular-nums']` | `FontFeature.tabularFigures()` |

> **Limit to know:** the numbers in this table were verified on HTML/CSS only.
> The RN/Flutter column is a mechanism comparison that **has not been built and tested** — the values transfer, but check the real look on a device once more.

## Ready-made classes

| Group | Classes |
|---|---|
| Structure | `#app` `.appbar` `.screen(.on)` `.tabbar > .tab(.on)` `.overlay(.on)` `.ovbar` |
| Lists | `.tiles > .tile` `.card` `.sg` `.heart(.on)` `.lvl` `.grouphead` `.welcome` `.blank` |
| Controls | `.chips > .chip(.on)` `.lvlchip(.on)` `#search` `.iconbtn` `.cta(.alt)` `.outline(.danger)` `.seg > button(.on)` |
| Settings | `.sect` `.group > .r2 / .rcol` |
| Conversation | `#thread` `.turn(.ai/.me)` `.who` `.bub(.masked)` `.repair` `del` `ins` `.note` `.tag` `.clean` `.hintbox` `.acts > .actbtn(.hintb)` `.sys` `.dots` |
| Mic bar | `.dock` `#interim` `.dockrow` `#mic(.live/.busy)` `.typerow(.on)` `.txtbtn` |
| Result summary | `.report` `.score` `.mini` `.bar` `.verdict` `.wk` `.stat` `.g4` `.drillrow` `.fixrow` `.dnote` |

## Role summary of the main tokens

| Token | Role | Comes from |
|---|---|---|
| screen / card background | The background is **light grey, not white**, so cards lift up without needing a shadow | very light grey / white |
| 3 text levels | primary · secondary · faint | from dark to light; primary text needs contrast ≥ 4.5:1 |
| `--signal` (accent) | selected tab · progress · primary button | `doc-theme` → brand colour → if none, `#2A78D6` + `(รอยืนยัน)` |
| gradient tile | the two ends of the gradient | main colour → a neighbouring colour on the colour wheel |
| content status colours | needs fixing · hint · liked: **each has a matching soft background** | by meaning, not by brand |


---

# skill: windows-app-design

Use when building a native-looking Windows 11 app

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
- For .docx/.pptx documents, use `document-design`
- For diagrams in documents, use `diagrams`

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
> (The table for choosing a color tone by subject matter is in `colour-by-domain` (`diagrams` → `references/colour-by-domain.md`).)
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
| spec document of the screen | `design-gate/polished-document-style` + `document-design` |
| choosing the app architecture | `architecture` |
| spacing rules, visual order, and the 5 states of a screen | `ui-craft` |
| architecture diagram | `diagrams` |

---

## Do not look AI-made

Before sending, go through item 3 of `design-gate/no-ai-look`. For HTML work, run its script. Every job must also pass the eye gate 3.2 (web pages answer items 10–14 as well), because 0 items from the script is not yet a pass.


## reference: frame-and-components.md

# Window frame and components in fluent.css: extension of `windows-app-design`

Open when laying out a settings page/dashboard (item 3) or looking for ready-made classes (item 4) · for data-dense tool apps see `patterns.md`

## Window frame, settings page and dashboard (item 3)

```
┌──────────────────────────────────────────────── 48px title bar ─┐
│ ชื่อแอป (12px)                              ─  □  ✕  (46×48)    │
├──────────────┬──────────────────────────────────────────────────┤
│ ☰            │  ชื่อหน้า            Title 28/36                  │
│ 320px        │  คำอธิบายหนึ่งบรรทัด  Body 14/20 สีรอง             │
│              │                                                  │
│ ▍เมนูที่เลือก │  หัวข้อกลุ่ม         Subtitle 20/28    ┌─ rail ─┐ │
│  เมนูอื่น     │  เนื้อหา…                              │ ลิงก์   │ │
│              │  ← กว้างไม่เกิน 1064px →                │ ช่วยเหลือ│ │
│              │                                        └────────┘ │
│ ⚙ ตั้งค่า     │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
   ↑ ล่างสุดเสมอ        ↑ ขอบซ้าย/ขวา 36px · ระยะระหว่าง section 40px
```

## Components already in fluent.css (item 4)

| Element | Class | Note |
|---|---|---|
| Title bar + window buttons | `.win-titlebar` | Electron: `-webkit-app-region: drag` is already included |
| NavigationView | `.win-nav` / `.nav-item.selected` | Collapses to icons automatically below 1008px |
| Card | `.win-card` | |
| Windows-style settings row | `.win-setting` | Icon + name + description + control on the right |
| InfoBar | `.win-infobar.success/caution/critical` | **Always use it instead of `alert()`** |
| Status pill | `.win-pill.success/caution/critical` | |
| KPI | `.win-kpis .kpi` | 3–5 slots · more than that and the numbers get too small to stand out |
| Toggle switch | `.win-toggle` | |
| Table | `.win-table` | |
| Link | `.win-link` | accent-text colour, not accent |


## reference: patterns.md

# Common screen patterns: Windows apps

> Tokens and size rules are in `tokens.md` · this file answers the question **how to lay out a screen so it looks like a real app**
> Every pattern has a clickable example in `assets/tool-app-template.html` (tool apps) or `assets/mockup-template.html` (settings page/dashboard)

Background: screens that pass every item of the checklist (tokens right, sizes right, contrast passes) but still look like a wireframe
usually repeat the same 6 mistakes: solid buttons on every row · no icons · the bottom half of the screen empty · tiny uppercase group headings · web-style coloured badges · bordered boxes over the whole page.
The patterns in this file fix all 6.

**Contents**

- [0 · Choose the structure before drawing](#0--choose-the-structure-before-drawing)
- [1 · Lists with buttons in each row](#1--lists-with-buttons-in-each-row)
- [2 · List + detail panel (list-detail)](#2--list--detail-panel-list-detail)
- [3 · Command bar](#3--command-bar)
- [4 · Group headings in a list](#4--group-headings-in-a-list)
- [5 · Tabs in the title bar (Windows Terminal style)](#5--tabs-in-the-title-bar-windows-terminal-style)
- [6 · Icon rail](#6--icon-rail)
- [7 · Status bar](#7--status-bar)
- [8 · Start page (welcome / start)](#8--start-page-welcome--start)
- [9 · Icons: where they are required](#9--icons-where-they-are-required)
- [Check by eye: countable, no gut feeling](#check-by-eye-countable-no-gut-feeling)

---

## 0 · Choose the structure before drawing

| What kind of app | Structure | template |
|---|---|---|
| Settings · dashboard · an app opened only now and then | NavigationView 320px + content no wider than 1064px | `mockup-template.html` |
| Data-dense tool (terminal client · file manager · admin tool) | icon rail 48px + list + detail panel 360px | `tool-app-template.html` |
| Several documents open at once (editor · terminal · browser) | Tabs in the title bar, Windows Terminal style | `tool-app-template.html`, title bar part |

**Never use the settings-page template to make a tool app.** You get a screen where the content floats in the top half and the right side is empty

### 0.1 · Compare with real apps on Windows 11 and WinUI 3 controls

Adapted from microsoft/winappCli `winui-design` (MIT · LICENSE checked in the repo copy on 23 Oct 2026). Use it when choosing the structure, and when handing a mockup to the person writing XAML so they need not guess control names

**Choose a real-app model before laying out.** Whichever row is closest to the app you will make, follow that structure

| What kind of app | Main controls (WinUI 3) | Real app to look at as an example |
|---|---|---|
| Settings · config | `NavigationView` on the left + `SettingsCard` / `SettingsExpander` | Windows Settings |
| Editing documents or sessions | `TabView` + content filling the window, minimal chrome | Windows Terminal · Notepad · VS Code |
| Browsing a layered structure | `TreeView` + `ListView` + `BreadcrumbBar` | File Explorer · Outlook |
| Developer tools · dashboard | `NavigationView` + cards | Dev Home · GitHub Desktop |
| Single-purpose tool | Mode switcher + dense button grid | Calculator · Snipping Tool |
| Media · canvas · large images | `Grid` with a hero surface + floating buttons, **no** `NavigationView` | Photos · Clipchamp |

**Turn requirements into controls.** This guards against web instincts (`<select>` · `<input type=date>` · WPF's DataGrid)

| Need | Use |
|---|---|
| Navigate 2–7 categories | `NavigationView` · document tabs → `TabView` · path → `BreadcrumbBar` · 2–3 modes → `SelectorBar` |
| Vertical list · tile grid · tree | `ListView` · `GridView` or `ItemsRepeater` + `UniformGridLayout` · `TreeView` |
| Data table | `ListView` whose `ItemTemplate` is a `Grid`, + the table header as another `Grid`. WinUI 3 has no `DataGrid`, and the CommunityToolkit one cannot use `x:Bind` in columns |
| List + detail | `ListView` + a `Grid` on the detail side |
| Enter text · numbers · search · dates · on/off | `TextBox` · `NumberBox` · `AutoSuggestBox` · `CalendarDatePicker` · `ToggleSwitch` |
| Choose 1 of 2–3 · choose 1 of 4 or more | `RadioButtons` · `ComboBox` |
| Must decide before continuing · context menu · first-time tip | `ContentDialog` · `Flyout` / `MenuFlyout` · `TeachingTip` |
| In-page status · in progress | `InfoBar` (matches the rule InfoBar instead of `alert()` in item 4 of SKILL.md) · system notification → `AppNotification` |

**Initial window size.** WinUI 3 has no `SizeToContent`. If not set, you get about 1024×768, which is too big for most tools. Compute it in the `MainWindow` constructor

| Value | How to work it out |
|---|---|
| Width | The widest row + 48 (margins), then round up to a multiple of 20 |
| Height | 32 (title bar) + the height of every row + every gap + 48 (margins), then round up to a multiple of 20 |
| Which way to round | Always up: clipped content is worse than a slightly wide window |
| Ranges you usually get | Single-purpose tool 440–560 wide · single-page form 600–800 × 640–800 · nav + content 1100–1300 × 720–840 · media or document editor 1280+ wide |
| Trap | `AppWindow.Resize` takes **real pixels**, not DIPs; multiply by the screen's DPI scale (`GetDpiForWindow(hwnd) / 96.0`) · never set `Width`/`Height` on the root `Grid`, because that clips content and does not shrink the window |

So our HTML mockup should set `width`/`height` of `.window` per this rubric, not always fill the viewport

---

## 1 · Lists with buttons in each row

```
ผิด: ทุกแถวมี [Connect] สีทึบ + [Edit]       → ปุ่มทึบ 8 ปุ่มแย่งกันเด่น
ถูก: ชื่อ · ข้อมูล · เวลา         ▷ ✎ ⋯       → ไอคอนโผล่เมื่อชี้หรือเลือกแถว
   ปุ่มหลัก (สีทึบ) อยู่ที่แผงรายละเอียดของแถวที่เลือก · ดับเบิลคลิก = ทำงานหลัก
```

- Buttons in a row: `btn subtle icon` 32×32 · hide with `visibility: hidden` (not `display: none`, otherwise columns shift)
- The button column has a fixed width (about 112px for 3 buttons), otherwise the "Latest" column will not line up with the buttons
- Selected row: `--win-subtle-selected` fill + a 3px accent bar flush left

## 2 · List + detail panel (list-detail)

Use when the window is ≥ 1100px wide and the list has more data than a single row can show

- The right panel is 360px wide, `--win-card` fill · 24px padding · 24px gap between parts
- Top to bottom: 48px icon + 20px name → primary button (stretched full row) + secondary button → name/value pairs (label 112px) → history (32px rows with dividers) → notes
- When the window is narrower than 1100px, hide the panel and open it as a new page instead

**A screen more than half empty is the signal to use this pattern,** not a signal to stretch the table

## 3 · Command bar

```
[+ สร้างใหม่] [📁 กลุ่มใหม่] │ [⇥ นำเข้า] [↦ ส่งออก]          [ทั้งหมด|SSH|RDP]  [🔍 กรอง…]
```

- Every button is subtle + 16px icon + text · separate groups with a 1×20px vertical line
- No solid button in the command bar if the page has a detail panel (the primary button lives in the panel)
- The search box is flush right, 240–320px wide · has a magnifier icon in front

## 4 · Group headings in a list

```
ผิด: PRODUCTION · 3      (11px ตัวพิมพ์ใหญ่ สีจาง — แบบเว็บ)
ถูก: ⌄ Production  3     (14px semibold · ตัวเลขสีรอง · แถว 32–40px · กดพับได้)
```

## 5 · Tabs in the title bar (Windows Terminal style)

- Tabs are 32px tall, flush with the bottom of a 40px title bar · 8px top corners
- The selected tab = the same fill as the content below (so they look like one sheet) · other tabs have a transparent fill
- Status is shown with an 8px dot + text/tooltip, **never a coloured line on the tab** (it looks like an error)
- At the end of the tabs there are `+` and `⌄` (tab list)

## 6 · Icon rail

- 48px wide · 40×40 buttons · 18px icons · 4px apart
- Selected: `--win-subtle-selected` fill + a 3×16px accent bar flush left
- Settings always at the very bottom · every button has a `title` (tooltip) because there is no text

## 7 · Status bar

- 24px tall · 12px text in secondary colour · 16px apart
- Status uses a 6–8px dot + text, **never a solid-colour badge** (that is a web style) · the "colour power" axis of the `ui-craft` beauty gate already exempts this item for Windows (colour comes through the selection bar · the hero screen · the main Key Performance Indicator (KPI) numbers · the primary button)

## 8 · Start page (welcome / start)

> This item applies to the start page inside the app. The first page of a mockup (`#s-start`), which reviewers open as a table of contents, may use cards with thumbnails; see `ui-craft` → `references/mockup-start-page.md`

- Content no wider than 1064px, centred · at the top is a single search box that does both search and connect (do not split into 2 boxes)
- Shortcuts are 40px-tall button rows (icon + text + hotkey), **not 4 big cards**
- At most 2 bordered boxes (for example Recent · Favourites) · news is a 40px neutral-fill strip, not in the brand colour

## 9 · Icons: where they are required

| Where | Required | Size |
|---|---|---|
| Buttons in nav / rail | ✓ | 16 / 18px |
| Buttons in the command bar | ✓ together with text | 16px |
| Buttons in a row | ✓ icon only + tooltip | 16px |
| Item type (SSH · file · RDP) | ✓ in a 24px box with 4px corners | 14px |
| Detail panel header | ✓ 48px box with 8px corners | 24px |
| Primary button in a dialog | Not required | — |

Commonly used codes (Segoe Fluent Icons): add `E710` · search `E721` · settings `E713` · edit `E70F` · more `E712` · play/open `E768`
· folder `E8B7` · new group `E8F4` · import `E8B5` · export `EDE1` · terminal `E756` · screen `E7F4` · link `E71B` · key `E8D7`
· clipboard `E77F` · globe `E774` · history `E81C` · star `E734` / `E735` · home `E80F` · down arrow `E70D` · right arrow `E76C` · close `E8BB`

---

## Check by eye: countable, no gut feeling

| Item | Passes when |
|---|---|
| Solid accent-colour buttons | ≤ 1 per screen (`grep -c "btn primary"` per section) |
| Icons | Present everywhere in the table of item 9 |
| Empty space | Content uses ≥ 60% of the window height at 1440×900, or has a reason (a deliberately empty page) |
| Row height | Rows of the same kind have equal height on every card in the page |
| Bordered boxes | ≤ 3 boxes per page · no box inside a box |
| Mockup controls | Not in the image (`screenshot.py --hide`) |


## reference: review.md

# Review, critique, prohibitions and limits: extension of `windows-app-design`

Open when doing items 6 · 7 · 8 of `SKILL.md`

## Token checker command (item 6)

```bash
# ไฟล์ token แยก (web-wrapped · mockup ที่ยังวางคู่ fluent.css)
node ../web-app-design/scripts/check-design-tokens.mjs src/fluent.css src --ext html,css,ts,tsx \
  --marker "Type ramp" \
  --require "--win-bg,--win-layer,--win-card,--win-text,--win-text-secondary,--win-accent,--win-on-accent,--win-divider,--win-control-stroke,--win-radius,--win-radius-card,--win-font,--win-nav-w,--win-titlebar-h,--win-gutter"
# mockup ไฟล์เดียว: ใช้ไฟล์ mockup เป็นไฟล์ token เอง (token ฝังอยู่ใน <style>) · --require ชุดเดิม
node ../web-app-design/scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html --marker "Type ramp" --require "…"
```

  If the app adds its own tokens (for example `--telex-…`) → append them to `--require` too · name the sections in the mockup page starting with `s-` (`#s-login`) so names like `#add` `#feed` are not read as colours

## Reviewer instruction message (item 6.1)

```
ดูภาพ <path dark/light> ของแอป Windows 11 (<ชนิดแอป>) เป้าคือดูเหมือน Windows Terminal / Settings / File Explorer
บอกปัญหาที่สำคัญที่สุด 2–3 ข้อต่อหน้า (ลำดับสายตา ระยะ แนว contrast ความหนาแน่น อะไรที่ดูเป็นเว็บ)
แต่ละข้อมีวิธีแก้ระดับ CSS (ขนาด px · องค์ประกอบไหน) · ไม่ต้องชม · ไม่เกิน 250 คำ
```

## Anti-patterns (item 7)

- **Filling the whole selected menu row with the accent colour.** Windows uses a small bar flush left
- **Tinting the window frame with the brand colour** (title bar · nav · rail · command bar · Mica/Acrylic · borders · menu icons). The frame is grey-black following the Windows theme · the accent lives in the selection bar, the primary button and the data · tint only when the user orders it
- **12–16px rounded corners.** That is the look of web/mobile; Windows uses 4px and 8px
- **Shadows under cards.** Windows 11 uses thin borders; shadows are reserved for flyouts/dialogs only
- **`alert()` / `confirm()`** in a web-wrapped app: use InfoBar or ContentDialog
- **Doing only dark mode because the reference image is dark.** Windows 11 defaults to light mode and users can choose either, so both must pass
- **Hard-coding the accent colour as blue.** To follow the colour the user has set, read it from the system
  (WinUI: do not override `AccentFillColorDefaultBrush` · web: CSS `AccentColor`)
- **A menu bar of arbitrary width.** Only 320px open / 48px collapsed
- **Sending a mockup that was never rendered and looked at.** See item 6
- **Solid accent-colour buttons on every table row.** Buttons in a row are icons that appear on hover; the primary button lives in the detail panel (patterns.md item 1)
- **Buttons and menus that are text only, with no icons.** They look like a wireframe
- **Content in the top half and the bottom half empty · a table stretched across the screen until columns are 400px apart.** Use list-detail (patterns.md item 2)
- **11px uppercase group headings · solid-colour badges in the status bar · coloured lines on tabs.** These are web styles
- **Several big cards in a row on the app's start page.** It looks like a SaaS dashboard; use a row of shortcut buttons instead (the first page of a mockup does not count, see `ui-craft`)
- **The mockup's control bar (Functional Requirement (FR) code · state switcher) left in the image sent for review.** Use `screenshot.py --hide`
- **Doing every page in one round with no main page as the model.** See item 1

## Limits to know (item 8)

- The `.xaml` / `.axaml` files here **have not been compile-tested.** The files hold only token values
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) using standard syntax.
  On the first build, check whether any key collides with the framework's own
- WinUI must merge `FluentTokens.xaml` **after** `XamlControlsResources`, otherwise the values are overwritten
- Theme dictionary names differ: WinUI uses `Default`/`Light`/`HighContrast`
  while Avalonia uses `Default`/`Light`/`Dark`
- **High-contrast mode:** never put fixed colours; pull them from system colours (there is an example in the XAML files)
- Mica / Acrylic really work only in WinUI/Avalonia on Windows. For web-wrapped apps,
  use solid colours per the tokens instead. Do not imitate them with `backdrop-filter`, because the result is not the same
  and it is heavy on the machine


## reference: tokens.md

# Token map: the same values across three stacks

> **The shared values (background, text, lines, shadows, sizes, spacing) are Fluent 2 as measured from a real Windows 11. Copy them as they are; never adjust them yourself.**
> Spacing: the content margin 36 and the section gap 40 are in the exception list of `ui-craft` (`references/scales.md`) · any other padding · margin · gap not in this table uses the 4/8/12/16/24/32/48/64 scale of `ui-craft`
> **The window frame is a neutral colour.** Mica/Acrylic are not tinted · accent is used only for the selection bar, the primary button, data and links
> **`accent` is the only colour that changes per job.** Use the customer's brand colour; if there is none yet, use the Windows default in this file, write `(รอยืนยัน)` (to be confirmed), and carry on without stopping to ask
> The accent values in this file are the Windows defaults, usable when there is no brand yet; they are not mandatory

All values were measured from a real Windows 11 dark theme (pixels sampled from the Windows Security page)
Edit `assets/fluent.css`, then always edit the XAML/AXAML files to match.

## Contents

1. [Colour: dark / light](#colour--dark--light)
2. [Status](#status)
3. [Type ramp (Fluent 2): never invent sizes outside this set](#type-ramp-fluent-2-never-invent-sizes-outside-this-set)
4. [Shape · spacing · layout](#shape--spacing--layout)
5. [Window breakpoints (Fluent breakpoints)](#window-breakpoints-fluent-breakpoints)
6. [Icons](#icons)

---

## Colour: dark / light

| Meaning | Dark | Light | CSS | WinUI 3 | Avalonia |
|---|---|---|---|---|---|
| Window background | `#202020` | `#F3F3F3` | `--win-bg` | `AppBackgroundBrush` | `AppBackgroundBrush` |
| nav / content background | `#272727` | `#F9F9F9` | `--win-layer` | `AppLayerBrush` | `AppLayerBrush` |
| Card | `#2B2B2B` | `#FFFFFF` | `--win-card` | `AppCardBrush` | `AppCardBrush` |
| Primary text | `#FFFFFF` | `#1A1A1A` | `--win-text` | `TextFillColorPrimaryBrush` ✱ | `AppTextBrush` |
| Secondary text | `#CCCCCC` | `#5D5D5D` | `--win-text-secondary` | `TextFillColorSecondaryBrush` ✱ | `AppTextSecondaryBrush` |
| Faint text | `#9D9D9D` | `#8B8B8B` | `--win-text-tertiary` | `TextFillColorTertiaryBrush` ✱ | `AppTextTertiaryBrush` |
| accent (button fill, selection bar) | `#4CC2FF` | `#005FB8` | `--win-accent` | `AccentFillColorDefaultBrush` ✱ | `SystemAccentColor` ✱ |
| accent (text/link) | `#99EBFF` | `#003E92` | `--win-accent-text` | `AccentTextFillColorPrimaryBrush` ✱ | `AppAccentTextBrush` |
| Text on accent fill | `#000000` | `#FFFFFF` | `--win-on-accent` | `TextOnAccentFillColorPrimaryBrush` ✱ | `AppOnAccentBrush` |
| Normal button fill | `#333333` | `#FFFFFF` | `--win-control` | `ControlFillColorDefaultBrush` ✱ | `AppControlBrush` |
| Selected row in nav | `#FFFFFF15` | `#00000010` | `--win-subtle-selected` | `SubtleFillColorSecondaryBrush` ✱ | `AppSubtleSelectedBrush` |
| Divider | `#3A3A3A` | `#E5E5E5` | `--win-divider` | `AppDividerBrush` | `AppDividerBrush` |

The Dark values are normal Windows 11 (Mica) · the pure-black style of Windows Security (`#000000` · card `#0F0F0F` · divider `#2D2D2D`) is turned on with `data-backdrop="black"` in `fluent.css`

✱ = a standard framework key; if overridden, ready-made controls change across the whole app
Keys starting with `App*` are our own and must be referenced by hand in XAML

## Status

| Status | Dark fg / bg | Light fg / bg | CSS |
|---|---|---|---|
| Success | `#6CCB5F` / `#393D1B` | `#0F7B0F` / `#DFF6DD` | `--win-success` / `-bg` |
| Warning | `#FCE100` / `#433519` | `#9D5D00` / `#FFF4CE` | `--win-caution` / `-bg` |
| Error | `#FF99A4` / `#442726` | `#C42B1C` / `#FDE7E9` | `--win-critical` / `-bg` |
| Info | `#60CDFF` / `#2E2E2E` | `#005FB8` / `#F4F9FF` | `--win-info` / `-bg` |

> The InfoBar background in dark mode is a **neutral** tone, not a saturated colour. If a vivid colour is used as the fill,
> a single bar competes for attention with the whole page

## Type ramp (Fluent 2): never invent sizes outside this set

| Level | Size/line | Weight | CSS class | WinUI style | Use for |
|---|---|---|---|---|---|
| Caption | 12 / 16 | 400 | `.win-caption` | `CaptionTextBlockStyle` | Labels, descriptions in settings rows |
| Body | 14 / 20 | 400 | `.win-body` | `BodyTextBlockStyle` | All body text |
| Body Strong | 14 / 20 | 600 | `.win-body-strong` | `BodyStrongTextBlockStyle` | Sub-headings in cards |
| Body Large | 18 / 24 | 400 | `.win-body-large` | `BodyLargeTextBlockStyle` | Lead text |
| Subtitle | 20 / 28 | 600 | `.win-subtitle` | `SubtitleTextBlockStyle` | Group headings in a page |
| Title | 28 / 36 | 600 | `.win-title` | `TitleTextBlockStyle` | Page title (1 per page) |
| Title Large | 40 / 52 | 600 | `.win-title-large` | `TitleLargeTextBlockStyle` | Hero pages only |

Font: **Segoe UI Variable** (Text for ≤18px, Display for ≥20px)
Segoe UI Variable **has no Thai letters**, but Windows falls back to **Leelawadee UI** by itself
On web-wrapped apps you must write the fallback yourself in `font-family`

## Shape · spacing · layout

| Value | Number | Use for |
|---|---|---|
| Control corner | 4px | Button, textbox, checkbox, combo |
| Card corner | 8px | card, expander, flyout, dialog |
| Title bar | 48px | Windows 11 style (32px = classic style) |
| Window buttons | 46 × 48px | Minimise/maximise/close; never change the size |
| NavigationView open | 320px | Standard value |
| NavigationView collapsed | 48px | Icons only |
| nav menu row | 40px tall | 16px icon · 16px gap between icon and text |
| Selected-page indicator bar | 3 × 16px, 2px rounded corners | Flush left, accent colour |
| Maximum content width | 1064px | Wider than this and the eye struggles to track long lines |
| Content left/right margin | 36px | 16px when the window is ≤ 640px · an exception to the spacing scale of `ui-craft` |
| Gap between sections | 40px | An exception to the spacing scale of `ui-craft` |
| Button | 32px tall · minimum width 120px | |
| Smallest button/click target | 32 × 32px | Desktop (not the 48px of mobile) |

## Window breakpoints (Fluent breakpoints)

| Range | Name | Behaviour |
|---|---|---|
| ≤ 640px | Small | nav is an overlay · 16px margin · single column |
| 641–1007px | Medium | nav collapses to icons · the right column drops below |
| ≥ 1008px | Large | nav fully open · 2 columns |

## Icons

Use **Segoe Fluent Icons** (ships with Windows 11) at 16px in the nav, 20px in section headings,
24px in page headers, and never mix in other icon sets within the same app

| Use | Code | | Use | Code |
|---|---|---|---|---|
| Home | `E80F` | | Settings | `E713` |
| Hamburger | `E700` | | Back | `E72B` |
| Minimise / maximise / close | `E921` `E922` `E8BB` | | Refresh | `E72C` |
| Shield (security) | `EA18` | | Warning | `E7BA` |
| User | `E77B` | | History | `E81C` |
| Network | `EC05` | | Update | `E895` |

For the full list: Microsoft Learn → "Segoe Fluent Icons font"
Non-Windows machines do not have this font, so icons turn into squares; therefore a mockup meant to be
viewed on Mac/Linux must switch to inline SVG instead
