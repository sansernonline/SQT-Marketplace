# skill: watchlist-setup

Use when starting to follow new stocks or rebuilding a messy watchlist. Thesis, entry, alerts.

# Watchlist Setup (รายชื่อหุ้นที่จับตา)

Turn "I want to watch some stocks" into a short list where every name has a reason. Template: [references/watchlist-template.md](references/watchlist-template.md). General information, not investment advice.

## Workflow

1. **Context** — capital, horizon (day / swing weeks / long-term years), markets reachable (SET, mai, SET-listed DRs (Depositary Receipts) for foreign stocks, offshore via broker), and whether dividends or growth matter more.
2. **Limit the list** — max **10 names** (swing) or **15** (long-term). More means none get real attention. Rank by conviction; cut the bottom.
3. **Per symbol record**
   - ticker, market, sector, as-of date of every number
   - **thesis** — one falsifiable sentence ("EPS growing 20%+ two quarters in a row while P/E is below its 5-year average")
   - **trigger / entry zone** — price zone or event that makes it actionable
   - **invalidation** — price or event that kills the thesis (from `technical-signals` for levels)
   - **liquidity** — 20-day average daily value traded; flag if under ~5 million baht (wide spreads, hard to exit)
   - **calendar** — next earnings (quarterly results due within 45 days of quarter end; annual audited results within 2 months, or 3 months if a reviewed Q4 statement is filed), XD date, AGM
   - **alerts** — price above/below, % move, volume spike — set in the broker app (Streaming, Settrade) or via the `alert-dispatcher` agent
4. **Check SET market signs** on each name before adding: the C signs `CB` `CS` `CC` `CF` (caution; there is no plain `C`), `SP` (suspended), `H` (halt), `NP` / `NR` (notice pending / received), and whether it is on the SET market surveillance lists (Cash Balance, Turnover List). A name under trading measures needs a cash account and is a red flag for a beginner.

ตรวจล่าสุด 2026-10-26 · แหล่ง: เครื่องหมาย https://www.set.or.th/en/market/information/trading-procedure/trading-signs , https://www.set.or.th/en/listing/listed-company/simplified-regulations/disclosure/c-sign-posting , https://media.set.or.th/rulebook/circular-letter/attachment-file/237.pdf · กำหนดส่งงบ https://www.set.or.th/en/listing/listed-company/simplified-regulations/disclosure/periodic-disclosure , https://www.sec.or.th/TH/Documents/Report56/FAQ-FinancialStatement-issuer.pdf , https://publish.sec.or.th/nrs/10198s.pdf
5. **Save** as `watchlist.md` (or `.csv`) in the finance folder; date the file.

## Decision table — add, keep or drop

| Situation | Action |
|---|---|
| No written thesis | Do not add; if already listed, delete at next review |
| Thesis invalidated (level broke or event happened) | Drop now — no "wait and see" |
| Entry zone hit, thesis intact | Move to the decision step: `position-sizing` then `trade-journal` |
| Nothing happened for 3 months | Re-read the thesis; keep it if still valid, otherwise drop |
| Added because "it moved a lot today" | Not allowed — that is chasing, not watching |
| Under Cash Balance / caution sign | Long-term list only, with a note why |

## Rules

- Review the full list **monthly** (`/watch review`); dead theses go out with no attachment.
- One line per name in reviews — if it needs a paragraph, the thesis is not clear.
- Data from whatever market-data plugin is installed; if none, say so and use free public pages (set.or.th company pages), always with the as-of date.

## Worked example (illustrative)

User: swing trader, 200,000 baht, SET only. Adds ABC.

| Field | Value |
|---|---|
| Ticker / market / sector | ABC · SET · Commerce |
| Thesis | Same-store sales growth turned positive for 2 quarters; price still in a 6-month range 44–48 |
| Entry zone | Daily close above 48.00 on volume ≥ 1.5× 20-day average |
| Invalidation | Close below 44.00, or next quarter same-store sales negative |
| Liquidity | ~60 million baht/day — fine |
| Calendar | Q3 results expected by mid-November; no XD this quarter |
| Alerts | price ≥ 48.00 · price ≤ 44.00 · volume ≥ 2× average |
| As of | 2026-10-06 |

Command: `/watch add|review|clean`. Next steps: read the chart with `technical-signals`, size with `position-sizing`.


## reference: watchlist-template.md

# Watchlist template

## Markdown version (`watchlist.md`)

```markdown
# Watchlist — updated YYYY-MM-DD
Horizon: swing | long-term    Max names: 10    Next review: YYYY-MM-DD

| # | Ticker | Mkt | Thesis (one sentence) | Entry zone / trigger | Invalidation | Avg value/day | Next event | Alerts set | As of |
|---|---|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |  |  |
```

## CSV version (`watchlist.csv`)

```csv
rank,ticker,market,sector,thesis,entry_zone,invalidation,avg_value_mb,next_event,next_event_date,alerts,signs,added,last_review,as_of
```

## Monthly review card

```
Name ______  Thesis still true? Y/N   Invalidation hit? Y/N
Entry zone hit? Y/N → if Y, sized and journaled?  Y/N
Keep / drop / move to long-term   Reason (one line): ____________
```
