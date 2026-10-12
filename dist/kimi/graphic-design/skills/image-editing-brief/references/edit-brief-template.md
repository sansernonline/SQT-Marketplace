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
