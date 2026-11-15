# Icon numbers and sizes by platform

Every row's source was opened and read on 2026-10-26 · numbers change with platform versions, so open the link and re-check before real delivery.

## Screen icons (UI icon)

| Topic | Value | Source |
|---|---|---|
| Display size | 24 · dense 20 · Atlassian uses 16 | Material 1 · Atlassian |
| Drawing area (live area) | 20×20 inside 24 (2 margin on each side) · Lucide keeps at least 1 | Material 1 · Lucide |
| Keyline shapes on the 24 grid | circle 20 · square 18 · portrait 16×20 · landscape 20×16 · the circle is larger than the square because the eye sees a circle as smaller than it is | Material 1 |
| Stroke weight | 2 across the set · complex pieces may drop to 1.5 · Atlassian uses 1.5 on a 16 grid | Material 1 · Lucide · Atlassian |
| Corners | outer corners rounded with radius 2 (shapes smaller than 8 use 1) · inner corners sharp · where more than 2 strokes meet, keep the corner sharp | Lucide · Material 1 · Atlassian |
| Gaps | at least 2 between pieces · a gap inside a shape must fit a circle of width 2 | Lucide |
| Coordinates | pixel-aligned (on the 24 grid, land on .0 or .5 when a 2-thick stroke is centered on its line) but do not trade this against recognition or balance | Lucide · Material 1 |
| Priority order | clarity → visual balance → consistency with the set | Lucide |
| Touch area | icon 24 → touch target 48 · 20 → 40 | Material 1 |
| Text label | Put an always-visible text label beside the icon, even a standard icon · the only icons everyone worldwide understands the same way are home · print · search | NN/g (2014-07-27) |
| metaphor | Name it by the picture, not by the function ("Shield, not security") · the modifier sits at the bottom right · check cultural meaning | Fluent 2 |
| Apple | 9 weights and 3 scales matched to the neighboring text · a custom symbol starts from the template of a nearby symbol · do not use SF Symbols in app icons or logos | HIG SF Symbols |

## App icons, logos, favicons

| Destination | File and size | Bans | Source |
|---|---|---|---|
| iOS · iPadOS · macOS | 1024×1024 square, do not cut the corners yourself, the system applies the mask · solid fill to the edge · variants default · dark · clear · tinted | Do not add your own shadow, bevel, or glow · avoid text, thin strokes, sharp corners | HIG App icons (last updated 2026-06-08) |
| watchOS · visionOS | 1088 · 1024 · the system applies a circular mask | watchOS: avoid a pure black background | Same as above |
| Android adaptive | each layer 108×108dp · main content inside the central 66×66dp (minimum 48) · must have a monochrome layer for themed icons | Do not put a mask or shadow in the file, the OEM does the cutting | Android Developers |
| Windows | at least 16 · 24 · 32 · 48 · 256 · `targetsize-N` files, unplated, for both dark and light themes, otherwise the system adds a backplate | — | Microsoft Learn (updated 2026-08-05) |
| Web | `favicon.ico` 32 (add 16 if 32 scaled down looks blurry) · `icon.svg` supporting dark theme with a media query · `apple-touch-icon.png` 180 with padding and a background color · `icon-192.png` · `icon-512.png` · maskable 512 with the artwork inside the central 409 | Google Search does not accept SVG alone, it needs PNG or ICO · minimum 8×8, recommended over 48 | Evil Martians (Andrey Sitnik · 2026-01-21) · Google Search Central |
| Claude Code plugin | `icon` field in `plugin.json` points to an image file in the plugin, such as `./logo.png` · used only on the listing page at `claude.ai/directory/manage`, Claude Code does not read it | Docs set no size, shape, or theme (checked 2026-10-26) · the directory gate accepts PNG JPEG GIF WebP SVG · make an SVG master, then export PNG 512 up front, which also works for Raycast | code.claude.com plugins-reference · publish |

## Sources

- Material Design 1 · Icons — https://m1.material.io/style/icons.html (M3 could not be read because the page needs JavaScript to run, so the numbers come from M1)
- Lucide · Design principles — https://lucide.dev/contribute/icons/design-principles
- Atlassian · Iconography — https://atlassian.design/foundations/iconography/
- Microsoft Fluent 2 · Iconography — https://fluent2.microsoft.design/iconography
- Apple HIG · SF Symbols — https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- Apple HIG · App icons — https://developer.apple.com/design/human-interface-guidelines/app-icons
- Android · Adaptive icons — https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- Microsoft Learn · Construct your Windows app's icon — https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction
- Evil Martians · How to favicon — https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- Google Search Central · Favicon — https://developers.google.com/search/docs/appearance/favicon-in-search
- NN/g · Icon usability — https://www.nngroup.com/articles/icon-usability/
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference
