# skill: image-generation

Use when images are needed, as a route, brief, prompt or edit

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

The line between the two skills: **this file decides how to get the images** (generate, draw SVG, or find free ones) and makes the image list · **[`references/prompt-brief.md`](references/prompt-brief.md) writes the brief and prompt** once the generate route is chosen, including how to pick from 3–4 variants (`decision-desk/decision-scoring`, command `score` · for hard scoring use `pairwise` · if results are close, the user chooses) and how to fix a bad image · do not put Thai text inside a generated image, and place it afterward with the brand font

**Keep a set of images consistent** — apply the `image-style.md` block above to every image · lock the same camera angle and light · for a recurring person or character, make 1 reference image first, then reuse the reference image or the same seed · lay all images side by side before sending. Full method → `brand-kit` (`references/style-lock.md`)

## 3 · Make the image list

`image-list.md` (same folder), a table: file name · where used · aspect ratio · what must be visible · status · source (prompt or search terms)
→ no image is missed, none is made beyond need, and each can be recreated later

## 4 · Get the images — in this order, use the first route that works

| Order | Route | Use when |
|---|---|---|
| 1 | **Generate with the image tool the session has** (a Model Context Protocol (MCP) server or an image plugin) | The session has this tool · every style is possible |
| 2 | **Draw SVG as full-scene illustrations, the whole set** | Route 1 is unavailable · for style `photo` → draw detailed illustrations instead and note it in `## ตัดสินใจเอง` |
| 3 | **Free photos from Openverse** — `scripts/fetch_free_image.py`, no key needed | The SVGs fail the beauty gate · or the user says it must be a real photo |

**Route 1 — generate:** prompt = the subject + the style line (`references/styles.md`) + the style block · generate 3 variants per image → open them with `Read` → score by these criteria: matches the brief · text is legible · matches `image-style.md` · can be cropped · a physical impossibility is an iron rule that eliminates the image, not a score (command `score` of `decision-desk/decision-scoring` · details in `image-generation`) → pick rank 1 · if only 1 thing is wrong, fix 1 line · if the same thing fails 3 rounds in a row → write a new brief

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

## Parts

Hard rules of the two absorbed jobs (full steps in each file):
- **Prompt brief** ([`references/prompt-brief.md`](references/prompt-brief.md)): 1 brief per asset; a series shares a style lock sheet, not a copied prompt · never put the headline, price or Thai copy in the image prompt · no real identifiable person without consent, no trademarked characters or other brands' logos · check the tool's terms for commercial use before an ad · every prompt carries the items of `design-gate/no-ai-look` section 4.
- **Edit brief** ([`references/edit-brief.md`](references/edit-brief.md)): name the problem and the keep list before editing · 1 edit brief version per round, never rewrite it mid-edit · the original file is the reference for every later edit · never edit product labels, prices or certification marks with AI · if the edit is larger than the keep list, it is a new image, so write a prompt brief.

| When | Open |
|---|---|
| Writing a brief and prompt for an AI image | [references/prompt-brief.md](references/prompt-brief.md) · [references/prompt-anatomy.md](references/prompt-anatomy.md) |
| Tool differences (negative field, Thai text, aspect ratio) | [references/model-differences.md](references/model-differences.md) |
| A model brief-to-prompt example | [references/prompt-worked-example.md](references/prompt-worked-example.md) |
| An image needs edits such as a background swap | [references/edit-brief.md](references/edit-brief.md) · [references/edit-brief-template.md](references/edit-brief-template.md) |
| A model edit run over 3 rounds | [references/edit-worked-example.md](references/edit-worked-example.md) |

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


## reference: edit-brief-template.md

# Edit brief template

Save as `briefs/<asset-name>-edit.md`, next to the original brief.

```markdown
# Edit brief — <file name> (from v<NN>)

Original: <path to v01> · Target use: <placement + canvas>
Tool and version: <...>

## Problem in one line
<what is wrong, where>

## Keep (must not change)
- [ ] Subject identity: <product label / face / shape>
- [ ] Light: <direction, warm/cool>
- [ ] Palette: <dominant hex>
- [ ] Composition anchor: <subject position, text space>
- [ ] Brand elements: <...>

## Change list (one per round)
| # | Edit type | Area (mask) | Instruction | Done |
|---|---|---|---|---|
| 1 | | | | ☐ |
| 2 | | | | ☐ |

## Round log
| Round | Change # | Result | Keep list broken? | Next |
|---|---|---|---|---|
| 1 | | | | |

## Output
File: <name>-v<NN> · Verified by: <name> · Date: <yyyy-mm-dd>
```

