---
name: image-generation
description: Use when images are needed, as a route, brief, prompt or edit
---

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
