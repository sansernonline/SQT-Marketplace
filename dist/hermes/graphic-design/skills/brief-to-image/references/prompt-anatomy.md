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
