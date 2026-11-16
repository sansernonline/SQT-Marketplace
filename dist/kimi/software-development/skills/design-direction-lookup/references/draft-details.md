# How the draft works (`design_draft.py`)

```bash
python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
```

The draft works in this order:

1. Find the industry from the brief; if not found, the draft uses a temporary industry `custom` and picks the look and fonts from words in the brief (does not guess colors)
2. Order the directions as the industry row sets (look · palette · font pair, same position); if live colors were passed in, palettes are ordered as passed; then check each direction
3. **Drop directions that fail, then take the next one:** contrast below 4.5:1 for text or 3:1 for buttons and borders in either mode · has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist as the first font · a Thai font with no Latin partner, such as Noto Sans Thai alone
4. The looks of the 3 directions must not repeat · if the directions set by the industry are not enough, the draft fills in from looks found by the industry's words
   · the main colors of any 2 directions must be far apart in both RGB distance and hue (under 20 degrees counts as the same tone) · each direction uses a different page structure per look: large left-aligned type (editorial) · boxes of several sizes (bento) · toolbar with a dense table (dense)
5. Find 5 related UX rules (Thai rules go first when scores are close)
6. Write `docs/DESIGN.md` and the HTML comparison page (2-mode swatches · Thai headings and body in the real font · a line that checks vowels and tone marks · buttons · status badges) · **an existing file is not overwritten** unless `--force` is given

Text the draft generates passes the ad-word filter (ยกระดับ · ไร้รอยต่อ · seamless · elevate etc.; the Thai words mean "elevate" and "seamless") · if the source data has these words, the draft stops and tells you to fix the data

## Data

**The palettes in this set are a backup store for when live search is not possible · the looks and font pairs are also backup values, reviewed every 6 months** to match current trends (next review 2027-04-26 · `scripts/check/expiry.json` warns when the date is near) · with a network, always start from step 2

**Left out of this set on purpose** · icons: use one set across the whole app per `ui-craft` and `no-ai-look`, no table search needed · motion: each look already has a motion slot, details are in `ui-craft/references/depth-and-flourish.md` and `graphic-design:motion-basics` · Latin-only fonts: the font pairs already name the Latin font, and for the full list see fonts.google.com · stacks other than the 7 (Next.js · Vue · SwiftUI etc.) are added when real work needs them, not ahead of time

The CSV files in `data/` (multi-value fields separated by `;`) are checked by `scripts/check_data.py` · the search reads every file at startup, no need to build an index ahead of time

| File | Contents |
|---|---|
| `industries.csv` | Industry → personality · look · palette · font pair · cautions · deciding rules |
| `palettes.csv` | Backup color store by color role, 2 rows per id (light · dark) · used when there are no colors from a live search |
| `font-pairs.csv` · `thai-fonts.csv` | Thai-Latin pairs · smallest body size · line-height · licence |
| `looks.csv` | Looks of `ui-craft/references/web-looks.md` · depth · motion · prohibitions |
| `ux-rules.csv` · `charts.csv` · `landing.csv` · `stacks/<stack>.csv` | UX rules including Thai rules · charts · section order · per-framework rules |

If you add a new row and cannot find it with Thai words, put that word in the row's keywords column, because the dictionary segmentation is built from this column.

## A real example

**Brief:** "เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช ลูกค้า 35–60 ซื้อผ่านมือถือ" (a website selling gold jewelry, an old shop in Yaowarat, customers aged 35–60 buying on mobile)

**Run:** `python scripts/design_draft.py "<โจทย์>" --out _to_delete/gold/DESIGN.md --html _to_delete/gold/gold-design-directions.html`

**Result (run 2026-10-26):** matched `gold-shop` as rank 1 · direction A luxury + palette `gold-leaf` + fonts Chonburi/Taviraj · direction B editorial + `yaowarat-red` + Trirong/Taviraj · direction C Thai craft + `thai-silk` + Anuphan/IBM Plex Sans Thai · every palette passes contrast in both modes · 5 UX rules, for example money amounts use tabular-nums and show the last update time of the price · the end of DESIGN.md says palette `night-vault` was dropped because its main color on a light background got 2.91:1 · the comparison page passed `slop_scan.py` with no findings
