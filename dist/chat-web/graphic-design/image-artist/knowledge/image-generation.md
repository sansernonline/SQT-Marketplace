# skill: image-generation

Use when a page needs images and a route must be picked

# Generate real images with AI

> **Gate before you start (every time):** read the owner's theme → search for live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the "ด่านก่อนลงมือ" (pre-start gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece). Close the work with a `ด่านก่อนลงมือ:` line.

Images in a hero · product or service cards · slides · shop posts · report illustrations → **images that look deliberate**, not basic shapes standing in for the real thing.
No setup and no API key needed → generate with the session's tool → draw a full-scene Scalable Vector Graphics (SVG) illustration → free photos.

## 1 · Ask about the style, once at the start

| Style | Look | Suits |
|---|---|---|
| `photo` | Real photograph | Spas, hotels, restaurants, shops, real estate, clinics |
| `flat` | Flat drawing, plain colours | SaaS, apps, online services, onboarding pages |
| `3d` | Soft-surface 3D picture | Fintech, games, toys, tech product launch pages |
| `watercolor` | Hand-painted watercolor | Thai themes, crafts, cafes, florists, children's work |
| `line` | Single-colour line art | Manuals, documents, pages that must be very plain |
| `isometric` | Angled 3D view | Explaining systems, factories, IoT, logistics |

- The user already said → use that
- You can ask → ask together with the other start-of-work questions in one message
- Nobody answers (an unattended run) → choose from the "Suits" column and note in `## ตัดสินใจเอง` (decided on my own) which style you chose and why
- 1 project = 1 style · mix styles only when the user orders it
- Prompt wording for each style → [`references/styles.md`](references/styles.md)

## 2 · Lock the style before the first image

Before the first image, write **1 paragraph on what this set of images is** (at most 4 sentences) at the top of `image-style.md`: who views it · what they should feel · what this set will never be (for example "not a glossy ad"). Every prompt and every chosen image is compared against this paragraph, not against your taste at the moment.
Write `image-style.md` (kept in `docs/design/` or the work's own folder): style · 3–5 colours (from the brand colours · with no brand → **search for references first:** take the project's keywords and search live following `design-gate/design-references` (plugin `superuser`), type `illustration`, then extract the colours from the chosen work · the stored palette library is for when live search is impossible) · light · camera angle · what must not appear
→ append this block to every image's prompt → even 20 images still look like one set

## Write the brief and prompt

The line between the two skills: **this file decides how to get the images** (generate, draw SVG, or find free ones) and makes the image list · **`brief-to-image` writes the brief and prompt** once the generate route is chosen, including how to pick from 3–4 variants (`decision-desk/decision-scoring`, command `score` · for hard scoring use `pairwise` · if results are close, the user chooses) and how to fix a bad image · do not put Thai text inside a generated image, and place it afterward with the brand font

**Keep a set of images consistent** — apply the `image-style.md` block above to every image · lock the same camera angle and light · for a recurring person or character, make 1 reference image first, then reuse the reference image or the same seed · lay all images side by side before sending. Full method → `style-consistency`

## 3 · Make the image list

`image-list.md` (same folder), a table: file name · where used · aspect ratio · what must be visible · status · source (prompt or search terms)
→ no image is missed, none is made beyond need, and each can be recreated later

## 4 · Get the images — in this order, use the first route that works

| Order | Route | Use when |
|---|---|---|
| 1 | **Generate with the image tool the session has** (a Model Context Protocol (MCP) server or an image plugin) | The session has this tool · every style is possible |
| 2 | **Draw SVG as full-scene illustrations, the whole set** | Route 1 is unavailable · for style `photo` → draw detailed illustrations instead and note it in `## ตัดสินใจเอง` |
| 3 | **Free photos from Openverse** — `scripts/fetch_free_image.py`, no key needed | The SVGs fail the beauty gate · or the user says it must be a real photo |

**Route 1 — generate:** prompt = the subject + the style line (`references/styles.md`) + the style block · generate 3 variants per image → open them with `Read` → score by these criteria: matches the brief · text is legible · matches `image-style.md` · can be cropped · a physical impossibility is an iron rule that eliminates the image, not a score (command `score` of `decision-desk/decision-scoring` · details in `brief-to-image`) → pick rank 1 · if only 1 thing is wrong, fix 1 line · if the same thing fails 3 rounds in a row → write a new brief

