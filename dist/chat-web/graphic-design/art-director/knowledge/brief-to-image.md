# skill: brief-to-image

Use when about to generate an AI image or prompts keep missing. Writes the brief and the prompt.

# Brief to Image

Write the brief before making the first image. Vague prompts give vague images. A brief gives every retry the same target.

This skill writes the brief and prompt. Generation happens in whatever image tool or plugin the user has. No generation tool → the fallback order (Scalable Vector Graphics (SVG) set, then Openverse photos) lives in `image-generation`; this skill owns the brief and the prompt.

## Workflow

0. **Find reference work before writing the brief** — do this when the subject or category is new and no style lock exists; skip it when a style lock sheet or brand kit already fixes the look: research 3–5 pieces of strong real work in the same category (award archives, top results on Behance/Pinterest, competitor campaigns — method in `research-with-sources`, plugin `superuser`) · write 1 line per piece on *why it works* (composition · light · palette · type) · save links beside the brief in `briefs/<asset-name>.md` under "References" · the style, palette and light lines of the brief then cite these benchmarks, and tools that accept reference images get 1–2 of them · **references are a bar to clear, not a piece to copy** — the concept must stand at their level without imitating any one of them
1. **Ask 5 things** if missing: image style (`photo` · `flat` · `3d` · `watercolor` · `line` · `isometric` — one style per set; unattended → pick from the use and log why; references from step 0 outrank the default list) · what must the image show · where it will be used (placement → aspect ratio, from `social-formats`) · what text goes on it (usually none in the image — add text in layout) · brand kit or style lock sheet to follow
2. **Fill the brief** with the anatomy below; save it as `briefs/<asset-name>.md` using [prompt-anatomy.md](references/prompt-anatomy.md)
3. **Assemble the prompt** in anatomy order, most important first
4. **Generate 3–4 variations**, not 1. Pick by the brief, not by gut feeling
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

Lens and light vocabulary: see [prompt-anatomy.md](references/prompt-anatomy.md).
One tactile 3D object as the hero (paper cut, clay, felt): use the 8-line template (subject · material · light · shadow · lens · background · one colour · negatives) and its worked example in [prompt-anatomy.md](references/prompt-anatomy.md), section "Tactile 3D hero object".

## Model differences (general, check your tool's docs)

| Behaviour | What to do |
|---|---|
| Some models read full sentences best; others prefer comma-separated phrases | Write the brief as sentences; keep a phrase version if the tool responds better |
| Some tools have a separate negative-prompt field; others ignore "no X" or even add X | If no negative field, describe what *is* there instead ("plain cream wall" rather than "no clutter") |
| Aspect ratio is a parameter in most tools; typed ratios in the prompt are often ignored | Set the parameter; do not rely on the words |
| Text inside images is unreliable, worst for Thai script | Generate without text; add Thai copy in a layout tool with the brand font |
| Reference image, style reference or seed features exist in many tools | Use them for series work (`style-consistency`) |
| Models change between versions | Record the version; re-test a saved prompt after an update |

## Failure modes — what to change when the image misses

| Miss | Change only this |
|---|---|
| Extra fingers, limbs, melted faces | Fewer people, hands out of frame or holding something; crop tighter |
| Garbled text or signage | Remove every word from the prompt; add copy in layout |
| 2 subjects where 1 was asked, or duplicated objects | "a single …", 1 focal point, remove plural nouns |
| Subject always centred | Composition line with an edge: "placed far left, touching the frame edge, empty wall right" |
| Negative word appears anyway ("no straw" gives a straw) | Describe what is there instead of what is not |
| Colour oversaturated, plastic look | Add "natural, muted, editorial, not advertising" and the hex palette |
| Set does not match across images | Style lock sheet (`style-consistency`) and the same seed or reference image |
| Wrong aspect ratio | Set the parameter, delete the ratio words from the prompt |

Gemini API users: Imagen is no longer the way — the `imagen-4.0-*` models were shut down on 17 Aug 2026 per the deprecations page, and the image-generation page now lists `gemini-3.1-flash-image` (Nano Banana 2), `gemini-nano-banana-2.1` and `gemini-3-pro-image`, with `gemini-2.5-flash-image` kept as legacy. Record the exact model ID you used (workflow step 7). ตรวจ 2026-10-23 · แหล่ง: https://ai.google.dev/gemini-api/docs/image-generation · https://ai.google.dev/gemini-api/docs/deprecations

## Worked example — brief to prompt

**Request:** "Need a picture for our new matcha drink post, make it nice."

**Brief (after asking):** Instagram (IG) feed 4:5 · headline will be added in layout top-right · brand kit: sage, cream, amber accent, natural editorial style.

**Prompt:**

> Editorial food photograph of a tall glass of iced matcha latte with distinct green and milk layers, condensation on the glass, standing on a pale oak café counter. Eye-level view, glass in the left third of the frame, clean cream wall with empty space in the upper right. 85mm lens, shallow depth of field, soft window light from the right in late morning, gentle shadows. Muted sage green, warm cream and pale wood palette with one small amber accent from a ceramic coaster. Natural and calm, not glossy advertising.

**Negative / settings:** text, logo, watermark, hands, straw, extra glasses, oversaturated colour · aspect ratio 4:5.

**Review:** variation 2 had the best layers but the glass was centred → only the composition line changed ("glass placed far left, edge of frame") → round 2 accepted.

## Rules

- 1 brief per asset. A series shares a style lock sheet (`style-consistency`), not a copy-pasted prompt
- Never put the headline, price or Thai copy into the image prompt
- Generated people: no real, identifiable person without consent. No trademarked characters or logos of other brands
- Check the tool's terms for commercial use before using an output in an ad

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there. Every prompt carries the items in its section 4 (named style, hex, light, what to avoid).

## Related

- `style-consistency` — locking a look across many images
- `image-editing-brief` — fixing an image instead of regenerating
- `design-review` — the check before it ships


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

One physical-looking object as the hero of a post or page (paper cut, clay, felt, wood). Generic "soft 3D render, clay, studio lighting" prompts give the glossy CGI look that `no-ai-look` flags; these 8 lines name what a real object has. One line each, in this order, then set the aspect ratio as a parameter.

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

The cream backdrop and orange come from this brief. Cream with a warm orange accent is also a palette models reach for when nobody chose one (`no-ai-look` catalog section 1), so use it only when the brand or the brief asks for it.
