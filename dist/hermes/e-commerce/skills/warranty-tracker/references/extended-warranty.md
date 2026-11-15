# Extended warranty — decision rule

Moved from `SKILL.md`. Open when a shop offers an extended plan at checkout.

Buy only if **all** are true:
- A repair would hurt your budget (not easily paid from savings)
- The plan pays off on expected cost: **chance the covered part fails during the extension x repair cost it covers > plan price**. Take the chance from the brand's failure reports or owner reviews and the repair cost from the service centre's quote, each written down with date and source. Example: 15% x 8,000 = 1,200, so a 3,900 plan fails the test
- No usable chance figure → the shortcut is plan price below about 10–15% of the item price (rule of thumb, kept as the fallback when there is no data), or compare buy vs skip with `decision-scoring` command `payoff` using minimax regret, only when you have no idea at all of the chance: scenarios = fails / does not fail; regret of buying = plan price (when it does not fail); regret of skipping = repair cost − plan price (when it fails); take the option with the smaller worst regret. So it picks "buy" only when the repair cost is above 2 times the plan price. Example with repair 8,000 and plan 3,900 (chance 15%): worst regret buy 3,900, skip 4,100 → minimax regret says buy, while the expected-value test above (1,200 < 3,900) says skip. The two disagree, so use the chance figure whenever you have one
- It covers what actually fails for this item (compressor, screen, accidental damage) — read exclusions
- The provider will exist and is reachable in 3 years; claims go to an authorised centre

Skip if: the item is cheap to replace · the credit card already extends the warranty (some do — check card benefits) · the plan duplicates the manufacturer warranty for the first year · you are likely to replace the item before it expires.

Worked example: laptop 32,000 baht, 2-year extension offered at 3,900 baht (12%). Common failure for this model per owner reviews: battery (≈ 2,500 baht to replace) — excluded by the plan as a consumable. **Skip**; set aside 3,900 in a repair fund instead.
