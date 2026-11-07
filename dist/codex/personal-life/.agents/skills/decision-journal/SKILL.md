---
name: decision-journal
description: Use when facing a big personal decision (job change, condo, car, moving, lump sum). Records it, revisits.
argument-hint: <the decision, in one sentence>
---

# Decision Journal

Write down why you decided, so future-you cannot rewrite it — and so you can tell bad luck from bad judgement.

Entry and revisit templates: [references/entry-template.md](references/entry-template.md).

## When to write an entry

| Write one | Skip |
|---|---|
| Costs more than ~1 month of income, or locks money in for a year+ | Reversible within a week at low cost |
| Hard to undo (job, move, marriage-level, big purchase, loan) | Daily or repeated choices |
| Made under strong emotion, pressure or a sales deadline | Choices someone else makes for you |
| You notice yourself arguing with someone about it | |

## Workflow

1. **State the decision** in one sentence, with the date it takes effect.
2. **Classify the door** — two-way (reversible: decide fast) or one-way (irreversible: slow down, sleep on it).
3. **List the real options** — at least three, always including "do nothing / wait".
4. **Write the key facts** with numbers (price, monthly cost, time, salary) and what you do **not** know.
5. **Reasoning** — the two or three reasons that actually tip it, each with confidence 1–10 (10 = would bet a year's income on it; under 5 = a guess dressed as a reason, so find the fact or drop it). At the revisit, a 9 that turned out wrong is the lesson.
6. **Pre-mortem** — "It is one year later and this went badly. Why?" List the top 2 causes and what would warn you early.
7. **Prediction** — what you expect to observe, measurable, with a check-in date (3, 6 or 12 months).
8. **Emotional state** — calm / excited / anxious / pressured. One word.
9. **Schedule the revisit** in the calendar now.
10. **At the revisit** — fill the revisit block **without editing the original**, give the verdict, write one process lesson.

## Choose between options by numbers (`decision-scoring`)

Use this at step 3–5, once the options and the numbers exist. Pick the command by what is known:

| Situation | Command | Read the result as |
|---|---|---|
| The outcome depends on the future and the user can state the chances | `payoff` | expected value (ค่าคาดหวัง) = sum of chance × outcome |
| Chances unknown (a guess dressed as a number) or the door is one-way | `payoff`, read the **เสียดายมากสุด** column | minimax regret: pick the option whose worst regret is smallest |
| Several different criteria (money, time, growth), each option sure | `score` | weighted score after iron rules drop options |

Iron rules first (กฎเหล็ก): an option that breaks a limit the user set before looking (monthly payment above a fixed share of income, no emergency fund left) is dropped, not scored. Run `node decide.mjs payoff decision.json` or `score`. Example, the job offer in the worked example below (pay in year 1, baht, higher is better; chances 0.3 / 0.4 / 0.3 are the user's guess):

Example input (JSON for `payoff`) and the result when run: [references/scoring-example.md](references/scoring-example.md)

## Revisit verdict grid

| | Outcome good | Outcome bad |
|---|---|---|
| **Reasoning good** | Earned — repeat the process | Bad luck — do not overcorrect |
| **Reasoning bad** | Lucky — fix the process anyway | Learn — what signal was ignored? |

Judge the reasoning on what was knowable *then*, not on what happened.

## Thai-context checks for common big decisions

- **Buying a condo/house** — monthly instalment vs rent, transfer fees and taxes at the land office, common-area fee (ค่าส่วนกลาง), and whether the bank's approved loan is the user's comfortable payment; tax angle in `tax-deduction-planner` (trading-finance) if installed
- **Changing jobs** — total package not base salary: bonus history, provident fund (PVD) employer match and vesting, social security continuity, notice period in the contract; `payroll-th` (e-commerce) if installed
- **Lump-sum investing** — emergency fund first, then fit to the time horizon; product choice is outside this skill
- **Big purchase with a "today only" price** — that pressure is a reason to log, wait 48 hours, and compare (`buy-compare` in e-commerce if installed)

General information, not financial advice — for money decisions of this size talk to a licensed adviser or นักบัญชี.

## Worked example

A full dated entry with its revisit and verdict: [references/scoring-example.md](references/scoring-example.md)

## Rules

- Short beats detailed — if it cannot be stated in five lines, it is not decided yet
- Never edit the original entry; revisits are appended
- Log emotional decisions especially; they teach the most
- One file `decision-journal.md`, newest first, or one file per decision `YYYY-MM-DD-decision-topic.md`

Related: `weekly-review` (surfaces revisit dates) · `goal-and-habit`.

## เรียกเป็นคำสั่ง

`/personal-life:decision-journal <the decision, in one sentence>`

Run the `decision-journal` skill for: **$ARGUMENTS**

Confirms options considered and expected outcome, writes the dated entry, and sets the check-in reminder.
