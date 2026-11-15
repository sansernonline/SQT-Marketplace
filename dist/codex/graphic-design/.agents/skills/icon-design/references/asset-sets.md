# Designer-made asset sets: pick one and adapt it instead of drawing your own

Use when the user wants a style that code-drawn icons cannot reach (depth · multi-color · 3D · illustration) and there is no image generator or designer. Every row was read from the actual LICENSE file or license page on 2026-10-27 · licenses can change, so open the link and re-check before real use · counts come from `info.json` of the `@iconify-json/<set>` package.

## 1 · Pick by the style the user wants

| Style | Set | License | File · install | Notes |
|---|---|---|---|---|
| Color with depth (layered pieces, gradients) | Fluent UI System Icons, color variant | MIT | SVG, recolorable · `@fluentui/svg-icons` (files `*_color.svg`) or `@iconify-json/fluent-color` | 890 icons · many original colors are the Copilot purple-pink, so change the colors before use · some exist only at 16–24 size |
| Color with depth | IconPark, multi-color · two-tone themes | Apache 2.0 | SVG | 2,658 icons |
| Flat color | Icons8 Flat Color | MIT | SVG | 329 icons |
| 3D | Fluent Emoji 3D | MIT | PNG 256, cannot be recolored · the same icon also comes as Color and Flat SVG | Color variant has 3,126 icons |
| 3D | 3dicons.co | CC0 | (file format not checked yet) | |
| Two-weight line (duotone) | Phosphor | MIT | SVG · `@phosphor-icons/core` | 9,072 icons across 6 weights |
| Line | Lucide · Tabler · Iconoir · Material Symbols | ISC · MIT · MIT · Apache 2.0 | SVG | Screen icons, see [`icon-sets.md`](icon-sets.md) |
| Illustration | Open Peeps · Humaaans · Open Doodles | CC0 | SVG · PNG | |
| Illustration | unDraw | unDraw's own license | SVG, recolorable on the web | No credit needed, but you must not bundle it into a pack for redistribution, build a competing service, or use it to train AI models |
| Emoji | Noto Emoji | Images Apache 2.0 · font OFL 1.1 | SVG · PNG | 3,729 icons |

**Credit required:** Twemoji (images CC BY 4.0) · Streamline free set (CC BY 4.0)

**Not suitable for app icons or logos:** Remix Icon (license v1.0 of Jan 2026, clause 3.3 forbids use even after recoloring or rotating) · OpenMoji (CC BY-SA 4.0, derivative works must carry the same license) · SF Symbols

**Good to know:** MIT · Apache · CC0 · CC BY give no exclusive rights, so others can use the same image. If the user will register a trademark, do not use an image straight from a set (general opinion, not checked against a legal source).

## 2 · Steps to pick and adapt

1. Search the set that matches the style and pick the 2–3 icons closest to the metaphor for each icon · the `@iconify-json/<set>` package gives the whole set's SVGs in `icons.json` and the license name in `info.json`.
2. Download into `_to_delete/`, then place in the real frame and compare on both light and dark backgrounds at 16 · 48 · 128 px.
3. Make it the brand's own: recolor with `scripts/recolor_icon.py --hex "<brand color>"`, which keeps the designer's lightness and shading and rotates only the hue · for a set where each icon needs a different color, run it one icon at a time with that icon's `--hex` · if no icon in the set fits the metaphor, try the next set in the same row and do not draw extra pieces yourself · place the whole set in the same frame · do not cut, notch, or bend the frame's shape.
4. Run `icon_check.py` and open the image yourself · send it to a fresh `design-critic`.
5. Record the set name, version, license, and what you changed in NOTICE or README.

## Sources (read 2026-10-27)

- Fluent UI System Icons — https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE
- Fluent Emoji — https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE
- IconPark — https://github.com/bytedance/IconPark/blob/master/LICENSE
- Icons8 Flat Color — https://github.com/icons8/flat-color-icons/blob/master/LICENSE.md
- Phosphor — https://github.com/phosphor-icons/core/blob/main/LICENSE
- Tabler — https://github.com/tabler/tabler-icons/blob/main/LICENSE
- Iconoir — https://github.com/iconoir-icons/iconoir/blob/main/LICENSE
- Lucide — https://github.com/lucide-icons/lucide/blob/main/LICENSE
- Material Design Icons — https://github.com/google/material-design-icons/blob/master/LICENSE
- 3dicons — https://3dicons.co/
- Open Peeps — https://www.openpeeps.com/ · Humaaans — https://www.humaaans.com/ · Open Doodles — https://www.opendoodles.com/
- unDraw — https://undraw.co/license
- Noto Emoji — https://github.com/googlefonts/noto-emoji/blob/main/LICENSE
- Twemoji — https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS
- Streamline — https://github.com/webalys-hq/streamline-vectors/blob/main/README.md
- Remix Icon — https://github.com/Remix-Design/RemixIcon/blob/master/License
- OpenMoji — https://github.com/hfg-gmuend/openmoji/blob/master/LICENSE.txt · https://openmoji.org/faq/
