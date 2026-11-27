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
