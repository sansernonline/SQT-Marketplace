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
