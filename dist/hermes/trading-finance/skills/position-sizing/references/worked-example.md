# Worked example · position-sizing

## Worked example

Capital 100,000 baht, risk 1% = **1,000 baht**. Entry 48.50, invalidation 48.00 → stop 0.50 below at **47.50** (on the 0.10 tick). Risk per share = 1.00. Round-trip cost ≈ 0.2% × 2 × 48.50 ≈ 0.19 → use **1.19**.

- Raw size = 1,000 ÷ 1.19 = 840 → round down to board lot = **800 shares**
- Position value = 800 × 48.50 = **38,800 baht = 38.8% of capital** → fails the 10% concentration check
- Cap at 10% → 10,000 ÷ 48.50 = 206 → **200 shares** (9,700 baht); real risk = 200 × 1.19 = **238 baht (0.24%)**

Size if the user takes the trade: 200 shares, stop 47.50; the concentration limit, not the stop, is the binding rule here. A wider stop at 45.50 (below the 46.00 swing low) would give risk 3.19/share → 313 → 300 shares, but still capped at 200 by concentration.
