# skill: style-consistency

Use when a series of AI or shot images must look like one set (product line, posts, recurring character).

# Style Consistency

Goal: 10 assets that look like one person made them. AI images drift by default: each generation picks its own light, palette and lens unless something fixes them.

## Workflow

1. **Pick 1–3 anchor images** — the approved hero, or reference photos that show the look
2. **Write the style lock sheet** with [style-lock-sheet.md](references/style-lock-sheet.md) before generating anything else
3. **Build the style block** — the fixed part of every prompt (light, lens, palette, style, negatives); only the subject line changes per image
4. **Lock the tool settings** — same model and version, same aspect-ratio family, same style/reference image, seed where it helps
5. **Generate in batches** of 4–8 and lay them out side by side, never judge one alone
6. **Run the checklist** below on each; reject early
7. **Log** the accepted prompt, seed and settings in the sheet; a change to the look is a new sheet version

## Ways to hold a style (general tool features)

| Technique | Holds | Limits |
|---|---|---|
| Fixed style block in every prompt | Light, lens, palette, mood | Wording alone drifts across subjects |
| Style or reference image | Colour, texture, rendering style | Can copy the reference's content too — use a neutral one |
| Character or subject reference | A recurring person, mascot or product | Needs clear front and side references; check identity every image |
| Same seed | Composition family for similar prompts | Breaks when the subject changes a lot |
| Same model version | Everything | A model update changes the look — re-test the sheet |
| Post-processing preset (Look-up table (LUT), Lightroom preset, same grain) | Colour and finish across all images | Cannot fix wrong light direction |
| Shared layout template | Text position, logo, margins | — |

## Consistency checklist (per image)

| # | Check | Pass when |
|---|---|---|
| 1 | Palette | Dominant colour and accents from the sheet; no off-sheet colour larger than a small detail |
| 2 | Light | Same direction, quality and colour temperature as the sheet |
| 3 | Lens and angle | Same focal family and camera height |
| 4 | Composition | Subject and text area in the sheet's grid positions |
| 5 | Texture and finish | Same grain, sharpness, depth of field |
| 6 | Motif | The recurring element is present |
| 7 | Character / product identity | Same face, proportions, label, colours |
| 8 | Stranger test | Placed in a grid with the others, a stranger would not pick it as the odd one out |

Fail on any → reject or send to `image-editing-brief`; do not keep "because it is done".

## Worked example — style block

Sheet: "Matcha26 v1". Anchor: approved hero.

**Style block (constant):**
> Editorial food photography, soft window light from the right in late morning, 85mm lens, shallow depth of field, eye-level. Muted sage green, warm cream and pale oak palette with one small amber accent. Calm, natural, matte finish, fine film grain. Clean cream wall background with empty space in the upper right.

**Negatives (constant):** text, logo, hands, straws, oversaturated colour, busy background.

**Subject lines (variable):**
- "A ceramic cup of hot matcha with a leaf of foam art."
- "A matcha cheesecake slice on a small cream plate."
- "A paper takeaway cup with a plain cream sleeve."

Grid check of 6 images: #4 came out with blue-hour light → fails check 2 → regenerated with the same seed and "late morning" moved to the front of the block → accepted.

## Rules

- Write the sheet before the first generation, not reverse-engineered after
- One sheet per campaign; a "slightly different" style is a new sheet
- Mid-campaign changes need a version bump and a reason in the log
- Keep the sheet in the campaign folder next to the asset matrix

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there. Lock the style against its section 4 so the whole series avoids the same AI defaults.

## Related

- `brief-to-image` — per-image briefs that start from the style block
- `brand-kit` — the sheet must not break the kit
- `design-review` — point 7 compares siblings
- `campaign-set` — one sheet per campaign


## reference: style-lock-sheet.md

# Style lock sheet template

Save as `02-exports/<campaign>/style-lock-v<N>.md`. Fill every line; "TBD" means the look is not locked yet.

