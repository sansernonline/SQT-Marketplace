# Draw SVG with care — you can tell what the picture is at once

Goal → illustrations at a level usable on a real website, not sketches · someone seeing it for the first time must say what it is within 2 seconds.

## Steps — draw one image at a time, do not draw the whole set in one file in a rush

1. **Look at the real thing first** — find 2–3 reference images of what you will draw (search the web) and note the real shape, proportions and 3 features that make it recognisable (orchid → 5 petals + the lip in the middle + a curved stem)
2. **Lay out the composition** — 1 focal point on a 1/3 line · overlap pieces to give depth · leave empty space as `image-list.md` says (for example room for a heading)
3. **Draw in layers** — background (broad gradients) → middle (supporting objects, slightly blurred or paler) → front (the focal point, sharpest, darkest colour)
4. **Add light and shadow** — set one light direction for the whole set (for example top left) · every piece has a light side, a dark side and a cast shadow on the ground
5. **Add detail** — leaf midrib, fabric weave, wood grain, steam, water drops · most detail at the focal point, least at the edges of the image
6. **Check** — per the section at the end of the file

## Techniques to use

| Topic | Do this | Do not do this |
|---|---|---|
| Shapes | `path` with Bézier curves following the real shape | `rect` `circle` `polygon` alone standing in for the thing |
| Dimension | `linearGradient` with 3–4 colour stops per piece · `radialGradient` for cast light | One flat colour across the whole piece |
| Shadow | `filter` + `feGaussianBlur`, soft shadow at 15–30 % opacity | Hard-edged black shadow |
| Texture | `pattern` of thin lines or `feTurbulence` at low strength (wood, fabric, paper) | Flat fill on every piece |
| Depth | Back pieces smaller, paler, overlapping | Every piece the same size in a row |
| Viewpoint | A slight angle, seeing the top of the table, bowl, folded cloth | Looking straight on at every piece like paper cutouts |
| Outline | No outline, or a line 1 step darker than that piece's fill | Thick black line around every piece |

## Example of the difference — a spa image

- Wrong: a gold triangle on a white rectangle = "temple" · a green rectangle bar = "tree" · a yellow circle = "sun"
- Right: 3 folded white towels stacked, with fold lines and a shadow under each · 3 black stones stacked, with a highlight on top · 1 spray of white orchids, petals with a light purple gradient at the base · a brass bowl reflecting light · a teak wood floor with grain · a blurred leaf backdrop

## Minimum level of care

- hero ≥ 40 `path` · card ≥ 20 `path` · has `defs` that really use gradients and filters
- Use colours from `image-style.md` but break each colour into light, mid and dark shades
- File no larger than 150 KB per image · no raster image embedded inside

## Check before sending

1. Render to PNG at the real size with playwright into `_to_delete/`, then open it with `Read`
2. **Guess test** — send the PNG to a fresh subagent that does not know the file name and does not see the prompt, and ask one thing: "what is this picture?" · a wrong guess or a vague one ("geometric shapes") → redraw
3. **Beauty gate** — another checker scores 1–5 against the reference images on 4 axes: you can tell at once what it is · readable at real size · colours and lines go the same way · does not look AI-made (`design-gate/no-ai-look`) · every axis ≥ 4 to pass (app screens: the criteria in `ui-craft` item 9 in plugin `software-development`)
4. Lay all images of the set side by side → light direction, lines and colours must match

Fails after 1 round of fixes → go route 3 (free photos) for the whole set
