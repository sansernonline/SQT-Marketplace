---
name: "compare"
description: "Compare products or services before buying — decision matrix, total cost, review trust check."
disableModelInvocation: true
---

Run the `consumer-advocate` agent with the `buy-compare` skill: **$ARGUMENTS**

1. Missing must-haves, budget or how long the user plans to keep it → mark `(รอยืนยัน)` and list them; the lead asks once at the start.
2. Build the weighted decision matrix (5–7 criteria).
3. Calculate total cost of ownership over the expected life.
4. Check reviews with the trust signals and fake-review red flags.
5. Recommend one option with the reason, and note warranty terms to log in `warranty-tracker`.
