# Check the user's spreadsheet before trusting it

Used by `trade-journal` (review mode) and `portfolio-snapshot` when the user's own Excel or Google Sheets file is the source. A wrong formula in the user's sheet turns every number after it wrong, and the review then teaches the wrong lesson.

Open the file with the `xlsx` skill (Anthropic's built-in) when it is installed; otherwise ask the user to export CSV and say formulas could not be checked. Read formulas, not only the shown values.

## The 9 checks

| # | Check | What to look for | Typical damage in a journal or portfolio sheet |
|---|---|---|---|
| 1 | Error cells | `#REF!` `#VALUE!` `#N/A` `#DIV/0!` `#NAME?` | A total that silently skips the broken row |
| 2 | Numbers typed into formulas | `=B2*0.0017` or `=C5*1.07` — a rate that should sit in its own cell | Commission or VAT rate changed but old rows still use the typed one |
| 3 | A formula that breaks the column pattern | Row 37 uses a different formula from rows 2–36 | One trade's P/L or R is computed differently |
| 4 | Ranges that miss rows | `SUM(F2:F99)` while trades run to row 120; first or last row left out | Win rate and total P/L leave out the newest trades |
| 5 | Values pasted over formulas | A cell that looks computed but is a typed number | Stale P/L that never updates with the price |
| 6 | Circular references | A cell that depends on itself | Numbers that change on every recalculation |
| 7 | Links to other files or moved sheets | `[old.xlsx]Sheet1!A1`, references to deleted tabs | Prices or costs from a file that no longer updates |
| 8 | Units and percent | Thousands mixed with baht; `5` meaning 5% next to `0.05` | Weights or returns 100 times off |
| 9 | Hidden rows, columns or tabs | Rows or tabs set to hidden | Old trades or manual overrides nobody sees |

Model-integrity checks for company models (balance sheet ties, cash-flow ties, discounted cash flow) are left out; they do not apply to a personal journal or holdings list.

## Report

One table: sheet · cell or range · check number · what is wrong · effect on the review. Fix nothing in the user's file without asking; propose the fix and let the user apply it, or work from a corrected copy and say so. Then run the plugin script (`trade-stats.mjs`, `money-calc.mjs`) on the corrected numbers, not the sheet's own totals.

## Source

Checks adapted from `audit-xls` step 2, anthropics/financial-services (Apache-2.0, viewed 2026-11-10) — reworded for personal sheets; model-integrity step dropped.
