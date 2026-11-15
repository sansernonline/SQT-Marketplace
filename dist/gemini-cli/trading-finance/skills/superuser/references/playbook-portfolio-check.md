# playbook · portfolio-check — check the portfolio and dividends

Use when: "how is the portfolio now" · end of the month · dividend season.
Main skill: `portfolio-snapshot` · `dividend-tracker` · `news-impact` · agent `market-analyst`

## ขั้นตอน (Steps — copy into the todo as written)

1. Read the holdings from the user's file and fetch current prices with their time, returned as a table of at most 20 rows · ใคร: `market-analyst` ตัวใหม่
2. Make a single page under `portfolio-snapshot` — weights · profit and loss · cash · income · concentration · ใคร: `market-analyst` ตัวใหม่
3. Summarise dividends under `dividend-tracker`: XD date · payment date · amount after tax · ใคร: `market-analyst` ตัวใหม่
4. Pick the news that affects the holdings, at most 5 items · ใคร: `market-analyst` ตัวใหม่
5. ตรวจ that the total value matches the sum of the individual holdings and that every price has a time · ใคร: `reviewer` ตัวใหม่

## Done when

A portfolio summary page whose totals match, and every price has a reference time.