**Route 2 — draw SVG:** it must be crafted, and the viewer must see at once what it depicts, not basic shapes stacked up (a triangle for a roof, a circle for the sun = the reason websites look like children's cartoons). Full steps and techniques → [`references/svg-illustration.md`](references/svg-illustration.md)
- Look at real reference images before drawing · draw one image at a time
- At least 3 layers: background · middle · front · add depth with gradients and soft shadows
- Include details that tell what the thing is (fabric pattern, leaf veins, steam, wood grain) · draw with curved `path`s, not just `rect` and `circle`
- Colours only from `image-style.md` · the same line weight, corner radius and light direction in every image
- 1 file per image `public/images/<name>.svg` · `viewBox` follows the aspect ratio in `image-list.md` · do not embed in HTML
- Render to PNG and look at it for real with playwright (`_to_delete/`) → **guess test**: a subagent (haiku · answers in at most 3 lines) that does not know the file name must say what the image shows → a second reviewer scores the beauty gate (`ui-craft` (plugin `software-development`) item 9 · answers in at most 10 lines) · if it fails, fix once → if it still fails → go to route 3 for the whole set

**Route 3 — free photos:**
```
python <skill>/scripts/fetch_free_image.py --query "thai massage room" \
  --out public/images/hero.webp --aspect 16:9 --n 3
```
- Search terms in English, short, pointing at things in the picture (`spa towels orchid` is better than `relaxing spa`)
- You get `hero-1` to `hero-3` → open every image → pick 1 and rename it `hero.webp` → move the rest to `_to_delete/` and delete their rows in `CREDITS.md`
- If the style does not match (colour or light does not fit the set) → search new terms, which is better than using an image that breaks the set
- **Use only images that allow both commercial use and modification.** The script already filters (Openverse `license_type=commercial,modification`), so you will not get CC BY-NC (no commercial use) or CC BY-ND (no modification, and cropping counts). Images you find yourself outside the script must be checked for this by you, because a storefront and a sales page are commercial use.
- CC BY images need credit → add an "เครดิตรูปภาพ" (image credits) link in the footer pointing to the page that shows `CREDITS.md`

**Use the same route for the whole set** — do not mix photos and drawings on one page unless the user orders it
Text, prices and Thai wording → put them in HTML, not in the image
For any image not yet done → put an `<img>` using the name in `image-list.md` with `alt` · report the status as `รอรูป` (awaiting image), not `เสร็จ`

## Check before sending

- Open every image actually used: hands, fingers, faces, garbled lettering in the picture, floating objects → if found, regenerate
- Every image matches `image-style.md` (colour, light, angle) when laid side by side
- `.webp` files at most 1920 px wide · at most 300 KB per image · every image has `alt`
- Open the real work (web page, slide, post, document) and check that the images fit the layout

## Prohibitions

- Identifiable real people · another brand's logos, characters or products
- Images from general websites with unknown license · free images with no credit recorded · NC or ND images in commercial work

## Avoid the AI-made look

Before sending, go through item 3 of `design-gate/no-ai-look` — for HTML work, run its script · every work must also pass eye gate 3.2 (web pages also answer items 10–14), because a script result of 0 issues is not yet a pass · the prohibitions in this file are the part specific to this work, and the full list for every medium is there · every prompt must contain everything required by item 4 of `design-gate/no-ai-look` (a named style · hex · light · what you do not want)


## reference: styles.md

# Prompt wording by style

Build the prompt in this order: **the subject of the picture** (1 focal point that must be visible) + **the style line** (table below) + **the style block** from `docs/design/image-style.md` (colour, light, angle).
Always send the exclusions: `text, letters, watermark, logo` plus the extras for each style. Pass them the way the session's image tool accepts them (a negative prompt field if it has one; if not, append `Avoid: …` to the prompt). The examples below are written as `--negative` for readability.

| Style | Style line (English, which models understand better) | Extra negative |
|---|---|---|
| `photo` | `editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium` | `illustration, cartoon, 3d render, oversaturated, plastic skin` |
| `flat` | `flat vector illustration, simple geometric shapes, solid colour fills, no gradients, clean negative space` | `photo, realistic, 3d, texture, shadows` |
| `3d` | `tactile 3D object made of one named material (matte card stock with visible fibres, or polymer clay with faint fingerprints), one softbox from the upper left, dark contact shadow plus a soft cast shadow in the same direction, flat backdrop of the same material, one colour from the palette` · one object only · the 8-line template with an example is in `brief-to-image` → `references/prompt-anatomy.md`, section Tactile 3D hero object | `glossy plastic, smooth CGI surface, glow, floating particles, teal-orange grade, gradient backdrop, vignette, clutter` |
| `watercolor` | `hand-painted watercolor illustration, visible paper texture, soft edges, light washes` | `photo, 3d, hard vector edges, neon` |
| `line` | `single-colour line art, even stroke weight, minimal, lots of white space` | `photo, shading, colour fills, texture` |
| `isometric` | `isometric illustration, 30 degree angle, clean geometry, consistent light from top left` | `perspective distortion, photo, blur` |

## Example — a Thai spa, `photo` style

```
Thai traditional massage room with a low mattress, folded white towels and a bowl of
orchid petals, soft afternoon light through a wooden window.
editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium.
Palette: deep forest green, warm cream, natural teak wood, small gold accent.
Composition: eye-level, subject in left third, empty space on the right for the headline.
```
`--negative "text, letters, watermark, logo, illustration, cartoon, oversaturated, people's faces"` · `--aspect 16:9`

## Aspect ratio by placement

| Placement | `--aspect` |
|---|---|
| Full-width hero | `16:9` |
| Product / service card | `4:3` or `1:1` |
| Pictures of people / therapists / the team | `3:4` or `1:1` |
| Mobile banner / story | `9:16` |
| Social post | `4:5` (see `social-formats` if present) |

## Pictures of people

- Write the role and pose, never a real person's name: `a Thai female therapist in a sage green uniform, smiling, mid-30s`
- For a whole team set, use the same clothing, background and light in every picture
- Check the hands and fingers in every picture. If not needed, choose an angle where the hands do not show.


## reference: svg-illustration.md

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
