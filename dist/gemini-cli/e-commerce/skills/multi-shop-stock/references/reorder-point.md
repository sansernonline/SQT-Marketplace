# Reorder point — formulas and worked example

Moved from `SKILL.md`. `scripts/stock-calc.mjs` computes all of this; open this file only to understand or check a result by hand.

```
Reorder point = average daily sales × supplier lead time (days) + safety stock
Safety stock  = (max daily sales × max lead time) − (average daily sales × average lead time)
Position      = available + on order (ordered, not yet arrived)
Reorder qty   = average daily sales × days of cover wanted − (position − reorder point)
```

Reorder only when position ≤ reorder point. Goods already on the way count, or the same gap gets ordered twice.

Worked example — `BAG-TOTE-BLK-L`, all channels together:

| Item | Value |
|---|---|
| Average daily sales (last 30 days) | 4.0 |
| Max daily sales (normal days, excl. 11.11) | 9 |
| Lead time average / max | 10 / 14 days |
| Safety stock | 9 × 14 − 4 × 10 = 126 − 40 = **86** |
| Reorder point | 4 × 10 + 86 = **126** |
| Days of cover wanted | 45 |
| Reorder qty when available = 126, nothing on order | 4 × 45 − (126 − 126) = **180** |
| Reorder qty when available = 126, 30 on order | position 156 > 126, so no order yet |
