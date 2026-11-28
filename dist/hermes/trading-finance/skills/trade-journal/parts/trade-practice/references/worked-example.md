# Worked example · paper-trading

Capital 100,000 · rule `pullback-50ma` only · risk 1%. Trade #12: XYZ limit buy 31.50, stop 30.00.
- Size: risk/share 1.50 + costs ≈ 0.13 = 1.63 → 1,000 ÷ 1.63 = 613 → **600 shares** (18,900 baht = 18.9% of capital)
- Cap: 10% concentration limit (from `position-sizing`) → 300 shares, 9,450 baht
- Fill: low of the day was 31.50 exactly — touched, not traded through → **no fill**, logged `no-fill`
- Next day: it opened at 31.00, but the limit was a day order and had expired, so there is still no trade
- Lesson: counting this as a fill at 31.50 is exactly the "almost trade" that makes paper results look better than live ones
