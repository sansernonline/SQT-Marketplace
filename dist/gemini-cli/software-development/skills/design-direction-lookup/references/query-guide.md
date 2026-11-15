# How to search design data

For use with `scripts/design_search.py` · search works in Thai, English and a mix, because the searcher segments Thai words itself and has a Thai-English synonym table

## How to search so you find it

- **1 search, 1 intent, 2–5 words** such as `ร้านทองออนไลน์` · `date picker พ.ศ.` · `ฟอนต์ไทยมีหัว ทางการ`. If you paste a whole paragraph, the irrelevant words spread the score thin.
- **Pick the domain that matches the question.** If you give none, the searcher assumes `industry`.

| You want to know | domain | Example queries |
|---|---|---|
| What personality, look, colours and fonts this business should have | `industry` | `คลินิกทันตกรรม` · `cooperative savings` |
| Backup palette library, 2 modes by mood or material (search live first, use the library when live search is not possible) | `palette` | `ทอง หรู` · `calm green` |
| Thai-Latin font pairs | `font` | `มีหัว ทางการ` · `rounded friendly` |
| Look (depth, motion, prohibitions) | `look` | `editorial` · `งานมือไทย` |
| UX rules and Thai rules | `ux` | `ช่องวันที่ พ.ศ.` · `touch target` |
| Which chart fits this data | `chart` | `แนวโน้มยอดขายรายเดือน` |
| Section order of the home page | `landing` | `สั่งซื้อผ่าน LINE` · `booking` |
| Framework-specific rules | `stack` + `--stack <name>` | `ฟอร์ม validation --stack blazor` |

- To see the available stack names: open the `data/stacks/` folder (1 file per stack), or search with a name that does not exist and the searcher will list the names
- To use the result further in a script, add `--json` · to get more than 3 rows, add `-n 10`

## When the search finds nothing

The searcher answers "ไม่พบที่ตรง" (no match found) when the words of the request that exist in the data are covered less than 25 %. Do this in order:

1. Switch to the words people in that field use, or switch language once (`ร้านขายยา` → `pharmacy`)
2. If it still finds nothing, tell the user plainly that the data has no row for this, choose the closest row yourself, and write it under `## ตัดสินใจเอง` (decided on my own)
3. Never invent an id, colour or font the searcher did not return and tell it as if it came from the data

## Reading the result

- `คะแนน` (score) is BM25, and is for comparing only within one query, not across queries
- `ครอบคลุม` (coverage) is the share of the query's words (weighted by rarity) that the row has · below 50 % means a partial match, so look at the row before using it
- A palette returns 1 result per id, but `--json` has both modes (`rows`)

## Measuring accuracy

`python scripts/design_search.py --eval references/relevance-cases.json` reports the % of cases where the expected id is in the top 3, split into the calibration set and the holdout set, and split into Thai and English · you may fix the searcher or the queries in the calibration set · **never edit a holdout case to make it pass**, because that set exists to measure whether the searcher works on words it has never seen
