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
