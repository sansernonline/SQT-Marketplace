---
name: image-editing-brief
description: Use when an image needs edits like a background swap
---

# Image Editing Brief

> **Pre-work gate (every time):** read the owner's theme → search live references for the result you want → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) · editing an existing image needs only 1 direction · close the work with a `ด่านก่อนลงมือ:` line

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

A story background run through 3 rounds (remove straw · remove stray cup · extend canvas 4:5 to 9:16): [`references/worked-example.md`](references/worked-example.md)

## Rules

- 1 edit brief version per round. Never rewrite the whole brief mid-edit
- The original file is the reference for every future edit
- Do not edit product labels, prices or certification marks with AI — retouch by hand or reshoot. A changed label is a false claim
- People: no edits that change a real person's identity, body or what they appear to say without their consent
- If the edit is larger than the keep list, it is a new image — go back to `brief-to-image`

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files. Fix AI tells (plastic skin, teal-orange grade, warped text) as part of the edit.

## Related

- `brief-to-image` — when regeneration is cheaper than editing
- `style-consistency` — keep the edited image on the set's style
- `design-review` — point 8 checks for artefacts after editing
