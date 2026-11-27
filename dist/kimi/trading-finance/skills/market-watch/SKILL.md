---
name: market-watch
description: Use for a watchlist, news that moves my stocks or price alerts
---

# market-watch — watchlist, news that matters and price alerts

> **One rule:** every watched name has a reason, every news item is tied to a holding or thesis, and an alert says what to look at next, never what to buy or sell.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Following new stocks, or rebuilding a watchlist | [references/watchlist-setup.md](references/watchlist-setup.md) |
| Which news or events matter for my stocks, or the week ahead | [references/news-impact.md](references/news-impact.md) |
| Price or news alerts on watched symbols, with cooldowns | [references/alert-set.md](references/alert-set.md) |

Templates: [references/watchlist-template.md](references/watchlist-template.md). Worked example: [references/worked-example.md](references/worked-example.md). The alert work is run by the `alert-dispatcher` agent.

## Steps every part shares

1. Tie each name or event to a reason the user wrote down: a thesis pillar or a holding.
2. Write down, before the event, what the user will do in each case (better than the thesis needs, as needed, worse).
3. Mark any date the company has not announced as "expected (not announced)".

## Check before done

- General information, not investment advice. The skill never gives a buy or sell call.
- An alert carries the symbol, the level or event and the time only, never holdings, amounts, cost or P/L.
- A new scheduled task or notification channel needs the user's OK first; show the schedule and the message format before setting it up.
- Never fill in a guessed date for news or results; "nothing scheduled" is a valid answer.
- Batch many symbol checks into one run, and respect the data source's rate limits.

Before any trade that follows from a news item, follow the playbook [pre-trade](../superuser/references/playbook-pre-trade.md).
