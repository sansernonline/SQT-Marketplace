# decision-journal — examples and templates

## Example input for `payoff` and the result

```json
{"better":"high","options":["stay at A","take B","negotiate at A"],
 "scenarios":[{"name":"B bonus 0 months","p":0.3},{"name":"B bonus 1 month","p":0.4},{"name":"B bonus 2 months","p":0.3}],
 "table":{"stay at A":[624000,624000,624000],"take B":[720000,780000,840000],"negotiate at A":[672000,672000,672000]}}
```

Result when run: take B has the best expected value (780,000), the best worst case (720,000) and regret 0. That is only year-1 pay; growth, commute and the PVD loss go into a `score` run. Expected value and score disagree, or two options are close (`สูสี`) → the user decides, and writes why in the entry. Money and life decisions: supporting data, not advice.

## Worked example — full dated entry with revisit

## Worked example

**2026-10-06 — Accept the job offer at Company B, start 1 Dec 2026.** One-way-ish door (can return to market, cannot return to A).

Options: stay at A (52,000/month) · take B (60,000) · negotiate A counter-offer.
Facts: B base +15%; B bonus 0–2 months (no history known); A PVD match 5% vested after 5 years — I am at year 4, leaving forfeits about 125,000 plus returns (5% × 52,000 × 12 × 4 years; รอยืนยัน with HR); commute B 25 min shorter.
Reasoning: growth in role (8), salary (5), commute (9).
Pre-mortem: B's team lead leaves; bonus is zero. Early warning: no clear role scope by week 6.
Prediction: by 2027-06-01, leading one project, total pay ≥ A's last year, more evenings free.
State: excited. Revisit: 2027-06-01.

Revisit (2027-06-01): leading a project ✓, bonus 0.5 month, evenings ✓. Verdict: reasoning good / outcome good. Lesson: ask for bonus history in writing at offer stage next time.