## Canvas-extension maths

To go from one ratio to another with the same width W:

- New height = W ÷ (target width/height ratio)
- 4:5 → 9:16 at W = 1080: 1350 → 1920 px, add 570 px (42% of 1350)
- 1:1 → 4:5 at W = 1080: 1080 → 1350 px, add 270 px (25%)
- 16:9 → 1:1 at H = 1080: crop width 1920 → 1080, or extend height to 1920

Decide where the new pixels go (top for text space, bottom only if it stays outside the story UI zone).


## reference: edit-brief.md


# Image Editing Brief

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references for the result you want → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) · editing an existing image needs only 1 direction · close the work with a `ด่านก่อนลงมือ:` line

Change only what the brief names. AI edits drift: ask for a new cup and the lighting, the face and the palette change too. The keep list is the anchor.

## Workflow

1. **Name the problem precisely** — "make it better" is not an edit. Ask what is wrong and where
2. **Choose the edit type** from the table below — it decides the tool feature and the instruction style
3. **Write the brief** with [edit-brief-template.md](edit-brief-template.md): keep list, change list, mask area
4. **Save the original** as `<name>-v01` before any edit. Each edit is a new version. Never overwrite
5. **Make 1 change per round** when the tool allows. Several changes at once make the drift worse
6. **Check the keep list first**, then the change. A perfect change that broke the lighting is a fail
7. **Stop at round 3** on the same change — re-brief, composite by hand, or regenerate from `image-generation`

## Edit types

| Edit | Tool feature (general names) | Instruction that works | Watch for |
|---|---|---|---|
| Remove object | Generative fill / erase / inpaint with mask | Mask the object plus a small margin; describe what should be there instead ("plain oak counter") | Repeated textures, ghost shadows left behind |
| Add object | Inpaint with mask | Mask only where it goes; state size, angle and light direction matching the scene | Wrong light direction, wrong scale, floating object |
| Replace background | Background removal + new background or inpaint | Describe the new background's light to match the subject | Halo around hair and glass; mismatched shadows |
| Extend canvas | Outpaint / generative expand | Say which side and by how much (e.g. "extend top by 42% for a 4:5 → 9:16 canvas") | Repeated patterns, new objects appearing |
| Colour change | Selective colour, recolour, or inpaint | Give the target hex; restrict to the object | Colour bleeding into skin or background |
| Retouch / clean | Healing, spot removal | List each blemish or item | Over-smoothing; plastic skin |
| Fix AI artefacts | Inpaint per area | 1 area per round (hand, then text, then edge) | New artefacts in the redone area |
| Upscale | Upscaler, super resolution | Target pixel size, not "high quality" | Invented textures, sharpened noise, altered faces |

## Keep list — what usually must survive

- Identity of people and products (face, label, logo shape)
- Light direction and colour temperature
- Palette and dominant colour
- Composition anchor (where the subject sits, where text will go)
- Brand elements (packaging, colours from the kit)

## Worked example

A story background run through 3 rounds (remove straw · remove stray cup · extend canvas 4:5 to 9:16): [`edit-worked-example.md`](edit-worked-example.md)

## Rules

- 1 edit brief version per round. Never rewrite the whole brief mid-edit
- The original file is the reference for every future edit
- Do not edit product labels, prices or certification marks with AI — retouch by hand or reshoot. A changed label is a false claim
- People: no edits that change a real person's identity, body or what they appear to say without their consent
- If the edit is larger than the keep list, it is a new image — go back to `image-generation`

## Not an AI look