```markdown
# Style lock — <campaign> v<N>

Brand kit: <version> · Owner: <name> · Locked on: <yyyy-mm-dd>
Anchor images: <file names, 1–3>

## Look
| Element | Locked value |
|---|---|
| Medium / style | (e.g. editorial food photography / flat vector / 3D clay) |
| Light | (direction, quality, time, colour temperature) |
| Lens and angle | (focal length family, camera height) |
| Depth of field | |
| Palette | (hex, dominant first, share %) |
| Texture / finish | (grain, matte or gloss, sharpness) |
| Background | |
| Motif | (the recurring element) |
| Composition grid | (subject position, text area, logo position) |
| Characters / products | (reference image names, must-match details) |

## Style block (paste into every prompt)
<constant text>

## Constant negatives
<list>

## Tool lock
Tool: <name> · Model version: <...> · Aspect ratios used: <...>
Style / reference image: <file> · Strength: <value> · Seed policy: <fixed n / free>
Post-processing: <preset / Look-up table (LUT) name>

## Off-style examples (do not)
- <file> — why
- <file> — why

## Accepted log
| File | Subject line | Seed | Date | Checked by |
|---|---|---|---|---|

## Version history
| Version | Date | Change | Reason |
|---|---|---|---|
| v1 | | Initial | |
```

## Recurring character sheet (add when a mascot or model repeats)

| Item | Value |
|---|---|
| Name / code | |
| Reference images | front · side · three-quarter · full body |
| Fixed features | face shape, hair, eye colour, outfit colours (hex), accessories |
| Age range, build | |
| Expressions allowed | |
| Never | (e.g. no change of outfit colour, no glasses) |

For real people: written consent covering AI-generated variations and where they will be used.


---

# skill: image-editing-brief

Use when an existing or AI image needs a change (remove object, fix colour, swap background, upscale).

# Image Editing Brief

Change only what the brief names. AI edits drift: ask for a new cup and the lighting, the face and the palette change too. The keep list is the anchor.

## Workflow

1. **Name the problem precisely** — "make it better" is not an edit. Ask what is wrong and where
2. **Choose the edit type** from the table below — it decides the tool feature and the instruction style
3. **Write the brief** with [edit-brief-template.md](references/edit-brief-template.md): keep list, change list, mask area
4. **Save the original** as `<name>-v01` before any edit. Each edit is a new version. Never overwrite
5. **Make 1 change per round** when the tool allows. Several changes at once make the drift worse
6. **Check the keep list first**, then the change. A perfect change that broke the lighting is a fail
7. **Stop at round 3** on the same change — re-brief, composite by hand, or regenerate from `brief-to-image`

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

**Image:** story background, iced matcha on a counter; text area top-right.
**Problem:** a straw appears (brand rule: no straws in photos), a stray cup on the right, and the image is 4:5 but the story needs 9:16.

| Round | Change | Mask / setting | Result |
|---|---|---|---|
| 1 | Remove straw — "glass rim with no straw, same condensation" | Mask straw + 10 px | Pass; keep list intact |
| 2 | Remove right cup — "continue the oak counter and blurred shop interior" | Mask cup and its shadow | Pass after 1 retry (first try left a shadow) |
| 3 | Extend top by 42% for 9:16 — "continue the cream wall, no objects" | Outpaint top only | Pass; top area is clean text space |

Verification: face of glass, layer colours, light from right, palette — all unchanged. Saved as `matcha26-bg-v04.png`.

## Rules

- 1 edit brief version per round. Never rewrite the whole brief mid-edit
- The original file is the reference for every future edit
- Do not edit product labels, prices or certification marks with AI — retouch by hand or reshoot. A changed label is a false claim
- People: no edits that change a real person's identity, body or what they appear to say without their consent
- If the edit is larger than the keep list, it is a new image — go back to `brief-to-image`

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there. Fix AI tells (plastic skin, teal-orange grade, warped text) as part of the edit.

## Related

- `brief-to-image` — when regeneration is cheaper than editing
- `style-consistency` — keep the edited image on the set's style
- `design-review` — point 8 checks for artefacts after editing


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
