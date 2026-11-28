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
