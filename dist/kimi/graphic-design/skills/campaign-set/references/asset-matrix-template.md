# Asset matrix template

Save as `02-exports/<campaign>/asset-matrix.md`. One row per file that will be published.

```markdown
# Asset matrix — <campaign code>

Campaign sentence: <one sentence>
Audience: <who> · Action: <one action> · Dates: <from–to>
Style lock: <sheet name + version> · Brand kit: <version>
Mandatory on every asset: <logo · price · ID · terms line>
Approver: <name> · Turnaround: <hours>

| ID | Placement | Platform | Canvas (px) | Ratio | Still / video | Length | Copy on image (TH / EN) | Derived from | Owner | Due | Review | Status | File name |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | Feed (master) | ig | 1080 × 1350 | 4:5 | Still | — | | — | | | ☐ | To do | |
| D1 | Story | ig/fb | 1080 × 1920 | 9:16 | Still | — | | M1 | | | ☐ | To do | |
| D2 | | | | | | | | M1 | | | ☐ | | |
| V1 | Reel / TikTok | tt/ig | 1080 × 1920 | 9:16 | Video | 15 s | | M1 | | | ☐ | | |

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

IDs go into file names (`<campaign>-<id>-<platform>-<format>-vNN`) so a comment like "fix D3" finds one file.

## Before a row counts as done

1. Canvas and ratio match the row
2. Text inside the platform safe zone (`social-formats`)
3. Mandatory items present and identical to the card
4. Passes `design-review` (eight points)
5. Exported with the right name, sRGB, under the file-size limit
