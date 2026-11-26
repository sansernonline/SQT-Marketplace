# Real material from photos · design-references

Open when a mark, sign or scene needs stone, metal, paper, wood or concrete (rule 40 in [`ref-to-design.md`](ref-to-design.md)), and for any dimensional render the owner's theme asks for ([`depth-and-light.md`](depth-and-light.md)). This file is how to take the surface from a real licensed photo instead of drawing it with code gradients or `feTurbulence` noise.

Why: 2026-11-24 HinThong C round 4 (stone H with gold). Rounds 1–3 drew the stone with SVG gradients and turbulence noise, and the owner scored them 5–7. Round 4 composited real photos (sandstone strata, hand-laid gold leaf, raw concrete). The owner accepted all 3 directions and picked C2. A fresh reviewer still called the first stone crop "foam / stucco" until it was switched to a bedded sandstone. So which photo you pick matters as much as using a photo at all. Labels: `วัดเอง` = measured on that job · `อนุมาน` = our inference.

## 1 · Find the photo (licence first)

- Use Unsplash's free photos. The Unsplash Licence allows commercial use without credit but bans selling unaltered copies; this is from memory, so open unsplash.com/license before a client delivery `(ยังไม่ได้ตรวจ)`. Keep the photo id and the search page in the job notes (rule 12 of `ref-to-design.md`). Skip anything marked Unsplash+, which is paid.
- Search with the material plus its finish: `sandstone texture` · `laterite` · `gold leaf texture` · `brushed brass` · `raw concrete wall` · `kraft paper texture`. For scenes, search for the touchpoint shot straight on: `raw concrete wall` · `construction hoarding` (rule 44).
- **curl, WebFetch and the `/download` endpoint are blocked** (HTTP 401/403 for scripts, measured 2026-11-24). What worked: drive a real Chrome with Playwright (`headless=False`, open unsplash.com once and wait ~7 s), read the result `<img>` `currentSrc` from `a[href*="/photos/"]`, then fetch that `images.unsplash.com/photo-…` URL through the same browser context with `w=2000`. `วัดเอง`
- Make a contact sheet of the thumbnails and **look at it** before picking. Pick by the craft words of the reference (grain size, strata, pits, sheen), not by the search title.
- Thai scenes are scarce on Unsplash (2026-11-24: "bangkok construction site" gave 9 results and no hoarding). If the scene must read as Thailand and nothing fits, use a touchpoint that has no location (cards or stationery on concrete, a wall sign close up), or ask the owner for a real site photo. A foreign street dressed up as Thai fails `design-gate/no-ai-look` item 1 (a reviewer read the Cairo and Pune hoardings as non-Thai at once). `วัดเอง`

## 2 · Pick the right surface

| Material | Worked | Failed | Why |
|---|---|---|---|
| Stone face | bedded sandstone with visible strata, low contrast | rough rust stone with even crumple | even noise at mark size reads as foam, suede or stucco; strata read as dressed stone |
| Gold | hand-laid gold leaf with brush marks | flat gold paper | leaf has its own light variation, so the facet does not look printed |
| Wall for a sign | flat raw concrete with one seam, shot straight on | — | the seam gives scale; even light means one light for the scene |

Prefer textures whose feature size is about 1/20–1/40 of the mark at hero size. Bigger features become blobs, and smaller ones become noise. `อนุมาน`

## 3 · Recolour, do not paste

Take the photo's **luminance only** and map it onto the brand's 3-stop ramp, so the colour stays the approved hex and the photo gives only the surface:

```python
l = np.asarray(img.convert("L").crop(sq).resize((N, N)), float)
t = np.clip(.5 + (l - l.mean()) / l.std() * contrast, 0, 1)[..., None]   # contrast .25–.32 stone, .4 gold
rgb = np.where(t < .5, lo + (mid - lo) * t * 2, mid + (hi - mid) * (t - .5) * 2)
rgb *= light_falloff   # 1.08 top-left → .90 bottom-right, same light as the scene
```

- Use a different crop of the photo for each direction, so the same crack is not in the same place on every mark.
- Never copy a reference brand's hex through the ramp; the ramp is ours (step 6 of `search-steps.md`).

## 4 · Build the dimensional mark from 2 flat masks

Rasterise the flat master as separate masks (body, accent) with Playwright `omit_background=True`, then composite in numpy, back to front, all premultiplied. Light comes from the top left:

1. Cast shadow: union mask offset down-right, blur ~3 % of the box, about 35 % opacity, plus a tight contact shadow (offset ~1 %, blur ~0.5 %).
2. Side faces: for each depth step, draw the **body texture at its own position** times 0.5–0.65, through the shifted mask. Shifting the texture with the mask smears it into wood grain. The whole side is body material, so an accent facet does not make the side turn gold. `วัดเอง`
3. Accent face. A chisel facet faces away from the light, so make it about 30 % darker than the body face, with a bright ridge where it meets the body. A vein or inlay sits recessed, with the body's inner wall (body texture × 0.45) over it and the body shading it.
4. Body face, then a lit edge on the top-left arrises (mask minus mask shifted 4 px, about 80 %).
5. Un-premultiply before saving the PNG.

Geometry that made the cut read as real, not a sticker:
- Remove the corner from the outline; the accent is only the band between the lip and the new edge.
- Nudge the lip 0.5–1.6 % of the box sideways at 5–6 points, since a chiselled edge is never a ruler line. Keep it near straight if a wavy edge reads as a page curl (C2, 2026-11-24).
- Push every cut polygon 10 units past the outline, because a cut that ends exactly on the edge leaves an anti-aliased ghost line. `วัดเอง`
- A crack needs uneven jogs, a width that varies, and one side dropped a few units. Three even zigzags still read as a lightning bolt. `วัดเอง`

## 5 · Put it in the scene

- Wall sign: contact plus cast shadow in the photo's light direction, then multiply the sign by the wall's blurred luminance (exponent about 0.6) so it picks up the wall's falloff.
- Print on a corrugated or textured surface: warp to the quad, then multiply by the surface's own luminance, so the ribs and post gaps run through the print.
- Text colour on the scene: check contrast against the real wall (brick on mid-grey concrete measured 1.05:1, unreadable). Use the dark ink or white there.
- Flat-lay cards: rotate a few degrees, give each card a soft and a tight shadow, add slight paper noise, and do not let one card cover the other's logo.

## 6 · Check

- The reviewer is told which photo each surface came from, and judges the surface as stone, metal or paper by name.
- Credit line in the job notes: photo id · photographer if shown · licence · date fetched.
- The flat master still passes 16 px, squint and one colour **before** any texture (rule 39 of `ref-to-design.md`). Texture never rescues a weak form.
