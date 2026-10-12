---
name: news-impact
description: Use when the user asks what news matters today for their stocks. Filters headlines against watchlist and portfolio, keeps up to 5 that move earnings, rules or liquidity.
---

# News Impact (ข่าวที่กระทบพอร์ตจริง)

Most market news is entertainment. This finds the few items that move the user's list. General information, not investment advice.

## Sources — primary first

| Rank | Source | Why |
|---|---|---|
| 1 | SET company news (ข่าวบริษัทจดทะเบียน on set.or.th / Settrade) — financial statements, board resolutions, dividends, capital increases, XD/XR/XM, SP/H/NP signs | The company's own filing; the fact itself |
| 2 | SEC Thailand news (sec.or.th) — enforcement, licence actions | Regulatory facts |
| 3 | Bank of Thailand / MPC rate decisions, NESDC GDP, Ministry of Commerce CPI | Macro facts with dates |
| 4 | Business press (Thai and international) | Context, faster but second-hand |
| 5 | Analyst notes, broker research, social media, LINE groups | Opinion — label as such; social posts are not sources |

Use whatever news or market-data plugin is installed; if none, say so and use public pages with dates.

## Workflow

1. Load watchlist and portfolio symbols (`watchlist-setup`, `portfolio-snapshot`) plus their sectors.
2. Gather headlines since the last run (default 24 hours; Monday = since Friday close).
3. **Filter** — for each item ask: which symbol on my list does it touch, and does it change **earnings, regulation, or liquidity**? If it touches none of the three, it is noise; drop it.
4. **Classify** each survivor: `fact` (filed/announced) or `opinion` (someone's view); `scheduled` (earnings, XD, AGM) or `surprise`.
5. **Rank** by impact × confidence (decision table below). Keep at most **5**.
6. Write one line each: what happened · which symbol · what to watch next (the price or date that would confirm or deny the impact).
7. If an item hits a thesis or invalidation on the watchlist, say so explicitly and point to `watchlist-setup` review.

## Impact decision table

| Item type | Usually impact | Note |
|---|---|---|
| Earnings vs expectations, guidance change | High | Check the actual filing, not the headline number |
| Capital increase (เพิ่มทุน), PP at discount, warrants | High | Dilution — compute the new share count |
| SP / H / NP sign, auditor qualification, late statements | High | Liquidity and trust risk; can freeze an exit |
| Trading measures (Cash Balance, Turnover List) | High for liquidity | Margin no longer usable |
| Dividend declaration / cut | Medium–high | Send to `dividend-tracker` |
| Policy rate change, sector regulation | Medium | Which holdings are rate-sensitive (banks, property, utilities) |
| Major shareholder buying/selling (form 59 / 246-2) | Medium | Fact, but motive unknown |
| Analyst upgrade / target price | Low | Opinion |
| "Market falls on global worries" | Usually noise | Unless a holding has direct exposure |

## Rules

- Never more than **5 items** — more means nothing was filtered.
- Separate "happened" from "someone says"; label opinion.
- Always give the time of the item and the as-of time of any price quoted.
- If nothing passes, say "nothing that matters to your list today" — a valid, useful answer.
- Do not turn news into a buy/sell call; give what to watch, the decision stays with the user.
- A "news" item urging a quick purchase via a link, a LINE group or a guaranteed return is a scam signal — route to `scam-check`.

## Worked example (illustrative)

Watchlist: ABC, DEF and a bank stock held in the portfolio. 30 overnight headlines → 3 survive.

1. **ABC (fact, scheduled)** — Q3 net profit +28% y/y filed last evening, above the thesis bar of 20%. Watch: does price hold above 48.00 on today's volume?
2. **DEF (fact, surprise)** — board approved a rights offering 1:4 at 30 baht vs last close 45. Share count +25%. Watch: XR date and whether the thesis still holds after dilution.
3. **Bank holding (fact, scheduled)** — policy rate cut 0.25% at the MPC meeting. Lower rates usually squeeze bank margins. Watch: next quarter net interest margin.

Dropped: 27 items (global index moves, analyst targets for names not on the list, celebrity investor comments).
