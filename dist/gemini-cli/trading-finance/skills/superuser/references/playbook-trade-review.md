# playbook · trade-review — review trading results weekly or monthly

Use when: "summarise my trading results" · losing the same way again and again · the review cycle is due.
Main skill: `trade-journal` (mode 2, review results) · agent `trade-journal-coach`

## ขั้นตอน (Steps — copy into the todo as written)

1. Read the trade journal for that period only (filter by the date the position closed, do not open the whole file) and return a summary of at most 20 lines · ใคร: `trade-journal-coach` ตัวใหม่
2. Calculate win rate, expectancy and drawdown with `scripts/trade-stats.mjs` of `trade-journal` · ใคร: `trade-journal-coach` ตัวใหม่
3. Find the single most repeated error pattern, with real trades as examples · ใคร: `trade-journal-coach` ตัวใหม่
4. Turn it into 1 new rule that can be tested next month, and decide on last month's rule (keep · adjust · drop) · ใคร: `trade-journal-coach` ตัวใหม่ proposes, then it goes under "รออนุมัติ" (awaiting approval)
5. ตรวจ that recalculating the statistics matches the journal · ใคร: `reviewer` ตัวใหม่

## Done when

Statistics that have been recalculated, 1 error pattern, and 1 rule for next month.
