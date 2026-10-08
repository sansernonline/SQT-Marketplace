---
name: brief-to-image
description: Use when about to generate an AI image or prompts keep missing. Writes a brief and prompt (subject, composition, lens, light, style, palette, negatives).
---

# Brief to Image

Write the brief before making the first image. Vague prompts give vague images. A brief gives every retry the same target.

This skill writes the brief and prompt. Generation happens in whatever image tool or plugin the user has.

## Workflow

1. **Ask 4 things** if missing: what must the image show · where it will be used (placement → aspect ratio, from `social-formats`) · what text goes on it (usually none in the image — add text in layout) · brand kit or style lock sheet to follow
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

## Model differences (general, check your tool's docs)

| Behaviour | What to do |
|---|---|
| Some models read full sentences best; others prefer comma-separated phrases | Write the brief as sentences; keep a phrase version if the tool responds better |
| Some tools have a separate negative-prompt field; others ignore "no X" or even add X | If no negative field, describe what *is* there instead ("plain cream wall" rather than "no clutter") |
| Aspect ratio is a parameter in most tools; typed ratios in the prompt are often ignored | Set the parameter; do not rely on the words |
| Text inside images is unreliable, worst for Thai script | Generate without text; add Thai copy in a layout tool with the brand font |
| Reference image, style reference or seed features exist in many tools | Use them for series work (`style-consistency`) |
| Models change between versions | Record the version; re-test a saved prompt after an update |

## Worked example — brief to prompt

**Request:** "Need a picture for our new matcha drink post, make it nice."

**Brief (after asking):** IG feed 4:5 · headline will be added in layout top-right · brand kit: sage, cream, amber accent, natural editorial style.

**Prompt:**

> Editorial food photograph of a tall glass of iced matcha latte with distinct green and milk layers, condensation on the glass, standing on a pale oak café counter. Eye-level view, glass in the left third of the frame, clean cream wall with empty space in the upper right. 85mm lens, shallow depth of field, soft window light from the right in late morning, gentle shadows. Muted sage green, warm cream and pale wood palette with one small amber accent from a ceramic coaster. Natural and calm, not glossy advertising.

**Negative / settings:** text, logo, watermark, hands, straw, extra glasses, oversaturated colour · aspect ratio 4:5.

**Review:** variation 2 had the best layers but the glass was centred → only the composition line changed ("glass placed far left, edge of frame") → round 2 accepted.

## Rules

- 1 brief per asset. A series shares a style lock sheet (`style-consistency`), not a copy-pasted prompt
- Never put the headline, price or Thai copy into the image prompt
- Generated people: no real, identifiable person without consent. No trademarked characters or logos of other brands
- Check the tool's terms for commercial use before using an output in an ad

## Related

- `style-consistency` — locking a look across many images
- `image-editing-brief` — fixing an image instead of regenerating
- `design-review` — the check before it ships