Before handing over, run the check in `design-gate/no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files. Fix AI tells (plastic skin, teal-orange grade, warped text) as part of the edit.

## Related

- `image-generation` — when regeneration is cheaper than editing
- `brand-kit` — keep the edited image on the set's style
- `design-review` — point 8 checks for artefacts after editing


## reference: edit-worked-example.md

# Worked example · image-generation

## Worked example

**Image:** story background, iced matcha on a counter; text area top-right.
**Problem:** a straw appears (brand rule: no straws in photos), a stray cup on the right, and the image is 4:5 but the story needs 9:16.

| Round | Change | Mask / setting | Result |
|---|---|---|---|
| 1 | Remove straw — "glass rim with no straw, same condensation" | Mask straw + 10 px | Pass; keep list intact |
| 2 | Remove right cup — "continue the oak counter and blurred shop interior" | Mask cup and its shadow | Pass after 1 retry (first try left a shadow) |
| 3 | Extend top by 42% for 9:16 — "continue the cream wall, no objects" | Outpaint top only | Pass; top area is clean text space |

Verification: face of glass, layer colours, light from right, palette — all unchanged. Saved as `matcha26-bg-v04.png`.


## reference: model-differences.md

# Model differences (general, check your tool's docs) · image-generation

Open from SKILL.md when the tool or model behaves unlike the brief expects.

| Behaviour | What to do |
|---|---|
| Some models read full sentences best; others prefer comma-separated phrases | Write the brief as sentences; keep a phrase version if the tool responds better |
| Some tools have a separate negative-prompt field; others ignore "no X" or even add X | If no negative field, describe what *is* there instead ("plain cream wall" rather than "no clutter") |
| Aspect ratio is a parameter in most tools; typed ratios in the prompt are often ignored | Set the parameter; do not rely on the words |
| Text inside images is unreliable, worst for Thai script | Generate without text; add Thai copy in a layout tool with the brand font |
| Reference image, style reference or seed features exist in many tools | Use them for series work (`brand-kit`) |
| Models change between versions | Record the version; re-test a saved prompt after an update |


## reference: prompt-anatomy.md

# Image brief template and vocabulary

## Contents

1. [Brief file](#brief-file--briefsasset-namemd)
2. [Composition words](#composition-words)
3. [Lens and camera](#lens-and-camera)
4. [Light](#light)
5. [Style words that carry meaning](#style-words-that-carry-meaning)
6. [Negatives that save rounds](#negatives-that-save-rounds)
7. [Tactile 3D hero object](#tactile-3d-hero-object)

## Brief file — `briefs/<asset-name>.md`

```markdown
# Brief — <asset-name>

Used for: <platform + placement> · Aspect ratio: <4:5> · Due: <date>
Style source: <brand-kit v1 / style lock sheet name + version>
Text added later in layout: <headline / none>

| Element | Brief |
|---|---|
| Subject | |
| Action / state | |
| Setting | |
| Composition | (angle, framing, where the empty space for text is) |
| Lens / camera | |
| Light | |
| Style | |
| Palette | (hex from kit, dominant first) |
| Negatives | |
| Format | |

## Prompt (assembled)
<paste>

## Log
| Round | Tool + version | Seed / settings | What missed | What changed |
|---|---|---|---|---|
| 1 | | | | |

