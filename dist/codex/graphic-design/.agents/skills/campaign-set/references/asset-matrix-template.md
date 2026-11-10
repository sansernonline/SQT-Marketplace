# Asset matrix template

Save as `02-exports/<campaign>/asset-matrix.md`. One row per file that will be published.

```markdown
# Asset matrix — <campaign code>

Campaign sentence: <one sentence>
Audience: <who> · Action: <one action> · Dates: <from–to>
Style lock: <sheet name + version> · Brand kit: <version>
Mandatory on every asset: <logo · price · ID · terms line>
Approver: <name> · Turnaround: <hours>

| ID | Placement | Platform | Canvas (px) | Ratio | Still / video | Length | Copy on image (TH / EN) | Max text | If longer | Alt text (TH, 1 line) | Derived from | Owner | Due | Review | Status | File name |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | Feed (master) | ig | 1080 × 1350 | 4:5 | Still | — | | headline 25 Thai chars · 2 lines | cut a line, or shrink ≤ 15%, or move to the caption | | — | | | ☐ | To do | |
| D1 | Story | ig/fb | 1080 × 1920 | 9:16 | Still | — | | | | | M1 | | | ☐ | To do | |
| D2 | | | | | | | | | | | M1 | | | ☐ | | |
| V1 | Reel / TikTok | tt/ig | 1080 × 1920 | 9:16 | Video | 15 s | | | | | M1 | | | ☐ | | |

**Max text** is counted without Thai tone marks and upper/lower vowels (the Netflix Thai count in `motion-basics`); 25 above is an example, set the real number from the master layout. Thai has no spaces, so break a longer line where `human-writing` `references/thai-line-breaking.md` allows. Sample row for a long product name: `M1 · "มัทฉะเย็นโอ๊ตมิลค์สูตรพิเศษ ขนาด 16 ออนซ์" · max 25 chars → 2 lines at 64 px · longer → drop the size to the caption`. Reference the brand kit's tokens by name (colour role, type style), not by hex or px, so a Canva template edit by the team follows a kit update. Idea from anthropics/knowledge-work-plugins `design/skills/design-handoff` (Apache-2.0 · rewritten · ตรวจ 2026-11-10).

Status values: To do · In progress · In review · Fix · Approved · Posted

## Sign-off
| Date | Rows approved | By |
|---|---|---|
```

## ID scheme

- `M` = master (one per ratio family at most)
- `D` = derived still
- `V` = video or motion
- `P` = print

IDs go into file names (`<campaign>-<id>-<asset>-<platform>-<format>-vNN`, the `asset-organize` pattern with its optional `<id>`; ID in lowercase) so a comment like "fix D3" finds one file.

## Before a row counts as done

1. Canvas and ratio match the row
2. Text inside the platform safe zone (`social-formats`)
3. Mandatory items present and identical to the card
4. Passes `design-review` (eight points)
5. Exported with the right name, standard RGB (sRGB), under the file-size limit
