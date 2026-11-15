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

## Thesis file — long-term names (`thesis-<TICKER>.md`)

```markdown
# ABC — thesis (started YYYY-MM-DD)
Thesis (one sentence): ____________
Next review due: YYYY-MM-DD (at least quarterly, after results)

## Pillars (each checkable in a filing)
| # | Pillar | Number that proves it | Last value · as of |
|---|---|---|---|
| P1 |  |  |  |
| P2 |  |  |  |
| P3 |  |  |  |

## Break risks
| # | Risk | What would show it happened |
|---|---|---|
| R1 |  |  |
| R2 |  |  |

## Before the next results (from news-impact, results day)
3 numbers to watch: ______ · ______ · ______
If better than the thesis needs → ______   If as needed → ______   If worse → ______

## Update log (newest first · never edit old rows)
| Date | What is new (source, time) | Pillar / risk | Supports / weakens / neutral | Conviction after (high / medium / low) |
|---|---|---|---|---|
|  |  |  |  |  |
```

Two pillars weakened, or one break risk shown, means the thesis is invalidated: use the decision table in `watchlist-setup`.