## Winner
File: <name> · Prompt: <final> · Seed: <n>
```

## Composition words

| Want | Say |
|---|---|
| Space for a headline | "empty space in the upper third", "subject in the left third" |
| Product hero | "centred, front three-quarter view, low angle" |
| Flat lay | "top-down overhead view, items arranged on a grid" |
| Story / mood | "wide shot, small figure in a large space" |
| Detail | "extreme close-up, macro" |

## Lens and camera

| Term | Effect |
|---|---|
| 24mm / wide angle | More background, some distortion, environment |
| 35mm | Natural documentary, street, lifestyle |
| 50mm | Close to human eye, neutral |
| 85mm | Portrait and product, flattering, background compressed |
| 100mm macro | Texture, food and jewellery detail |
| Shallow depth of field, f/1.8–f/2.8 | Blurred background, subject isolated |
| Deep focus, f/8–f/11 | Everything sharp, interiors and flat lays |
| Eye-level / low angle / high angle / top-down | Viewer's relation to the subject |

## Light

| Term | Look |
|---|---|
| Soft window light | Gentle, natural, lifestyle and food |
| Golden hour | Warm, low, long shadows |
| Overcast daylight | Even, no harsh shadows, true colour |
| Hard noon sun | Strong shadows, summer energy |
| Studio softbox, white seamless | Clean product, e-commerce |
| Rim / back light | Outline glow, separation from background |
| Neon night, practical lights | Urban, nightlife, street food |
| Low-key | Dark, dramatic, premium |
| High-key | Bright, airy, minimal shadow |

## Style words that carry meaning

editorial · documentary · product catalogue · flat vector illustration · isometric 3D · claymation-style 3D · risograph print · watercolour · line art · Thai traditional pattern (ลายไทย) as a border motif — name the medium, not "beautiful" or "high quality".

## Negatives that save rounds

text, watermark, logo, signature · extra fingers, distorted hands · duplicate objects · cluttered background · oversaturated · plastic skin · off-palette colours (name them)

## Tactile 3D hero object

One physical-looking object as the hero of a post or page (paper cut, clay, felt, wood). Generic "soft 3D render, clay, studio lighting" prompts give the glossy CGI look that `design-gate/no-ai-look` flags; these 8 lines name what a real object has. One line each, in this order, then set the aspect ratio as a parameter.

| # | Line | Fill with | Weak → strong |
|---|---|---|---|
| 1 | Subject | 1 object, its exact form and how it is built | "3D question mark" → "a question mark built from 4 stacked layers of cut card stock" |
| 2 | Material | A surface you could touch, and how it was made | → "matte card with visible paper fibres, hand-cut edges slightly uneven, no gloss" |
| 3 | Light | 1 source, its direction and size | → "one large softbox from the upper left at 45 degrees, shadow edges soft over 2–3 cm" |
| 4 | Shadow | Contact shadow plus cast shadow, same direction as the light | → "dark contact shadow tight under the base, faint wide cast shadow to the lower right" |
| 5 | Lens | Focal length, aperture, camera height, framing | → "100mm macro, f/8, eye level, object fills 60% of the frame, empty space top right" |
| 6 | Background | Same material family, flat | → "seamless cream paper backdrop #F3EDE2, same paper as the object, no gradient, no vignette" |
| 7 | One colour | 1 hex; other tones come only from shadow and layers | → "single colour #E8742A, darker tones only from the shadows between layers" |
| 8 | Negatives | What models add by default | → "glossy plastic, smooth CGI surface, glow, text, teal-orange grade, floating particles" |

Other materials: swap line 2 for "polymer clay with faint fingerprints, soft matte sheen" or "wool felt with visible fibres and stitched seams". A harder look: swap line 3 for "one desk lamp, crisp shadow edge". Tool without a negative field: describe what is there instead (line 6 already does most of this work).

**Worked example (paper-cut question mark):**

> A question mark built from 4 stacked layers of cut card stock, standing upright. Matte card with visible paper fibres and slightly uneven hand-cut edges, no gloss. One large softbox from the upper left at 45 degrees, shadow edges soft over 2–3 cm. A dark contact shadow tight under the base and a faint wide cast shadow falling to the lower right. 100mm macro lens, f/8, eye level, the question mark fills 60% of the frame with empty space in the top right. Seamless cream paper backdrop #F3EDE2 in the same paper as the object, flat, no gradient, no vignette. Single colour #E8742A; darker tones come only from the shadows between the layers.

**Negative / settings:** glossy plastic, smooth CGI surface, glow, text, letters, teal-orange colour grade, floating particles, extra objects · aspect ratio 4:5.

The cream backdrop and orange come from this brief. Cream with a warm orange accent is also a palette models reach for when nobody chose one (`design-gate/no-ai-look` catalog section 1), so use it only when the brand or the brief asks for it.


## reference: prompt-brief.md


# Brief to Image

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Contents: Workflow · Prompt anatomy · Pick the image · Model differences · Failure modes · Worked example · Rules · Not an AI look · Related

Write the brief before making the first image.

This skill writes the brief and prompt. Generation happens in whatever image tool or plugin the user has. No generation tool → the fallback order (Scalable Vector Graphics (SVG) set, then Openverse photos) lives in `../SKILL.md`; this file covers the brief and the prompt.

## Workflow

0. **Find reference work before writing the brief** — every time; when a style lock sheet or brand kit already fixes the look, keep its palette and light and search only for composition and staging: research 3–5 pieces of strong real work in the same category (**ค้นต้นแบบก่อน:** run the project's keywords through a live search per `design-gate/design-references` (plugin `superuser`), type `illustration` or `social`, then pull the colours from the chosen work · use the stored palette bank only when live search is unavailable · award archives · competitor campaigns) · write 1 line per piece on *why it works* (composition · light · palette · type) · save links beside the brief in `briefs/<asset-name>.md` under "References" · the style, palette and light lines of the brief then cite these benchmarks, and tools that accept reference images get 1–2 of them · **references are a bar to clear, not a piece to copy** — the concept must stand at their level without imitating any one of them
1. **Ask 5 things** if missing: image style (pick from the style list in [`styles.md`](styles.md) — one style per set; unattended → pick from the use and log why; references from step 0 outrank the default list) · what must the image show · where it will be used (placement → aspect ratio, from `campaign-set`) · what text goes on it (usually none in the image — add text in layout) · brand kit or style lock sheet to follow
2. **Fill the brief** with the anatomy below; save it as `briefs/<asset-name>.md` using [prompt-anatomy.md](prompt-anatomy.md)
3. **Assemble the prompt** in anatomy order, most important first
4. **Generate 3–4 variations**, not 1. Pick with the score below, not by gut feeling
5. **Fix misses 1 element at a time** — wrong light? Change only the light line
6. **3 misses on 1 element** → the brief is wrong or the model cannot do it. Rewrite that element or change approach (edit, composite, photograph)
7. **Record the winning prompt, model name and version, seed and settings** next to the brief — that is the reusable asset

## Prompt anatomy (in this order)

| # | Element | Answers | Weak → strong |
|---|---|---|---|
| 1 | Subject | What, exactly, 1 focal point | "coffee" → "a glass of iced matcha latte with visible layers of green and milk" |
| 2 | Action / state | What is happening | → "condensation running down the glass" |
| 3 | Setting | Where | → "on a pale oak café counter, Bangkok shophouse interior blurred behind" |
| 4 | Composition | Framing, angle, negative space | → "eye-level, subject in left third, empty space top-right for headline" |
| 5 | Lens / camera | Focal length, depth of field | → "85mm, shallow depth of field, f/2" |
| 6 | Light | Direction, quality, time | → "soft window light from the right, late morning, gentle shadows" |
| 7 | Style | Medium and reference genre | → "editorial food photography, natural, not glossy" |
| 8 | Palette | 3–5 colours, dominant first | → "muted sage green, warm cream, pale wood, one amber accent" |
| 9 | Negatives | What must not appear | → "no text, no logo, no hands, no straw, no extra glasses" |
| 10 | Format | Aspect ratio, resolution | → "4:5 portrait" (set as a parameter if the tool has one) |

Lens and light vocabulary: see [prompt-anatomy.md](prompt-anatomy.md).
One tactile 3D object as the hero (paper cut, clay, felt): use the 8-line template (subject · material · light · shadow · lens · background · one colour · negatives) and its worked example in [prompt-anatomy.md](prompt-anatomy.md), section "Tactile 3D hero object".

## Pick the image (ตัดสินด้วยตัวเลข)

Use `decision-desk/decision-scoring` command `score` (`node decide.mjs score <file.json>`) on the 3–4 variations. The score picks among images that are already acceptable; taste is the user's final call.

| Part | Rule |
|---|---|
| Hard rules first (`must`, the variation is dropped) | physical-errors score below 3 (extra fingers, melted faces, floating objects) · garbled text when the brief asked for text · another brand's logo or an identifiable real person |
| Criteria, each scored 1–5 by a reviewer that did not generate the image (`better: high`) | matches the brief · text readable (leave out when the image has no text) · matches the style lock · crop-ready (room for the headline, survives the placements' ratios) · physical errors are **not** scored here: they are the hard rule above, counted once |
| Default weights (starting value, not yet measured · change per job) | brief 0.40 · style lock 0.30 · crop-ready 0.15 · text readable 0.15 |
| Hard to score directly | use `pairwise`: show each pair twice with positions swapped and record the winner; a pair whose winner flips with position counts as a tie |
| Result line | `ยังไม่นิ่ง` or a near tie → show the top 2 to the user and say which criterion splits them; they choose |

The script re-ranks with each weight moved ±20% and says whether rank 1 holds (`นิ่ง`); if it flips, treat the top 2 as a tie. These weights have not been compared with human rankings yet: before trusting them, have a person and the reviewer rank the same 5 real sets and count the matches.

Write the 1–5 scores and who gave them next to the brief (`briefs/<asset-name>.md`) with the winning prompt. A model that reviews its own output leans toward long or flashy images: use a different reviewer (scores with 1 reason each, at most 10 lines), and spot-check one score by eye.

## Model differences (general, check your tool's docs)

Model and tool differences (sentences vs phrases, negative field, aspect ratio, Thai text, version changes): [model-differences.md](model-differences.md).

## Failure modes — what to change when the image misses

| Miss | Change only this |
|---|---|
| Extra fingers, limbs, melted faces | Fewer people, hands out of frame or holding something; crop tighter |
| Garbled text or signage | Remove every word from the prompt; add copy in layout |
| 2 subjects where 1 was asked, or duplicated objects | "a single …", 1 focal point, remove plural nouns |
| Subject always centred | Composition line with an edge: "placed far left, touching the frame edge, empty wall right" |
| Negative word appears anyway ("no straw" gives a straw) | Describe what is there instead of what is not |
| Colour oversaturated, plastic look | Add "natural, muted, editorial, not advertising" and the hex palette |
| Set does not match across images | Style lock sheet (`brand-kit`) and the same seed or reference image |
| Wrong aspect ratio | Set the parameter, delete the ratio words from the prompt |

Gemini API users: Imagen models are being retired and the Gemini image model names change often, so no model list is stored here. Look up the current image model IDs and any shutdown dates at https://ai.google.dev/gemini-api/docs/image-generation and https://ai.google.dev/gemini-api/docs/deprecations; look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Record the exact model ID you used (workflow step 7).

## Worked example — brief to prompt

Request → brief → prompt → review for a matcha drink post: [prompt-worked-example.md](prompt-worked-example.md).

## Rules

- 1 brief per asset. A series shares a style lock sheet (`brand-kit`), not a copy-pasted prompt
- Never put the headline, price or Thai copy into the image prompt
- Generated people: no real, identifiable person without consent. No trademarked characters or logos of other brands
- Check the tool's terms for commercial use before using an output in an ad

## Not an AI look

Every prompt carries the items in `design-gate/no-ai-look` section 4 (named style, hex, light, what to avoid); the eye check (3.2) covers images.

## Related

- `brand-kit` — locking a look across many images
- `image-generation` — fixing an image instead of regenerating
- `design-review` — the check before it ships

## เรียกเป็นคำสั่ง

`/graphic-design:image-generation <what the image must show> [where it will be used]`

Run `image-generation` with the `art-director` agent for: **$ARGUMENTS**

Saves the brief to the project briefs folder. Generation and the consistency check both use this same brief.


## reference: prompt-worked-example.md

# Worked example — brief to prompt · image-generation

**Request:** "Need a picture for our new matcha drink post, make it nice."

**Brief (after asking):** Instagram (IG) feed 4:5 · headline will be added in layout top-right · brand kit: sage, cream, amber accent, natural editorial style.

**Prompt:**

> Editorial food photograph of a tall glass of iced matcha latte with distinct green and milk layers, condensation on the glass, standing on a pale oak café counter. Eye-level view, glass in the left third of the frame, clean cream wall with empty space in the upper right. 85mm lens, shallow depth of field, soft window light from the right in late morning, gentle shadows. Muted sage green, warm cream and pale wood palette with one small amber accent from a ceramic coaster. Natural and calm, not glossy advertising.

**Negative / settings:** text, logo, watermark, hands, straw, extra glasses, oversaturated colour · aspect ratio 4:5.

**Review:** variation 2 had the best layers but the glass was centred → only the composition line changed ("glass placed far left, edge of frame") → round 2 accepted.


## reference: styles.md

# Prompt wording by style

Build the prompt in this order: **the subject of the picture** (1 focal point that must be visible) + **the style line** (table below) + **the style block** from `docs/design/image-style.md` (colour, light, angle).
Always send the exclusions: `text, letters, watermark, logo` plus the extras for each style. Pass them the way the session's image tool accepts them (a negative prompt field if it has one; if not, append `Avoid: …` to the prompt). The examples below are written as `--negative` for readability.

| Style | Style line (English, which models understand better) | Extra negative |
|---|---|---|
| `photo` | `editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium` | `illustration, cartoon, 3d render, oversaturated, plastic skin` |
| `flat` | `flat vector illustration, simple geometric shapes, solid colour fills, no gradients, clean negative space` | `photo, realistic, 3d, texture, shadows` |
| `3d` | `tactile 3D object made of one named material (matte card stock with visible fibres, or polymer clay with faint fingerprints), one softbox from the upper left, dark contact shadow plus a soft cast shadow in the same direction, flat backdrop of the same material, one colour from the palette` · one object only · the 8-line template with an example is in [`prompt-anatomy.md`](prompt-anatomy.md), section Tactile 3D hero object | `glossy plastic, smooth CGI surface, glow, floating particles, teal-orange grade, gradient backdrop, vignette, clutter` |
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
| Social post | `4:5` (see `campaign-set` if present) |

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
