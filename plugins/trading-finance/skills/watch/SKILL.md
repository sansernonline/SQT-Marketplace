---
name: watch
description: Add, review, or clean the user's stock watchlist with the watchlist-setup skill. Produces a disciplined list with thesis, entry zone, and alerts per symbol.
argument-hint: <add|review|clean> [symbol or notes]
disable-model-invocation: true
---

Manage the watchlist with the `watchlist-setup` skill: **$ARGUMENTS**

- `add` — ask for thesis, entry zone, invalidation; append to the watchlist
- `review` — re-check every thesis against current data, kill dead ones
- `clean` — delete names without a written thesis (default max 10 symbols)

Always refresh data through installed market-data plugins and date every figure.
