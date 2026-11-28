# Flutter screen layout and components: extension of `ui-craft` part `mobile-app-design`

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
| raw colour check | The `ui-craft` part `web-app-design` checker does not catch Dart. Use `grep -rn -e "Color(0x" -e "Colors\.[a-z]" lib --include=*.dart`, and matches must appear only in the theme file |
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
